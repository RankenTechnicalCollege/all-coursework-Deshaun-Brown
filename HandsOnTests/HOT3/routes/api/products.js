import express from 'express';
import Joi from 'joi';
import debug from 'debug';
import { getProductCollection, ObjectId } from '../../database.js';

const debugProduct = debug('app:ProductRouter');

const router = express.Router();

// Utility to escape user input for use in a RegExp
function escapeRegExp(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const productSchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().allow('').optional(),
	category: Joi.string().required(),
	price: Joi.number().required()
});

// PATCH schema: at least one field must be present
const productPatchSchema = Joi.object({
	name: Joi.string().optional(),
	description: Joi.string().allow('').optional(),
	category: Joi.string().optional(),
	price: Joi.number().optional()
}).min(1);

// GET /api/products - list all products
router.get('/', async (req, res) => {
	try {
		debugProduct('GET /api/products called');
		const col = await getProductCollection();
		const products = await col.find({}).toArray();
		debugProduct(`Found ${products.length} products`);
		return res.status(200).json(products);
	} catch (err) {
		debugProduct('Failed to list products:', err);
		return res.status(500).json({ message: 'Failed to list products', error: err.message });
	}
});

// GET /api/products/name/:productName - find product by name (case-insensitive exact match)
// Note: This router is mounted at `/api/products`, so the route path here should NOT repeat that prefix.
router.get('/name/:productName', async (req, res) => {
	try {
		const rawName = req.params.productName ?? '';
		const cleanName = rawName.trim(); // remove leading/trailing whitespace/newlines

		if (!cleanName) {
			return res.status(400).json({ message: 'Product name is required' });
		}

		const col = await getProductCollection();
		// Case-insensitive exact match on name
		const regex = new RegExp(`^${escapeRegExp(cleanName)}$`, 'i');
		const product = await col.findOne({ name: { $regex: regex } });

		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		debugProduct(`Found product by name: ${cleanName}`);
		return res.status(200).json(product);
	} catch (err) {
		debugProduct('Failed to get product by name:', err);
		return res.status(500).json({ message: 'Failed to get product by name', error: err.message });
	}
});

// GET /api/products/:id - find by id
router.get('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		if (!ObjectId.isValid(id)) return res.status(404).json({ message: 'Invalid productId' });
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
router.post('/', async (req, res) => {
	try {
		const { error, value } = productSchema.validate(req.body);
		if (error) return res.status(400).json({ message: 'Validation failed', details: error.details });

		const col = await getProductCollection();
		const now = new Date();
		const doc = {
			name: value.name,
			description: value.description || '',
			category: value.category,
			price: value.price,
			createdOn: now,
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
router.patch('/:productId', async (req, res) => {
	try {
		const productId = req.params.productId;
		if (!ObjectId.isValid(productId)) return res.status(404).json({ message: 'Invalid productId' });

		const { error, value } = productPatchSchema.validate(req.body);
		if (error) return res.status(400).json({ message: 'Validation failed', details: error.details });

		const col = await getProductCollection();
		const updateDoc = { $set: { ...value, lastUpdatedOn: new Date() } };
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
router.delete('/:productId', async (req, res) => {
	try {
		const productId = req.params.productId;
		if (!ObjectId.isValid(productId)) return res.status(404).json({ message: 'Invalid productId' });

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

