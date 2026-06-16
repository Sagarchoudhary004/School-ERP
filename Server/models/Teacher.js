import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    employeeCode: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    dob: Date,

    gender: String,

    joinDate: Date,

    qualification: String,

    experience: String,

    bankName: String,

    accountNumber: String,

    ifscCode: String,

    monthlySalary: Number,

    panNumber: String,

    epfNumber: String,

    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Teacher", teacherSchema);