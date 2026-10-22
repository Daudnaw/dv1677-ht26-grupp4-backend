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

        //console.log(`MongoDB connected: ${dbName}`);

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

export { closeDB };
export default connectDB;
