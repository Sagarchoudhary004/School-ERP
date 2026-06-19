import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    userType: {
      type: String,
      enum: ["Student", "Teacher"],
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave"],
      required: true,
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance records per user per day
// Use $type instead of $exists so that null values don't match the index
attendanceSchema.index(
  { date: 1, student: 1 },
  {
    unique: true,
    partialFilterExpression: {
      userType: "Student",
      student: { $type: "objectId" },
    },
  }
);
attendanceSchema.index(
  { date: 1, teacher: 1 },
  {
    unique: true,
    partialFilterExpression: {
      userType: "Teacher",
      teacher: { $type: "objectId" },
    },
  }
);

export default mongoose.model("Attendance", attendanceSchema);
