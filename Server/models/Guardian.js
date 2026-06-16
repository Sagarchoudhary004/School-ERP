import mongoose from "mongoose";

const guardianSchema = new mongoose.Schema(
  {
    guardianName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    occupation: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Guardian",
  guardianSchema
);