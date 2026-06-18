import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["Class", "Student"],
      required: true,
    },
    targetClass: {
      type: String,
      trim: true,
      required: function () {
        return this.type === "Class";
      },
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: function () {
        return this.type === "Student";
      },
    },
    academicYear: {
      type: String,
      trim: true,
      default: "2026-27",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FeeStructure", feeStructureSchema);
