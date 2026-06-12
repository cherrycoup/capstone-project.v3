import mongoose from "mongoose";

const blockedDateSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
    reason: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  },
  { timestamps: true }
);

export default mongoose.model("BlockedDate", blockedDateSchema);
