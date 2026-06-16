import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },

    dob: {
      type: Date,
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    guardianName: {
      type: String,
      required: true,
      trim: true,
    },

    guardianPhone: {
      type: String,
      required: true,
      trim: true,
    },

    guardianOccupation: {
      type: String,
      trim: true,
    },

    guardianEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    studentClass: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      required: true,
      trim: true,
    },

    admissionDate: {
      type: Date,
      required: true,
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    previousSchool: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Active", "Approved", "Rejected"],
      default: "Active",
    },

    studentPhoto: {
      type: String,
      default: "",
    },

    aadhaarCard: {
      type: String,
      default: "",
    },

    birthCertificate: {
      type: String,
      default: "",
    },

    transferCertificate: {
      type: String,
      default: "",
    },

    reportCard: {
      type: String,
      default: "",
    },

    otherDocuments: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Student",
  studentSchema
);
