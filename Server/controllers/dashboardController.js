import SchoolProfile from "../models/schoolProfileModel.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Attendance from "../models/Attendance.js";
import FeePayment from "../models/FeePayment.js";
import FeeStructure from "../models/FeeStructure.js";
import AcademicYear from "../models/AcademicYear.js";

export const getDashboardStats = async (req, res) => {
  try {
    const profile = await SchoolProfile.findOne();
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const studentAttendanceRecords = await Attendance.find({ date: today, userType: "Student" });
    const teacherAttendanceRecords = await Attendance.find({ date: today, userType: "Teacher" });
    const currentYear = await AcademicYear.findOne({ isCurrent: true, isActive: true });
    const feeFilter = currentYear ? { academicYear: currentYear._id } : {};
    const [feeStructures, feePayments, students] = await Promise.all([
      FeeStructure.find(feeFilter),
      FeePayment.find(feeFilter),
      Student.find().select("studentClass"),
    ]);
    const feeByClass = new Map(feeStructures.map((fee) => [fee.className.toLowerCase(), fee.totalFee]));
    const expectedByStudent = new Map();
    students.forEach((student) => {
      const fee = feeByClass.get(student.studentClass.toLowerCase());
      if (fee !== undefined) expectedByStudent.set(String(student._id), fee);
    });
    const paidByStudent = new Map();
    feePayments.forEach((payment) => paidByStudent.set(String(payment.student), (paidByStudent.get(String(payment.student)) || 0) + payment.amountPaid));
    const totalFeeCollected = feePayments.reduce((sum, payment) => sum + payment.amountPaid, 0);
    const totalFeeExpected = [...expectedByStudent.values()].reduce((sum, amount) => sum + amount, 0);
    let studentsPaid = 0;
    expectedByStudent.forEach((_, id) => { if ((paidByStudent.get(id) || 0) > 0) studentsPaid += 1; });

    const summarizeAttendance = (records, totalCount) => {
      let present = 0;
      let absent = 0;
      let leave = 0;

      records.forEach((r) => {
        if (r.status === "Present") present++;
        if (r.status === "Absent") absent++;
        if (r.status === "Leave") leave++;
      });

      const marked = present + absent + leave;

      return {
        present,
        absent,
        leave,
        total: totalCount,
        marked,
        percentage: marked > 0 ? Math.round((present / marked) * 100) : 0,
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
        feeStats: {
          totalCollected: totalFeeCollected,
          totalPending: Math.max(0, totalFeeExpected - totalFeeCollected),
          studentsPaid,
          studentsPending: Math.max(0, expectedByStudent.size - studentsPaid),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
