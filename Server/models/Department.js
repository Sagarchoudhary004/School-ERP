import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: true,
      trim: true,
    },
    departmentCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    hodName: {
      type: String,
      trim: true,
      default: "",
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

departmentSchema.index(
  { departmentCode: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

departmentSchema.index(
  { departmentName: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

export default mongoose.model("Department", departmentSchema);
