import mongoose from "mongoose";

const examTypeSchema = new mongoose.Schema(
  {
    examName: {
      type: String,
      required: true,
      trim: true,
    },
    examCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    weightage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
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

examTypeSchema.index(
  { examCode: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

examTypeSchema.index(
  { examName: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

export default mongoose.model("ExamType", examTypeSchema);
