import mongoose from "mongoose";

const studentDocumentSchema =
new mongoose.Schema(
{
  studentPhoto: String,

  aadhaarCard: String,

  birthCertificate: String,

  transferCertificate: String,

  reportCard: String,

  otherDocuments: String,

  declaration: Boolean,
},
{
  timestamps: true,
}
);

export default mongoose.model(
  "StudentDocuments",
  studentDocumentSchema
);