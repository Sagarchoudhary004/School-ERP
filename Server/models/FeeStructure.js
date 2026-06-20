import mongoose from "mongoose";

const componentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const feeStructureSchema = new mongoose.Schema(
  {
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    className: { type: String, required: true, trim: true },
    components: {
      type: [componentSchema],
      validate: [(items) => items.length > 0, "At least one fee component is required"],
    },
    totalFee: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

feeStructureSchema.index({ academicYear: 1, className: 1 }, { unique: true });

export default mongoose.model("FeeStructure", feeStructureSchema);
