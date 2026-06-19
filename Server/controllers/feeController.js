import FeeStructure from "../models/FeeStructure.js";
import FeePayment from "../models/FeePayment.js";
import Student from "../models/Student.js";

export const getFeeStructures = async (req, res) => {
  try {
    const structures = await FeeStructure.find()
      .populate("student", "firstName lastName rollNumber studentClass")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: structures,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFeeStructure = async (req, res) => {
  try {
    const { name, amount, type, targetClass, student: studentId } = req.body;

    if (!name || amount === undefined || amount === null || !type) {
      return res.status(400).json({
        success: false,
        message: "Name, amount, and type are required",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    if (type === "Class" && !targetClass) {
      return res.status(400).json({
        success: false,
        message: "Target class is required for class-based fee structures",
      });
    }

    if (type === "Student" && !studentId) {
      return res.status(400).json({
        success: false,
        message: "Student is required for student-based fee structures",
      });
    }

    const structure = await FeeStructure.create(req.body);
    res.status(201).json({
      success: true,
      message: "Fee structure created successfully",
      data: structure,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateFeeStructure = async (req, res) => {
  try {
    const { name, amount, type, targetClass } = req.body;

    if (!name || amount === undefined || amount === null || !type) {
      return res.status(400).json({
        success: false,
        message: "Name, amount, and type are required",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    if (type === "Class" && !targetClass) {
      return res.status(400).json({
        success: false,
        message: "Target class is required for class-based fee structures",
      });
    }

    const structure = await FeeStructure.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!structure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee structure updated successfully",
      data: structure,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFeeStructure = async (req, res) => {
  try {
    const structure = await FeeStructure.findByIdAndDelete(req.params.id);

    if (!structure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee structure deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeePayments = async (req, res) => {
  try {
    const payments = await FeePayment.find()
      .populate("student", "firstName lastName rollNumber studentClass section")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const recordFeePayment = async (req, res) => {
  try {
    const { student, amountPaid, paymentMethod } = req.body;

    if (!student || !amountPaid || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Student, amount paid, and payment method are required",
      });
    }

    if (Number(amountPaid) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount paid must be greater than 0",
      });
    }

    const payment = await FeePayment.create(req.body);
    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      data: payment,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStudentFeeStatus = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const classStructures = await FeeStructure.find({ type: "Class", targetClass: student.studentClass });
    const studentStructures = await FeeStructure.find({ type: "Student", student: studentId });

    const totalAssigned = [...classStructures, ...studentStructures].reduce((sum, s) => sum + s.amount, 0);

    const payments = await FeePayment.find({ student: studentId });
    const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);

    res.status(200).json({
      success: true,
      data: {
        student,
        totalAssigned,
        totalPaid,
        pendingFee: totalAssigned - totalPaid,
        structures: [...classStructures, ...studentStructures],
        payments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeeSummary = async (req, res) => {
  try {
    const students = await Student.find();
    const classStructures = await FeeStructure.find({ type: "Class" });
    const studentStructures = await FeeStructure.find({ type: "Student" });
    const payments = await FeePayment.find();

    let totalExpected = 0;
    
    // Group fee structures by target class
    const classFeeMap = {};
    classStructures.forEach(s => {
      const key = String(s.targetClass).trim().toLowerCase();
      classFeeMap[key] = (classFeeMap[key] || 0) + s.amount;
    });

    // Calculate expected fee per student based on their class
    students.forEach(student => {
      const studentClassKey = String(student.studentClass).trim().toLowerCase();
      if (classFeeMap[studentClassKey]) {
        totalExpected += classFeeMap[studentClassKey];
      }
    });

    // Add student-specific fee structures
    studentStructures.forEach(s => {
      totalExpected += s.amount;
    });

    const totalCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);

    res.status(200).json({
      success: true,
      data: {
        totalExpected,
        totalCollected,
        totalPending: totalExpected - totalCollected,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
