import FeeStructure from "../models/FeeStructure.js";
import FeePayment from "../models/FeePayment.js";
import Student from "../models/Student.js";

// ---------- Fee Structures ----------

export const getFeeStructures = async (req, res) => {
  try {
    const filter = {};
    if (req.query.academicYear) filter.academicYear = req.query.academicYear;
    if (req.query.classGroup) filter.classGroup = req.query.classGroup;

    const structures = await FeeStructure.find(filter).sort({ createdAt: -1 });
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
    const { academicYear, classGroup, tuition, admission, exam, annual } = req.body;

    if (!academicYear || !classGroup) {
      return res.status(400).json({
        success: false,
        message: "Academic year and class group are required",
      });
    }

    const totalFee =
      Number(tuition || 0) +
      Number(admission || 0) +
      Number(exam || 0) +
      Number(annual || 0);

    if (totalFee <= 0) {
      return res.status(400).json({
        success: false,
        message: "At least one fee component must be greater than 0",
      });
    }

    // Check for duplicate
    const existing = await FeeStructure.findOne({ academicYear, classGroup });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Fee structure already exists for ${classGroup} in ${academicYear}`,
      });
    }

    const structure = await FeeStructure.create({
      academicYear,
      classGroup,
      tuition: Number(tuition) || 0,
      admission: Number(admission) || 0,
      exam: Number(exam) || 0,
      annual: Number(annual) || 0,
      waiverSC: Number(req.body.waiverSC) || 0,
      waiverST: Number(req.body.waiverST) || 0,
      waiverOBC: Number(req.body.waiverOBC) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Fee structure created successfully",
      data: structure,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Fee structure already exists for this academic year and class group",
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateFeeStructure = async (req, res) => {
  try {
    const { academicYear, classGroup, tuition, admission, exam, annual } = req.body;

    if (!academicYear || !classGroup) {
      return res.status(400).json({
        success: false,
        message: "Academic year and class group are required",
      });
    }

    const totalFee =
      Number(tuition || 0) +
      Number(admission || 0) +
      Number(exam || 0) +
      Number(annual || 0);

    if (totalFee <= 0) {
      return res.status(400).json({
        success: false,
        message: "At least one fee component must be greater than 0",
      });
    }

    // Check for duplicate (excluding this document)
    const duplicate = await FeeStructure.findOne({
      academicYear,
      classGroup,
      _id: { $ne: req.params.id },
    });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: `Fee structure already exists for ${classGroup} in ${academicYear}`,
      });
    }

    const structure = await FeeStructure.findByIdAndUpdate(
      req.params.id,
      {
        academicYear,
        classGroup,
        tuition: Number(tuition) || 0,
        admission: Number(admission) || 0,
        exam: Number(exam) || 0,
        annual: Number(annual) || 0,
        waiverSC: Number(req.body.waiverSC) || 0,
        waiverST: Number(req.body.waiverST) || 0,
        waiverOBC: Number(req.body.waiverOBC) || 0,
      },
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
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Fee structure already exists for this academic year and class group",
      });
    }
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

// ---------- Fee Payments ----------

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

// ---------- Student Fee Status ----------

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

    // Find fee structures that match this student's class
    const classGroup = `${student.studentClass}-${student.section}`.replace(/-$/, "");
    const structures = await FeeStructure.find({
      classGroup: { $regex: new RegExp(`^${classGroup}$`, "i") },
    });

    const totalAssigned = structures.reduce((sum, s) => {
      return sum + (s.tuition || 0) + (s.admission || 0) + (s.exam || 0) + (s.annual || 0);
    }, 0);

    const payments = await FeePayment.find({ student: studentId });
    const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);

    res.status(200).json({
      success: true,
      data: {
        student,
        totalAssigned,
        totalPaid,
        pendingFee: totalAssigned - totalPaid,
        structures,
        payments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- Fee Summary ----------

export const getFeeSummary = async (req, res) => {
  try {
    const students = await Student.find();
    const structures = await FeeStructure.find();
    const payments = await FeePayment.find();

    let totalExpected = 0;

    // Build a map of classGroup -> total fee
    const classGroupFeeMap = {};
    structures.forEach((s) => {
      const key = (s.classGroup || "").trim().toLowerCase();
      const fee = (s.tuition || 0) + (s.admission || 0) + (s.exam || 0) + (s.annual || 0);
      classGroupFeeMap[key] = (classGroupFeeMap[key] || 0) + fee;
    });

    // Calculate expected fee per student based on their class-section
    students.forEach((student) => {
      const classGroup = `${student.studentClass || ""}-${student.section || ""}`.replace(/-$/, "").trim().toLowerCase();
      // Try class-section first, then just class
      if (classGroupFeeMap[classGroup]) {
        totalExpected += classGroupFeeMap[classGroup];
      } else {
        const classOnly = (student.studentClass || "").trim().toLowerCase();
        if (classGroupFeeMap[classOnly]) {
          totalExpected += classGroupFeeMap[classOnly];
        }
      }
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
