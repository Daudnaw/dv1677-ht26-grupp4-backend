import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import Document from "../models/documentModel.js";
import Comment from "../models/commentModel.js";

const dbURI = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

const seed = async () => {
  await mongoose.connect(dbURI, {
              dbName,
          });

  await User.deleteMany();
  await Document.deleteMany();
  await Comment.deleteMany();

  const password1 = await bcrypt.hash("test123", 10);
  const password2 = await bcrypt.hash("test456", 10);

  const user1 = await User.create({
    email: "test1@example.com",
    password: password1,
    role: "user"
  });

  const user2 = await User.create({
    email: "test2@example.com",
    password: password2,
    role: "user"
  });

  const document = await Document.create({
    title: "Seeded Document1",
    content: "Hello",
    type: "text",
    owners: [user1._id]
  });

  const comment1 = await Comment.create({
    documentId: document._id,
    userId: user1._id,
    lineNumber: 1,
    text: "test1 comment"
  });

  const comment2 = await Comment.create({
    documentId: document._id,
    userId: user2._id,
    lineNumber: 2,
    text: "test2 comment"
  });

  console.log("Users:", user1, user2);
  console.log("Document:", document);
  console.log("Comments:", comment1, comment2);

  await mongoose.disconnect();
};

seed();
