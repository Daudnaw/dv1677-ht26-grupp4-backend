import asyncHandler from "express-async-handler";
import Document from "../models/documentModel.js";

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

  const updated = await document.save();
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

  await document.deleteOne();
  res.status(200).json({ message: "Document deleted" });
});
