import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add the document title"]
    },
    content: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      enum: ["text", "code"],
      required: [true, "Please specify document type"]
    },
    owners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Document", documentSchema);
