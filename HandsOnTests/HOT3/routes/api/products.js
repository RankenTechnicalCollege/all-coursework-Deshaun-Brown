import express from 'express';
import Joi from 'joi';
import debug from 'debug';
import { getProductCollection, ObjectId, searchProducts } from '../../database.js';
import { isAuthenticated } from '../../middleware/isAuthenticated.js';
import { hasRole } from '../../middleware/hasRole.js';
import { validId } from '../../middleware/validId.js';
import { validate } from '../../middleware/validate.js';

const debugProduct = debug('app:ProductRouter');

const router = express.Router();

// Utility to escape user input for use in a RegExp
async function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  category: Joi.string().required(),
  price: Joi.number().required()
});

// Query parameter validation schema
const searchSchema = Joi.object({
  keywords: Joi.string().optional(),
  category: Joi.string().optional(),
  maxPrice: Joi.number().optional(),
  minPrice: Joi.number().optional(),
  sortBy: Joi.string().valid('name', 'category', 'lowestPrice', 'newest').default('name'),
  pageSize: Joi.number().default(5),
  pageNumber: Joi.number().default(1)
}).optional();

// PATCH schema/update: at least one field must be present
const productPatchSchema = Joi.object({
	name: Joi.string().optional(),
	description: Joi.string().allow('').optional(),
	category: Joi.string().optional(),
	price: Joi.number().optional()
}).min(1);

// GET /api/products - Search products with filters
router.get('/', async (req, res) => {
  try {
    debugProduct('GET /api/products called with query:', req.query);

    // Validate and process query parameters
    const { error, value } = searchSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        message: 'Invalid search parameters',
        details: error.details
      });
    }

    // Search products with validated parameters
    const products = await searchProducts(value);
    
    debugProduct(`Found ${products.length} products matching search criteria`);
    return res.status(200).json(products);
  } catch (err) {
    debugProduct('Failed to search products:', err);
		return res.status(500).json({ message: 'Failed to list products', error: err.message });
	}
});

// GET /api/products/name/:productName - find products by partial name match (case-insensitive)
// Note: This router is mounted at `/api/products`, so the route path here should NOT repeat that prefix.
router.get('/name/:productName', isAuthenticated, async (req, res) => {
	try {
		const rawName = req.params.productName ?? '';
		const cleanName = rawName.trim(); // remove leading/trailing whitespace/newlines

		if (!cleanName) {
			return res.status(400).json({ message: 'Product name is required' });
		}

		const col = await getProductCollection();
		// Case-insensitive partial match on name (contains search term)
		const regex = new RegExp(await escapeRegExp(cleanName), 'i');
		const products = await col.find({ name: { $regex: regex } }).toArray();

		if (products.length === 0) {
			return res.status(404).json({ message: 'No products found' });
		}

		debugProduct(`Found ${products.length} product(s) matching: ${cleanName}`);
		return res.status(200).json(products);
	} catch (err) {
		debugProduct('Failed to get products by name:', err);
		return res.status(500).json({ message: 'Failed to get products by name', error: err.message });
	}
});

// GET /api/products/:productId - DO NOT USE THE COLON WHEN PLACING THE ID find by id
router.get('/:productId', validId('productId'), isAuthenticated, async (req, res) => {
	try {
		const id = req.params.productId;
		const col = await getProductCollection();
		const product = await col.findOne({ _id: new ObjectId(id) });
		if (!product) return res.status(404).json({ message: 'Product not found' });
		debugProduct(`Found product by id: ${id}`);
		return res.status(200).json(product);
	} catch (err) {
		debugProduct('Failed to get product:', err);
		return res.status(500).json({ message: 'Failed to get product', error: err.message });
	}
});

// POST /api/products - create
router.post('/', hasRole('admin'), validate(productSchema), async (req, res) => {
	try {
		const col = await getProductCollection();
		const now = new Date();
		const doc = {
			name: req.body.name,
			description: req.body.description || '',
			category: req.body.category,
			price: req.body.price,
			createdAt: now,
			lastUpdatedOn: now
		};
		const result = await col.insertOne(doc);
		debugProduct(`Product created: ${result.insertedId}`);
		return res.status(200).json({ message: 'Product created', productId: result.insertedId.toString() });
	} catch (err) {
		debugProduct('Failed to create product:', err);
		return res.status(500).json({ message: 'Failed to create product', error: err.message });
	}
});

// PATCH /api/products/:productId - partial update
router.patch('/:productId', hasRole('admin'), validId('productId'), validate(productPatchSchema), async (req, res) => {
	try {
		const productId = req.params.productId;

		const col = await getProductCollection();
		const updateDoc = { $set: { ...req.body, lastUpdatedOn: new Date() } };
		const result = await col.updateOne({ _id: new ObjectId(productId) }, updateDoc);
		if (result.matchedCount === 0) return res.status(404).json({ message: 'Product not found' });
		debugProduct(`Product updated: ${productId}`);
		return res.status(200).json({ message: 'Product updated', productId });
	} catch (err) {
		debugProduct('Failed to update product:', err);
		return res.status(500).json({ message: 'Failed to update product', error: err.message });
	}
});

// PUT /api/products/:id - full replace (validate body)
router.put('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		if (!ObjectId.isValid(id)) return res.status(404).json({ message: 'Invalid productId' });

		const { error, value } = productSchema.validate(req.body);
		if (error) return res.status(400).json({ message: 'Validation failed', details: error.details });

		const col = await getProductCollection();
		const update = { $set: { ...value, lastUpdatedOn: new Date() } };
		const result = await col.updateOne({ _id: new ObjectId(id) }, update);
		if (result.matchedCount === 0) return res.status(404).json({ message: 'Product not found' });
		debugProduct(`Product replaced/updated: ${id}`);
		return res.status(200).json({ message: 'Product updated', productId: id });
	} catch (err) {
		debugProduct('Failed to update product:', err);
		return res.status(500).json({ message: 'Failed to update product', error: err.message });
	}
});

// DELETE /api/products/:productId - delete
router.delete('/:productId', hasRole('admin'), validId('productId'), async (req, res) => {
	try {
		const productId = req.params.productId;

		const col = await getProductCollection();
		const result = await col.deleteOne({ _id: new ObjectId(productId) });
		if (result.deletedCount === 0) return res.status(404).json({ message: 'Product not found' });
		debugProduct(`Product deleted: ${productId}`);
		return res.status(200).json({ message: 'Product deleted', productId });
	} catch (err) {
		debugProduct('Failed to delete product:', err);
		return res.status(500).json({ message: 'Failed to delete product', error: err.message });
	}
});

export default router;

