import mongoose from "mongoose";

const feePaymentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    feeStructure: { type: mongoose.Schema.Types.ObjectId, ref: "FeeStructure", required: true, index: true },
    academicYear: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear", required: true, index: true },
    className: { type: String, required: true, trim: true },
    amountPaid: { type: Number, required: true, min: 0.01 },
    totalFeeSnapshot: { type: Number, required: true, min: 0 },
    remainingAfterPayment: { type: Number, required: true, min: 0 },
    paymentDate: { type: Date, required: true, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Bank Transfer"],
      required: true,
    },
    transactionId: { type: String, trim: true, default: "", maxlength: 100 },
    remarks: { type: String, trim: true, default: "", maxlength: 500 },
    receiptNumber: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("FeePayment", feePaymentSchema);
