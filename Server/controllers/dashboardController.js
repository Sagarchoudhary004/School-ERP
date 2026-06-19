import SchoolProfile from "../models/schoolProfileModel.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Attendance from "../models/Attendance.js";

export const getDashboardStats = async (req, res) => {
  try {
    const profile = await SchoolProfile.findOne();
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const studentAttendanceRecords = await Attendance.find({ date: today, userType: "Student" });
    const teacherAttendanceRecords = await Attendance.find({ date: today, userType: "Teacher" });

    const summarizeAttendance = (records, totalCount) => {
      let present = 0;
      let absent = 0;
      let leave = 0;

      records.forEach((r) => {
        if (r.status === "Present") present++;
        if (r.status === "Absent") absent++;
        if (r.status === "Leave") leave++;
      });

      return {
        present,
        absent,
        leave,
        total: totalCount,
      };
    };

    res.status(200).json({
      success: true,
      data: {
        schoolName: profile?.schoolName || "School CRM",
        totalStudents,
        totalTeachers,
        studentAttendance: summarizeAttendance(studentAttendanceRecords, totalStudents),
        staffAttendance: summarizeAttendance(teacherAttendanceRecords, totalTeachers),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
