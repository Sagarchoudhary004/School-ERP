import Attendance from "../models/Attendance.js";
import mongoose from "mongoose";

const VALID_USER_TYPES = ["Student", "Teacher"];
const VALID_STATUSES = ["Present", "Absent", "Leave"];

const normalizeDate = (date) => {
  const normalizedDate = new Date(date);

  if (Number.isNaN(normalizedDate.getTime())) {
    return null;
  }

  normalizedDate.setUTCHours(0, 0, 0, 0);
  return normalizedDate;
};

const getAttendanceUserId = (item, userType) =>
  userType === "Student"
    ? item.studentId || item.student
    : item.teacherId || item.teacher;

// Save or Update Attendance for multiple users
export const saveAttendance = async (req, res) => {
  try {
    const { date, userType, attendanceData } = req.body;

    if (!date || !userType || !Array.isArray(attendanceData) || attendanceData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Date, user type, and at least one attendance record are required",
      });
    }

    if (!VALID_USER_TYPES.includes(userType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance user type",
      });
    }

    const normalizedDate = normalizeDate(date);

    if (!normalizedDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance date",
      });
    }

    const invalidRecordIndex = attendanceData.findIndex((item) => {
      const userId = getAttendanceUserId(item, userType);
      return (
        !userId ||
        !mongoose.Types.ObjectId.isValid(userId) ||
        !VALID_STATUSES.includes(item.status)
      );
    });

    if (invalidRecordIndex !== -1) {
      return res.status(400).json({
        success: false,
        message: `Invalid attendance record at row ${invalidRecordIndex + 1}`,
      });
    }

    const operations = attendanceData.map((item) => {
      const userId = getAttendanceUserId(item, userType);
      const query = {
        date: normalizedDate,
        userType,
      };

      if (userType === "Student") {
        query.student = userId;
      } else {
        query.teacher = userId;
      }

      const update = {
        ...query,
        status: item.status,
        remarks: item.remarks || "",
      };

      return Attendance.findOneAndUpdate(query, update, {
        upsert: true,
        new: true,
        runValidators: true,
      });
    });

    await Promise.all(operations);

    res.status(200).json({ success: true, message: "Attendance saved successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to save attendance",
    });
  }
};

// Get Attendance for a specific date and user type
export const getAttendance = async (req, res) => {
  try {
    const { date, userType } = req.query;

    if (!date || !userType) {
      return res.status(400).json({
        success: false,
        message: "Date and userType are required",
      });
    }

    if (!VALID_USER_TYPES.includes(userType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance user type",
      });
    }

    const normalizedDate = normalizeDate(date);

    if (!normalizedDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance date",
      });
    }

    const query = {
      date: normalizedDate,
      userType,
    };

    let attendanceRecords = await Attendance.find(query)
      .populate({
        path: "student",
        select: "firstName lastName rollNumber studentClass section status",
      })
      .populate({
        path: "teacher",
        select: "name employeeCode subject status",
      });

    res.status(200).json({ success: true, data: attendanceRecords });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to load attendance",
    });
  }
};
