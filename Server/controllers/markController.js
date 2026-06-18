import mongoose from "mongoose";
import Mark from "../models/Mark.js";

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const saveMarks = async (req, res) => {
  try {
    const { classSection, examType, subject, marksData = [] } = req.body;

    if (!isObjectId(classSection) || !isObjectId(examType) || !isObjectId(subject)) {
      return res.status(400).json({
        success: false,
        message: "Class, exam type and subject are required",
      });
    }

    const validRows = marksData
      .filter((row) => isObjectId(row._id || row.student))
      .map((row) => ({
        student: row._id || row.student,
        classSection,
        examType,
        subject,
        marks: Number(row.marks),
        createdBy: req.user?.id,
        updatedBy: req.user?.id,
      }))
      .filter((row) => !Number.isNaN(row.marks));

    if (!validRows.length) {
      return res.status(400).json({
        success: false,
        message: "Please enter at least one valid mark",
      });
    }

    await Promise.all(
      validRows.map((row) =>
        Mark.findOneAndUpdate(
          {
            student: row.student,
            classSection: row.classSection,
            examType: row.examType,
            subject: row.subject,
          },
          row,
          { new: true, upsert: true, runValidators: true }
        )
      )
    );

    return res.status(200).json({
      success: true,
      message: "Marks saved successfully",
      count: validRows.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getMarks = async (req, res) => {
  try {
    const { classSection, examType, subject } = req.query;
    const query = {};

    if (isObjectId(classSection)) query.classSection = classSection;
    if (isObjectId(examType)) query.examType = examType;
    if (isObjectId(subject)) query.subject = subject;

    const marks = await Mark.find(query)
      .populate("student", "firstName lastName rollNumber")
      .populate("classSection", "className sectionName")
      .populate("examType", "examName")
      .populate("subject", "subjectName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: marks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
