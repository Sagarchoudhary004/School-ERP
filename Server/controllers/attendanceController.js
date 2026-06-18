import Attendance from "../models/Attendance.js";

// Save or Update Attendance for multiple users
export const saveAttendance = async (req, res) => {
  try {
    const { date, userType, attendanceData } = req.body;

    if (!date || !userType || !Array.isArray(attendanceData)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    const operations = attendanceData.map((item) => {
      const query = {
        date: normalizedDate,
        userType,
      };

      if (userType === "Student") {
        query.student = item.studentId || item.student;
      } else {
        query.teacher = item.teacherId || item.teacher;
      }

      const update = {
        ...query,
        status: item.status,
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
    res.status(500).json({ message: error.message });
  }
};

// Get Attendance for a specific date and user type
export const getAttendance = async (req, res) => {
  try {
    const { date, userType } = req.query;

    if (!date || !userType) {
      return res.status(400).json({ message: "Date and userType are required" });
    }

    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

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
    res.status(500).json({ message: error.message });
  }
};
