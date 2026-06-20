import mongoose from "mongoose";
import AcademicYear from "../models/AcademicYear.js";
import ClassSection from "../models/ClassSection.js";
import FeeStructure from "../models/FeeStructure.js";
import FeePayment from "../models/FeePayment.js";
import SchoolProfile from "../models/schoolProfileModel.js";
import Student from "../models/Student.js";

const normalizeClass = (value) => String(value || "").trim();
const validId = (value) => mongoose.Types.ObjectId.isValid(value);

export const parseComponents = (items) => {
  if (!Array.isArray(items) || !items.length) throw Object.assign(new Error("At least one fee component is required"), { statusCode: 400 });
  const seen = new Set();
  return items.map((item) => {
    const name = String(item?.name || "").trim();
    const amount = Number(item?.amount);
    if (!name) throw Object.assign(new Error("Every fee component needs a name"), { statusCode: 400 });
    if (!Number.isFinite(amount) || amount < 0) throw Object.assign(new Error(`Enter a valid amount for ${name}`), { statusCode: 400 });
    const key = name.toLowerCase();
    if (seen.has(key)) throw Object.assign(new Error(`Duplicate fee component: ${name}`), { statusCode: 400 });
    seen.add(key);
    return { name, amount };
  });
};

const validateMasters = async (academicYear, className) => {
  if (!validId(academicYear)) throw Object.assign(new Error("Select a valid academic year"), { statusCode: 400 });
  const [year, classExists] = await Promise.all([
    AcademicYear.findOne({ _id: academicYear, isActive: true }),
    ClassSection.exists({ className, isActive: true }),
  ]);
  if (!year) throw Object.assign(new Error("Academic year is not active or does not exist"), { statusCode: 400 });
  if (!classExists) throw Object.assign(new Error("Class is not active or does not exist"), { statusCode: 400 });
};

export const statusFor = (totalFee, paid) => paid <= 0 ? "Pending" : paid >= totalFee ? "Paid" : "Partially Paid";

export const calculateFeeOverview = (students, structures, payments) => structures.map((structure) => {
  const classStudents = students.filter(
    (student) => student.studentClass.toLowerCase() === structure.className.toLowerCase()
  );
  const studentIds = new Set(classStudents.map((student) => String(student._id)));
  const structurePayments = payments.filter(
    (payment) => String(payment.feeStructure) === String(structure._id) && studentIds.has(String(payment.student))
  );
  const paidByStudent = new Map();
  const paymentCountByStudent = new Map();
  const lastPaymentByStudent = new Map();
  structurePayments.forEach((payment) => {
    const id = String(payment.student);
    paidByStudent.set(id, (paidByStudent.get(id) || 0) + Number(payment.amountPaid || 0));
    paymentCountByStudent.set(id, (paymentCountByStudent.get(id) || 0) + 1);
    if (payment.paymentDate) {
      const current = lastPaymentByStudent.get(id);
      if (!current || new Date(payment.paymentDate) > new Date(current)) lastPaymentByStudent.set(id, payment.paymentDate);
    }
  });
  const totalAmount = classStudents.length * structure.totalFee;
  const paidAmount = structurePayments.reduce((sum, payment) => sum + Number(payment.amountPaid || 0), 0);
  let fullyPaidStudents = 0;
  paidByStudent.forEach((amount) => { if (amount >= structure.totalFee) fullyPaidStudents += 1; });
  const studentDetails = classStudents.map((student) => {
    const id = String(student._id);
    const paidAmount = paidByStudent.get(id) || 0;
    return {
      studentId: student._id,
      rollNumber: student.rollNumber,
      studentName: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
      className: student.studentClass,
      section: student.section,
      totalFee: structure.totalFee,
      paidAmount,
      pendingAmount: Math.max(0, structure.totalFee - paidAmount),
      status: statusFor(structure.totalFee, paidAmount),
      installmentCount: paymentCountByStudent.get(id) || 0,
      lastPaymentDate: lastPaymentByStudent.get(id) || null,
    };
  }).sort((a, b) => String(a.rollNumber || "").localeCompare(String(b.rollNumber || ""), undefined, { numeric: true }));
  return {
    feeStructureId: structure._id,
    academicYear: structure.academicYear,
    className: structure.className,
    components: structure.components,
    feePerStudent: structure.totalFee,
    totalStudents: classStudents.length,
    studentsPaid: paidByStudent.size,
    fullyPaidStudents,
    studentsPending: Math.max(0, classStudents.length - fullyPaidStudents),
    totalAmount,
    paidAmount,
    pendingAmount: Math.max(0, totalAmount - paidAmount),
    studentDetails,
  };
});

