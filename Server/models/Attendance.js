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
      default: null,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
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

// Prevent duplicate attendance records per student per day
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

// Prevent duplicate attendance records per teacher per day
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
