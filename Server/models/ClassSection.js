import mongoose from "mongoose";

const classSectionSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true,
    },
    classCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    sectionName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    sectionCapacity: {
      type: Number,
      required: true,
      min: 1,
    },
    classTeacher: {
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

classSectionSchema.index(
  { classCode: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

classSectionSchema.index(
  { className: 1, sectionName: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

export default mongoose.model("ClassSection", classSectionSchema);
