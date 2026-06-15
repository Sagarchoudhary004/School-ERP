import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    categoryCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

categorySchema.index(
  { categoryCode: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

categorySchema.index(
  { categoryName: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

export default mongoose.model("Category", categorySchema);
