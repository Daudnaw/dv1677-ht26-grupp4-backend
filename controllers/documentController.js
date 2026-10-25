import asyncHandler from "express-async-handler";
import Document from "../models/documentModel.js";
import User from "../models/userModel.js";
import Comment from "../models/commentModel.js";
import notifiera from '../services/notify.js';

export const createDocument = asyncHandler(async (req, res) => {
  const { title, content, type } = req.body;

  if (!title || !type) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const document = await Document.create({
    title,
    content: content || "",
    type,
    owners: [req.user.id]
  });

  res.status(201).json(document);
});

export const getDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ owners: req.user.id });
  res.status(200).json(documents);
});

export const getDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error("Document not found");
  }

  if (!document.owners.includes(req.user.id)) {
    res.status(403);
    throw new Error("Forbidden");
  }

  res.status(200).json(document);
});

export const updateDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error("Document not found");
  }

  if (!document.owners.includes(req.user.id)) {
    res.status(403);
    throw new Error("Forbidden");
  }

  document.title = req.body.title ?? document.title;
  document.content = req.body.content ?? document.content;
  document.type = req.body.type ?? document.type;

  const room = `doc:${req.params.id}`;
  const io = req.app.get('io');

  const updated = await document.save();

  io?.to(room).emit(
    'document:updated',
    updated
  );

  res.status(200).json(updated);
});

export const shareDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error("Document not found");
  }

  if (!document.owners.includes(req.user.id)) {
    res.status(403);
    throw new Error("Forbidden");
  }

  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (document.owners.some((owner) => owner.toString() === user._id.toString())) {
    res.status(400);
    throw new Error("Document is already shared with this user");
  }

  document.owners.push(user._id);

  const updated = await document.save();

  notifiera(
      `📄 Dokumentet "${document.title}" has been shared with ${email}.`
  );

  res.status(200).json(updated);
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error("Document not found");
  }

  if (!document.owners.includes(req.user.id)) {
    res.status(403);
    throw new Error("Forbidden");
  }

  await Comment.deleteMany({ documentId: document._id });
  await document.deleteOne();
  res.status(200).json({ message: "Document and its comments deleted" });
});