export const getFeeStructures = async (req, res) => {
  try {
    const filter = {};
    if (req.query.academicYear) filter.academicYear = req.query.academicYear;
    if (req.query.className) filter.className = req.query.className;
    const data = await FeeStructure.find(filter).populate("academicYear", "name startDate endDate").sort({ createdAt: -1 });
    return res.json({ success: true, data });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const createFeeStructure = async (req, res) => {
  try {
    const academicYear = req.body.academicYear;
    const className = normalizeClass(req.body.className);
    const components = parseComponents(req.body.components);
    if (!className) return res.status(400).json({ success: false, message: "Class is required" });
    await validateMasters(academicYear, className);
    const totalFee = components.reduce((sum, item) => sum + item.amount, 0);
    if (totalFee <= 0) return res.status(400).json({ success: false, message: "Total fee must be greater than zero" });
    const data = await FeeStructure.create({ academicYear, className, components, totalFee });
    await data.populate("academicYear", "name startDate endDate");
    return res.status(201).json({ success: true, message: "Fee structure created successfully", data });
  } catch (error) {
    const duplicate = error.code === 11000;
    return res.status(duplicate ? 409 : error.statusCode || 500).json({ success: false, message: duplicate ? "A fee structure already exists for this academic year and class" : error.message });
  }
};

export const updateFeeStructure = async (req, res) => {
  try {
    const existing = await FeeStructure.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Fee structure not found" });
    const academicYear = req.body.academicYear;
    const className = normalizeClass(req.body.className);
    const components = parseComponents(req.body.components);
    await validateMasters(academicYear, className);
    const totalFee = components.reduce((sum, item) => sum + item.amount, 0);
    if (totalFee <= 0) return res.status(400).json({ success: false, message: "Total fee must be greater than zero" });
    const hasPayments = await FeePayment.exists({ feeStructure: existing._id });
    if (hasPayments && (String(existing.academicYear) !== String(academicYear) || existing.className !== className || existing.totalFee !== totalFee)) {
      return res.status(409).json({ success: false, message: "A fee structure with payments cannot change its year, class, or total" });
    }
    const data = await FeeStructure.findByIdAndUpdate(req.params.id, { academicYear, className, components, totalFee }, { new: true, runValidators: true }).populate("academicYear", "name startDate endDate");
    return res.json({ success: true, message: "Fee structure updated successfully", data });
  } catch (error) {
    const duplicate = error.code === 11000;
    return res.status(duplicate ? 409 : error.statusCode || 500).json({ success: false, message: duplicate ? "A fee structure already exists for this academic year and class" : error.message });
  }
};

export const deleteFeeStructure = async (req, res) => {
  try {
    if (await FeePayment.exists({ feeStructure: req.params.id })) return res.status(409).json({ success: false, message: "This fee structure has payment records and cannot be deleted" });
    const data = await FeeStructure.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Fee structure not found" });
    return res.json({ success: true, message: "Fee structure deleted successfully" });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const getFeePayments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.academicYear) filter.academicYear = req.query.academicYear;
    const data = await FeePayment.find(filter)
      .populate("student", "firstName lastName rollNumber studentClass section")
      .populate("academicYear", "name")
      .populate("feeStructure", "className totalFee components")
      .sort({ paymentDate: -1, createdAt: -1 });
    return res.json({ success: true, data });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const createReceiptNumber = () => `FEE-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${new mongoose.Types.ObjectId().toString().slice(-8).toUpperCase()}`;

export const recordFeePayment = async (req, res) => {
  try {
    const { student: studentId, academicYear, paymentMethod, remarks = "", transactionId = "" } = req.body;
    const amountPaid = Number(req.body.amountPaid);
    const paymentDate = req.body.paymentDate ? new Date(req.body.paymentDate) : new Date();
    if (!validId(studentId) || !validId(academicYear)) return res.status(400).json({ success: false, message: "Select a valid student and academic year" });
    if (!Number.isFinite(amountPaid) || amountPaid <= 0) return res.status(400).json({ success: false, message: "Payment amount must be greater than zero" });
    if (!paymentMethod) return res.status(400).json({ success: false, message: "Payment method is required" });
    if (Number.isNaN(paymentDate.getTime()) || paymentDate > new Date()) return res.status(400).json({ success: false, message: "Payment date must be valid and cannot be in the future" });
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    const feeStructure = await FeeStructure.findOne({ academicYear, className: student.studentClass });
    if (!feeStructure) return res.status(404).json({ success: false, message: "No fee structure exists for this student's class and academic year" });
    const paidResult = await FeePayment.aggregate([
      { $match: { student: new mongoose.Types.ObjectId(studentId), feeStructure: feeStructure._id } },
      { $group: { _id: null, amount: { $sum: "$amountPaid" } } },
    ]);
    const alreadyPaid = paidResult[0]?.amount || 0;
    const pending = Math.max(0, feeStructure.totalFee - alreadyPaid);
    if (pending <= 0) return res.status(409).json({ success: false, message: "This student's fee is already fully paid" });
    if (amountPaid > pending) return res.status(400).json({ success: false, message: `Payment cannot exceed the pending amount of ₹${pending.toLocaleString("en-IN")}` });
    const data = await FeePayment.create({
      student: studentId, feeStructure: feeStructure._id, academicYear,
      className: student.studentClass, amountPaid, totalFeeSnapshot: feeStructure.totalFee,
      remainingAfterPayment: pending - amountPaid, paymentDate, paymentMethod,
      remarks, transactionId, receiptNumber: createReceiptNumber(),
    });
    await data.populate([{ path: "student", select: "firstName lastName rollNumber studentClass section" }, { path: "academicYear", select: "name" }]);
    return res.status(201).json({ success: true, message: "Payment recorded successfully", data: { payment: data, status: statusFor(feeStructure.totalFee, alreadyPaid + amountPaid) } });
  } catch (error) { return res.status(error.statusCode || 500).json({ success: false, message: error.message }); }
};

export const getStudentFeeStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { academicYear } = req.query;
    if (!validId(studentId) || !validId(academicYear)) return res.status(400).json({ success: false, message: "Student and academic year are required" });
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    const structure = await FeeStructure.findOne({ academicYear, className: student.studentClass }).populate("academicYear", "name");
    if (!structure) return res.status(404).json({ success: false, message: "No fee structure exists for this student's class and academic year" });
    const payments = await FeePayment.find({ student: studentId, feeStructure: structure._id }).sort({ paymentDate: -1 });
    const paidAmount = payments.reduce((sum, p) => sum + p.amountPaid, 0);
    return res.json({ success: true, data: { student, structure, totalFee: structure.totalFee, paidAmount, pendingAmount: Math.max(0, structure.totalFee - paidAmount), status: statusFor(structure.totalFee, paidAmount), payments } });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const getFeeSummary = async (req, res) => {
  try {
    const academicYear = req.query.academicYear;
    if (academicYear && !validId(academicYear)) return res.status(400).json({ success: false, message: "Select a valid academic year" });
    const structureFilter = academicYear ? { academicYear } : {};
    const paymentFilter = academicYear ? { academicYear } : {};
    const [students, structures, payments] = await Promise.all([
      Student.find().select("firstName lastName rollNumber studentClass section"),
      FeeStructure.find(structureFilter).populate("academicYear", "name startDate endDate").sort({ className: 1 }),
      FeePayment.find(paymentFilter).select("student feeStructure amountPaid paymentDate"),
    ]);
    const classDetails = calculateFeeOverview(students, structures, payments);
    const totalExpected = classDetails.reduce((sum, item) => sum + item.totalAmount, 0);
    const totalCollected = classDetails.reduce((sum, item) => sum + item.paidAmount, 0);
    return res.json({
      success: true,
      data: {
        totalExpected,
        totalCollected,
        totalPending: Math.max(0, totalExpected - totalCollected),
        studentsPaid: classDetails.reduce((sum, item) => sum + item.studentsPaid, 0),
        studentsPending: classDetails.reduce((sum, item) => sum + item.studentsPending, 0),
        classDetails,
      },
    });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const getReceipt = async (req, res) => {
  try {
    const payment = await FeePayment.findById(req.params.paymentId).populate("student", "firstName lastName rollNumber studentClass section").populate("academicYear", "name");
    if (!payment) return res.status(404).json({ success: false, message: "Receipt not found" });
    const profile = await SchoolProfile.findOne().select("schoolName address phone");
    return res.json({ success: true, data: { schoolName: profile?.schoolName || "School CRM", schoolAddress: profile?.address || "", schoolPhone: profile?.phone || "", receiptNumber: payment.receiptNumber, student: payment.student, academicYear: payment.academicYear, amountPaid: payment.amountPaid, remainingAmount: payment.remainingAfterPayment, paymentDate: payment.paymentDate, paymentMethod: payment.paymentMethod, remarks: payment.remarks } });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};
