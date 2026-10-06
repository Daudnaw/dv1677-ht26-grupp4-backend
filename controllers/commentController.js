import asyncHandler from "express-async-handler";
import Comment from "../models/commentModel.js";
import Document from "../models/documentModel.js";

export const addComment = asyncHandler(async (req, res) => {
  const { documentId, lineNumber, text } = req.body;

  if (!documentId || !lineNumber || !text) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const document = await Document.findById(documentId);

  if (!document) {
    res.status(404);
    throw new Error("Document not found");
  }

  if (!document.owners.includes(req.user.id)) {
    res.status(403);
    throw new Error("Forbidden");
  }

  const comment = await Comment.create({
    documentId,
    userId: req.user.id,
    lineNumber,
    text
  });

  res.status(201).json(comment);
});

export const getCommentsForDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.documentId);

  if (!document) {
    res.status(404);
    throw new Error("Document not found");
  }

  if (!document.owners.includes(req.user.id)) {
    res.status(403);
    throw new Error("Forbidden");
  }

  const comments = await Comment.find({ documentId: req.params.documentId });
  res.status(200).json(comments);
});

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  if (comment.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Forbidden");
  }

  comment.text = req.body.text ?? comment.text;
  comment.lineNumber = req.body.lineNumber ?? comment.lineNumber;

  const updated = await comment.save();
  res.status(200).json(updated);
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  if (comment.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Forbidden");
  }

  await comment.deleteOne();
  res.status(200).json({ message: "Comment deleted" });
});
