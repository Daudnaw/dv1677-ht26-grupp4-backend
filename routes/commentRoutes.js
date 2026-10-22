import express from "express";
import validateToken from "../middleware/validateToken.js";
import {
  addComment,
  getCommentsForDocument,
  updateComment,
  deleteComment
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", validateToken, addComment);
router.get("/:documentId", validateToken, getCommentsForDocument);
router.put("/:id", validateToken, updateComment);
router.delete("/:id", validateToken, deleteComment);

export default router;
