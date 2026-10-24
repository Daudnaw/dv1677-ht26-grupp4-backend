import express from 'express';
import cors from 'cors';
import routes from '../routes.js';
import connectDB from "./database.js";
connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Simple mongodb api' });
});

export default app;