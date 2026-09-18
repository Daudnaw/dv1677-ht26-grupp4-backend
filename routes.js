import express from 'express';
import { ObjectId } from 'mongodb';
import { connectDB } from './db/database.js';

const router = express.Router();

const COLLECTION_NAME = process.env.COLLECTION_NAME;

// Test route mongodb
router.get('/test-db', async (req, res) => {
    try {
        const db = await connectDB();

        await db.command({ ping: 1 });

        console.log('MongoDB connection OK');

        res.json({
            message: 'MongoDB connection OK'
        });
    } catch (error) {
        console.error('MongoDB connection failed:', error);

        res.status(500).json({
            error: 'MongoDB connection failed',
            details: error.message
        });
    }
});


// GET ALL documents
router.get('/documents', async (req, res) => {
    try {
        const db = await connectDB();

        const documents = await db
            .collection(COLLECTION_NAME)
            .find({})
            .toArray();

        res.json(documents);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// GET ONE document
router.get('/documents/:id', async (req, res) => {
    try {
        const db = await connectDB();

        const document = await db
            .collection(COLLECTION_NAME)
            .findOne({
                _id: new ObjectId(req.params.id)
            });

        if (!document) {
            return res.status(404).json({
                error: 'Document not found'
            });
        }

        res.json(document);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// CREATE document
router.post('/documents', async (req, res) => {
    try {
        const db = await connectDB();

        const result = await db
            .collection(COLLECTION_NAME)
            .insertOne(req.body);

        const document = await db
            .collection(COLLECTION_NAME)
            .findOne({
                _id: result.insertedId
            });

        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// UPDATE document
router.put('/documents/:id', async (req, res) => {
    try {
        const db = await connectDB();

        const result = await db
            .collection(COLLECTION_NAME)
            .updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: req.body }
            );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: 'Document not found'
            });
        }

        const document = await db
            .collection(COLLECTION_NAME)
            .findOne({
                _id: new ObjectId(req.params.id)
            });

        res.json(document);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// DELETE document
router.delete('/delete/:id', async (req, res) => {
    try {
        const db = await connectDB();

        const result = await db
            .collection(COLLECTION_NAME)
            .findOneAndDelete({
                _id: new ObjectId(req.params.id)
            });

        if (!result) {
            return res.status(404).json({
                error: 'Document not found'
            });
        }

        res.json({
            message: 'Document deleted',
            document: result
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

export default router;
