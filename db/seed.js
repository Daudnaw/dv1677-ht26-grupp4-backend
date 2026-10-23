import fs from 'fs/promises';
import { connectDB } from './database.js';

console.log("SEED STARTAR");
const documents = JSON.parse(
    await fs.readFile('./db/document.json', 'utf-8')
);

try {
    const db = await connectDB();

    const collection = db.collection(
        process.env.COLLECTION_NAME
    );

    await collection.deleteMany({});

    const result = await collection.insertMany(documents);

    console.log(`Inserted ${result.insertedCount} documents`);

    process.exit(0);
} catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
}
