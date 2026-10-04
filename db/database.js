import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    const dbURI = process.env.MONGODB_URI;
    const dbName = process.env.DATABASE_NAME;

    try {
        await mongoose.connect(dbURI, {
            dbName,
        });

        console.log(`MongoDB connected: ${dbName}`);

        return mongoose.connection;
    } catch (error) {
        console.error("Connection failed:", error);
        throw error;
    }
};

const closeDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
};

//export { connectDB, closeDB };
export { closeDB };
export default connectDB;


/** 
import { MongoClient } from 'mongodb';

let client = null;

const getClient = async () => {
    if (!client) {
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
    }
    return client;
};

const connectDB = async () => {
    const c = await getClient();
    return c.db(process.env.DATABASE_NAME);
};

const closeDB = async () => {
  if (client) {
    await client.close();
    client = null;
  }
};

export { connectDB, closeDB };
*/