import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboardService";
import { FaUserGraduate, FaChalkboardTeacher, FaClipboardCheck } from "react-icons/fa";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading Dashboard...</div>;
  }

  return (
    <div className="bg-white mt-5 rounded-3xl p-5 sm:p-6 lg:p-10 shadow-sm">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
        Welcome Back, 👋
      </h1>
      <p className="mt-3 text-sm sm:text-base text-gray-500 mb-8">
        Manage your school operations efficiently
      </p>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
              <FaUserGraduate />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <h2 className="text-2xl font-bold">{stats.totalStudents}</h2>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
              <FaChalkboardTeacher />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Teachers</p>
              <h2 className="text-2xl font-bold">{stats.totalTeachers}</h2>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xl">
              <FaClipboardCheck />
            </div>
            <div>
              <p className="text-sm text-gray-500">Student Attendance Today</p>
              <p className="text-sm">
                <span className="text-green-600 font-bold">{stats.studentAttendance.present}</span> P / {" "}
                <span className="text-red-600 font-bold">{stats.studentAttendance.absent}</span> A / {" "}
                <span className="text-yellow-600 font-bold">{stats.studentAttendance.leave}</span> L
              </p>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xl">
              <FaClipboardCheck />
            </div>
            <div>
              <p className="text-sm text-gray-500">Staff Attendance Today</p>
              <p className="text-sm">
                <span className="text-green-600 font-bold">{stats.staffAttendance.present}</span> P / {" "}
                <span className="text-red-600 font-bold">{stats.staffAttendance.absent}</span> A / {" "}
                <span className="text-yellow-600 font-bold">{stats.staffAttendance.leave}</span> L
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
