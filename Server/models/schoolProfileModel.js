import mongoose from "mongoose";

const schoolProfileSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
      required: true,
    },
    establishedYear: {
      type: String,
      required: true,
    },
    boardAffiliation: String,
    schoolType: String,

    email: {
      type: String,
      required: true,
    },
    phone: String,
    website: String,
    address: String,

    chairman: String,
    principal: String,
    vicePrincipal: String,
    adminHead: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "SchoolProfile",
  schoolProfileSchema
);