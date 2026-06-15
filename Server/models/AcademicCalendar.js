import mongoose from "mongoose";

const academicCalendarSchema = new mongoose.Schema(
  {
    eventTitle: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        "Holiday",
        "Examination",
        "Activity",
        "Meeting",
        "Function",
      ],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
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

export default mongoose.model(
  "AcademicCalendar",
  academicCalendarSchema
);
