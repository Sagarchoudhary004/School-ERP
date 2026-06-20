import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema(
  {
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },
    classGroup: {
      type: String,
      required: true,
      trim: true,
    },
    tuition: {
      type: Number,
      default: 0,
      min: 0,
    },
    admission: {
      type: Number,
      default: 0,
      min: 0,
    },
    exam: {
      type: Number,
      default: 0,
      min: 0,
    },
    annual: {
      type: Number,
      default: 0,
      min: 0,
    },
    waiverSC: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    waiverST: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    waiverOBC: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// One fee structure per academic year + class group
feeStructureSchema.index(
  { academicYear: 1, classGroup: 1 },
  { unique: true }
);

export default mongoose.model("FeeStructure", feeStructureSchema);
