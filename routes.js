import express from "express";
import userRoutes from "./routes/userRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/documents", documentRoutes);


export default router;
