import mongoose from "mongoose";

const designationSchema = new mongoose.Schema(
  {
    designationName: {
      type: String,
      required: true,
      trim: true,
    },
    designationCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
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

designationSchema.index(
  { designationCode: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

designationSchema.index(
  { designationName: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

export default mongoose.model("Designation", designationSchema);
