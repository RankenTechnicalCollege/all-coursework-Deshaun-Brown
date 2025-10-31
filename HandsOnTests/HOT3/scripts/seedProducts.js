import { getProductCollection } from '../database.js';
import debug from 'debug';


const debugSeed = debug('app:SeedProducts');


(async () => {
  try {
    const collection = await getProductCollection();
    
    // Create unique index on name
    await collection.createIndex({ name: 1 }, { unique: true });
    
    // Create indexes for search and sorting
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ price: 1 });
    await collection.createIndex({ createdAt: -1 });
    
    // Clear existing products
    await collection.deleteMany({});
    
    // Insert sample products
    const result = await collection.insertMany(sampleProducts);
    debugSeed(`Inserted ${result.insertedCount} products`);
    
    console.log('Successfully seeded products collection');
    process.exit(0);
  } catch (error) {
    debugSeed('Error seeding products:', error);
    process.exit(1);
  }
})();