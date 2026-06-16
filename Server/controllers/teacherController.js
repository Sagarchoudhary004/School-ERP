import Teacher from "../models/Teacher.js";


// CREATE TEACHER

export const createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);

    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({
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
    const teacher =
      await Teacher.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({
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