import { ObjectId } from 'mongodb';
import { connectDB } from './db/database.js';

const COLLECTION_NAME = process.env.COLLECTION_NAME;

async function getCollection() {
    const db = await connectDB();

    return db.collection(COLLECTION_NAME);
}

export async function getAll() {
    const collection = await getCollection();

    return await collection.find({}).toArray();
}

export async function getOne(id) {
    const collection = await getCollection();

    return await collection.findOne({
        _id: new ObjectId(id)
    });
}

export async function addOne(document) {
    const collection = await getCollection();

    const result = await collection.insertOne(document);

    return result;
}

export async function updateOne(document) {
    const collection = await getCollection();

    const id = document.id || document._id;

    const { id: _, _id: __, ...data } = document;

    return await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
    );
}
