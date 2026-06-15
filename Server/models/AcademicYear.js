import mongoose from "mongoose";

const academicYearSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim:true
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isCurrent: {
      type: Boolean,
      default: false,
    },
    isActive: {
    type: Boolean,
    default: true,
  },
  },
  {
    timestamps: true,
  }
);

academicYearSchema.index(
  { name: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isActive: true,
    },
  }
);

export default mongoose.model(
  "AcademicYear",
  academicYearSchema
);
