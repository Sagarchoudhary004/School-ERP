import Teacher from "../models/Teacher.js";


// CREATE TEACHER

const cleanTeacherPayload = (data) => {
  const payload = { ...data };
  if (payload.dob === "") delete payload.dob;
  if (payload.joinDate === "") delete payload.joinDate;
  if (payload.monthlySalary === "") delete payload.monthlySalary;
  return payload;
};

const validateTeacherPayload = async (payload, excludeId = null) => {
  const requiredFields = ["name", "subject", "email", "employeeCode", "phone"];
  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length) {
    const error = new Error(`Missing required fields: ${missingFields.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_REGEX.test(payload.email)) {
    const error = new Error("Invalid email format");
    error.statusCode = 400;
    throw error;
  }

  const duplicate = await Teacher.findOne({
    $or: [{ email: payload.email }, { employeeCode: payload.employeeCode }],
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  });

  if (duplicate) {
    const error = new Error("Email or Employee Code already exists");
    error.statusCode = 409;
    throw error;
  }
};

export const createTeacher = async (req, res) => {
  try {
    const payload = cleanTeacherPayload(req.body);
    await validateTeacherPayload(payload);

    const teacher = await Teacher.create(payload);

    res.status(201).json(teacher);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};



// GET ALL TEACHERS

export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({
      createdAt: -1,
    });

    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// GET SINGLE TEACHER

export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(
      req.params.id
    );

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// UPDATE TEACHER

export const updateTeacher = async (req, res) => {
  try {
    const payload = cleanTeacherPayload(req.body);
    await validateTeacherPayload(payload, req.params.id);

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    res.status(200).json(teacher);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};



// DELETE TEACHER

export const deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Teacher deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};