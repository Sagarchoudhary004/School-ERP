import Student from "../models/Student.js";
import ClassSection from "../models/ClassSection.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10,15}$/;

const isValidEmail = (value) => EMAIL_REGEX.test(String(value || "").trim());
const isValidPhone = (value) => PHONE_REGEX.test(String(value || "").trim());

const buildDocumentsPayload = (files = {}) => ({
  studentPhoto: files.studentPhoto?.[0]?.path || "",
  aadhaarCard: files.aadhaarCard?.[0]?.path || "",
  birthCertificate: files.birthCertificate?.[0]?.path || "",
  transferCertificate: files.transferCertificate?.[0]?.path || "",
  reportCard: files.reportCard?.[0]?.path || "",
  otherDocuments: (files.otherDocuments || []).map((file) => file.path),
});

const validateStudentPayload = async (payload, excludeId = null) => {
  const requiredFields = [
    "firstName",
    "lastName",
    "gender",
    "dob",
    "address",
    "email",
    "phone",
    "guardianName",
    "guardianPhone",
    "studentClass",
    "section",
    "admissionDate",
    "rollNumber",
  ];

  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length) {
    const error = new Error(`Missing required fields: ${missingFields.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }

  if (!isValidEmail(payload.email)) {
    const error = new Error("Invalid student email");
    error.statusCode = 400;
    throw error;
  }

  if (payload.guardianEmail && !isValidEmail(payload.guardianEmail)) {
    const error = new Error("Invalid guardian email");
    error.statusCode = 400;
    throw error;
  }

  if (!isValidPhone(payload.phone)) {
    const error = new Error("Invalid student phone number");
    error.statusCode = 400;
    throw error;
  }

  if (!isValidPhone(payload.guardianPhone)) {
    const error = new Error("Invalid guardian phone number");
    error.statusCode = 400;
    throw error;
  }

  const duplicate = await Student.findOne({
    rollNumber: payload.rollNumber,
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  });

  if (duplicate) {
    const error = new Error("Roll number already exists");
    error.statusCode = 409;
    throw error;
  }
};

export const createStudent = async (req, res) => {
  try {
    const documents = buildDocumentsPayload(req.files);
    const payload = { ...req.body, ...documents };

    await validateStudentPayload(payload);

    const student = await Student.create(payload);

    return res.status(201).json(student);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const getStudents = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const students = await Student.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getStudentsByClassSection = async (req, res) => {
  try {
    const classSection = await ClassSection.findById(req.params.classSectionId);

    if (!classSection) {
      return res.status(404).json({ message: "Class section not found" });
    }

    const students = await Student.find({
      studentClass: classSection.className,
      section: classSection.sectionName,
    }).sort({ rollNumber: 1, firstName: 1 });

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const existingStudent = await Student.findById(req.params.id);

    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    const documents = buildDocumentsPayload(req.files);
    const payload = {
      ...req.body,
      ...documents,
    };

    await validateStudentPayload(
      {
        ...existingStudent.toObject(),
        ...payload,
      },
      req.params.id
    );

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedStudent);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
