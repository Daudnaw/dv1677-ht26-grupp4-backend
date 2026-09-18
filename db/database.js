import { MongoClient } from 'mongodb';

const connectDB = async () => {
    try {
        const dbURI = process.env.NODE_ENV === "test"
            ? process.env.MONGODB_TEST_URI
            : process.env.MONGODB_URI;

        const dbName = process.env.NODE_ENV === "test"
            ? process.env.MONGODB_TEST_DATABASE_NAME
            : process.env.DATABASE_NAME;

        const client = new MongoClient(dbURI);
        await client.connect();

        return client.db(dbName);
    } catch (error) {
        console.error('connection failed:', error);
        process.exit(1);
    }
};

export { connectDB };
