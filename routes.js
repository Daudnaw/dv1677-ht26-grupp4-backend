import express from "express";
import userRoutes from "./routes/userRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/documents", documentRoutes);
router.use("/comments", commentRoutes);

export default router;
