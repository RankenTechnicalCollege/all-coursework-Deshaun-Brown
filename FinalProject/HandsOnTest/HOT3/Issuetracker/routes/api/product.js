import express from 'express';
import debug from 'debug';
import { connect, newId, isValidId, saveAuditLog } from '../../database.js';
import { requirePermission } from '../../middleware/roles.js';
import { isAuthenticated } from '../../middleware/isAuthenticated.js';
import joi from 'joi';

const debugProduct = debug('app:ProductRouter');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// Define Joi schemas
const createProductSchema = joi.object({
  name: joi.string().min(1).required(),
  description: joi.string().min(1).required(),
  price: joi.number().positive().required(),
  category: joi.string().min(1).required(),
  stock: joi.number().integer().min(0).optional()
});

const updateProductSchema = joi.object({
  name: joi.string().min(1).optional(),
  description: joi.string().min(1).optional(),
  price: joi.number().positive().optional(),
  category: joi.string().min(1).optional(),
  stock: joi.number().integer().min(0).optional()
});

// GET /api/products - List all products (canViewData required)
router.get('/', isAuthenticated, requirePermission('canViewData'), async (req, res) => {
  try {
    debugProduct('GET /api/products called');
    const { 
      name, 
      category, 
      minPrice, 
      maxPrice, 
      sortBy = 'newest', 
      pageSize = 10, 
      pageNumber = 1 
    } = req.query;

    const db = await connect();
    const query = {};

    // Name search (case-insensitive partial match)
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Sorting
    let sortObject = {};
    switch (sortBy) {
      case 'newest':
        sortObject = { createdAt: -1 };
        break;
      case 'oldest':
        sortObject = { createdAt: 1 };
        break;
      case 'name':
        sortObject = { name: 1 };
        break;
      case 'price-asc':
        sortObject = { price: 1 };
        break;
      case 'price-desc':
        sortObject = { price: -1 };
        break;
      default:
        sortObject = { createdAt: -1 };
    }

    // Pagination
    const pageSizeNum = parseInt(pageSize) || 10;
    const pageNumberNum = parseInt(pageNumber) || 1;
    const skipCount = (pageNumberNum - 1) * pageSizeNum;

    const products = await db.collection('products')
      .find(query)
      .sort(sortObject)
      .skip(skipCount)
      .limit(pageSizeNum)
      .toArray();

    const totalCount = await db.collection('products').countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSizeNum);

    debugProduct(`Found ${products.length} products (page ${pageNumberNum} of ${totalPages})`);

    res.json({
      products: products,
      pagination: {
        currentPage: pageNumberNum,
        pageSize: pageSizeNum,
        totalProducts: totalCount,
        totalPages: totalPages,
        hasNextPage: pageNumberNum < totalPages,
        hasPreviousPage: pageNumberNum > 1
      }
    });
  } catch (error) {
    debugProduct('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/products/:productId - Get product by ID (canViewData required)
router.get('/:productId', isAuthenticated, requirePermission('canViewData'), async (req, res) => {
  try {
    const { productId } = req.params;
    debugProduct(`GET /api/products/${productId} called`);

    if (!isValidId(productId)) {
      debugProduct(`Invalid ObjectId: ${productId}`);
      return res.status(404).json({ error: `productId ${productId} is not a valid ObjectId.` });
    }

    const db = await connect();
    const product = await db.collection('products').findOne({ _id: newId(productId) });

    if (!product) {
      debugProduct(`Product ${productId} not found`);
      return res.status(404).json({ error: `Product ${productId} not found.` });
    }

    debugProduct(`Product ${productId} found`);
    res.json(product);
  } catch (error) {
    debugProduct('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/products/new - Create new product (canCreateBug required - reusing permission)
router.post('/new', isAuthenticated, requirePermission('canCreateBug'), async (req, res) => {
  try {
    debugProduct('POST /api/products/new called');

    const validateResult = createProductSchema.validate(req.body);
    if (validateResult.error) {
      debugProduct(`Validation error: ${validateResult.error}`);
      return res.status(400).json({ error: validateResult.error.details[0].message });
    }

    const { name, description, price, category, stock } = validateResult.value;

    const db = await connect();

    const newProduct = {
      name,
      description,
      price,
      category,
      stock: stock ?? 0,
      createdAt: new Date(),
      createdBy: req.user?.email || 'unknown',
      updatedAt: new Date()
    };

    const result = await db.collection('products').insertOne(newProduct);
    debugProduct(`New product created with ID: ${result.insertedId}`);

    try {
      await saveAuditLog({
        col: 'product',
        op: 'insert',
        target: { productId: String(result.insertedId) },
        update: newProduct,
        performedBy: req.user?.email || 'unknown',
      });
    } catch {}

    res.status(201).json({ 
      message: "Product created successfully!", 
      productId: result.insertedId,
      product: { ...newProduct, _id: result.insertedId }
    });
  } catch (error) {
    debugProduct('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/products/:productId - Update product (canEditAnyBug required - reusing permission)
router.patch('/:productId', isAuthenticated, requirePermission('canEditAnyBug'), async (req, res) => {
  try {
    const { productId } = req.params;
    debugProduct(`PATCH /api/products/${productId} called`);

    if (!isValidId(productId)) {
      debugProduct(`Invalid ObjectId: ${productId}`);
      return res.status(404).json({ error: `productId ${productId} is not a valid ObjectId.` });
    }

    const validateResult = updateProductSchema.validate(req.body);
    if (validateResult.error) {
      debugProduct(`Validation error: ${validateResult.error}`);
      return res.status(400).json({ error: validateResult.error.details[0].message });
    }

    const db = await connect();
    const product = await db.collection('products').findOne({ _id: newId(productId) });

    if (!product) {
      debugProduct(`Product ${productId} not found for update`);
      return res.status(404).json({ error: `Product ${productId} not found.` });
    }

    const { name, description, price, category, stock } = validateResult.value;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (price !== undefined) updateFields.price = price;
    if (category) updateFields.category = category;
    if (stock !== undefined) updateFields.stock = stock;

    updateFields.updatedAt = new Date();
    updateFields.updatedBy = req.user?.email || 'unknown';

    await db.collection('products').updateOne(
      { _id: newId(productId) },
      { $set: updateFields }
    );

    debugProduct(`Product ${productId} updated`);

    try {
      await saveAuditLog({
        col: 'product',
        op: 'update',
        target: { productId },
        update: updateFields,
        performedBy: req.user?.email || 'unknown',
      });
    } catch {}

    res.status(200).json({ 
      message: `Product ${productId} updated!`, 
      productId: productId 
    });
  } catch (error) {
    debugProduct('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/products/:productId - Delete product (canCloseAnyBug required - reusing permission)
router.delete('/:productId', isAuthenticated, requirePermission('canCloseAnyBug'), async (req, res) => {
  try {
    const { productId } = req.params;
    debugProduct(`DELETE /api/products/${productId} called`);

    if (!isValidId(productId)) {
      debugProduct(`Invalid ObjectId: ${productId}`);
      return res.status(404).json({ error: `productId ${productId} is not a valid ObjectId.` });
    }

    const db = await connect();
    const product = await db.collection('products').findOne({ _id: newId(productId) });

    if (!product) {
      debugProduct(`Product ${productId} not found for deletion`);
      return res.status(404).json({ error: `Product ${productId} not found.` });
    }

    await db.collection('products').deleteOne({ _id: newId(productId) });

    debugProduct(`Product ${productId} deleted`);

    try {
      await saveAuditLog({
        col: 'product',
        op: 'delete',
        target: { productId },
        update: { deletedProduct: product },
        performedBy: req.user?.email || 'unknown',
      });
    } catch {}

    res.status(200).json({ 
      message: `Product ${productId} deleted successfully!` 
    });
  } catch (error) {
    debugProduct('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as ProductRouter };