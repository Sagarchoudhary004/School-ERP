import FeeStructure from "../models/FeeStructure.js";
import FeePayment from "../models/FeePayment.js";
import Student from "../models/Student.js";

export const getFeeStructures = async (req, res) => {
  try {
    const structures = await FeeStructure.find().populate("student", "firstName lastName rollNumber studentClass");
    res.status(200).json(structures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFeeStructure = async (req, res) => {
  try {
    const structure = await FeeStructure.create(req.body);
    res.status(201).json(structure);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFeeStructure = async (req, res) => {
  try {
    await FeeStructure.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Fee structure deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeePayments = async (req, res) => {
  try {
    const payments = await FeePayment.find()
      .populate("student", "firstName lastName rollNumber studentClass section")
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const recordFeePayment = async (req, res) => {
  try {
    const payment = await FeePayment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getStudentFeeStatus = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const classStructures = await FeeStructure.find({ type: "Class", targetClass: student.studentClass });
    const studentStructures = await FeeStructure.find({ type: "Student", student: studentId });

    const totalAssigned = [...classStructures, ...studentStructures].reduce((sum, s) => sum + s.amount, 0);

    const payments = await FeePayment.find({ student: studentId });
    const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);

    res.status(200).json({
      student,
      totalAssigned,
      totalPaid,
      pendingFee: totalAssigned - totalPaid,
      structures: [...classStructures, ...studentStructures],
      payments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeeSummary = async (req, res) => {
  try {
    const students = await Student.find();
    const classStructures = await FeeStructure.find({ type: "Class" });
    const studentStructures = await FeeStructure.find({ type: "Student" });
    const payments = await FeePayment.find();

    let totalExpected = 0;
    
    // Group structures by class
    const classFeeMap = {};
    classStructures.forEach(s => {
      classFeeMap[s.targetClass] = (classFeeMap[s.targetClass] || 0) + s.amount;
    });

    students.forEach(student => {
      if (classFeeMap[student.studentClass]) {
        totalExpected += classFeeMap[student.studentClass];
      }
    });

    studentStructures.forEach(s => {
      totalExpected += s.amount;
    });

    const totalCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);

    res.status(200).json({
      totalExpected,
      totalCollected,
      totalPending: totalExpected - totalCollected,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
