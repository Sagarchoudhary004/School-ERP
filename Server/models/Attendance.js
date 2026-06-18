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
attendanceSchema.index({ date: 1, student: 1 }, { unique: true, sparse: true });
attendanceSchema.index({ date: 1, teacher: 1 }, { unique: true, sparse: true });

export default mongoose.model("Attendance", attendanceSchema);
