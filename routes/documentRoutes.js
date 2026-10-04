import express from "express";
import validateToken from "../middleware/validateToken.js";
import {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument
} from "../controllers/documentController.js";

const router = express.Router();

router.post("/", validateToken, createDocument);
router.get("/", validateToken, getDocuments);
router.get("/:id", validateToken, getDocument);
router.put("/:id", validateToken, updateDocument);
router.delete("/:id", validateToken, deleteDocument);

export default router;
