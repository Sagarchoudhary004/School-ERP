import { useCallback, useEffect, useState } from "react";
import { getTeachers } from "../../services/teacherService";
import { saveAttendance, getAttendance } from "../../services/attendanceService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherAttendance = () => {
  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchTeachersAndAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const teacherData = await getTeachers();
      setTeachers(Array.isArray(teacherData) ? teacherData : []);

      const response = await getAttendance(date, "Teacher");
      const records = response.data || [];
      
      const attendanceMap = {};
      records.forEach(record => {
        if (record.teacher && record.teacher._id) {
          attendanceMap[record.teacher._id] = record.status;
        }
      });
      setAttendance(attendanceMap);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTeachersAndAttendance();
  }, [fetchTeachersAndAttendance]);

  const handleStatusChange = (teacherId, status) => {
    setAttendance(prev => ({ ...prev, [teacherId]: status }));
  };

  const handleSave = async () => {
    if (!date) {
      toast.warning("Please select an attendance date.");
      return;
    }

    if (teachers.length === 0) {
      toast.warning("No teachers found to mark attendance.");
      return;
    }

    setSaving(true);
    try {
      const attendanceData = teachers.map((teacher) => ({
        teacherId: teacher._id,
        status: attendance[teacher._id] || "Present",
      }));

      await saveAttendance({
        date,
        userType: "Teacher",
        attendanceData,
      });

      toast.success("Attendance saved successfully.");
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error(error?.response?.data?.message || "Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Teacher Attendance</h1>
        <div className="flex gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border-b">Employee Code</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Subject</th>
                <th className="p-3 border-b text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{teacher.employeeCode || "-"}</td>
                  <td className="p-3 font-medium">{teacher.name}</td>
                  <td className="p-3">{teacher.subject || "-"}</td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleStatusChange(teacher._id, "Present")}
                        title="Present"
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          (attendance[teacher._id] || "Present") === "Present"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        P
                      </button>
                      <button
                        onClick={() => handleStatusChange(teacher._id, "Absent")}
                        title="Absent"
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          attendance[teacher._id] === "Absent"
                            ? "bg-red-100 text-red-700 border border-red-300"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        A
                      </button>
                      <button
                        onClick={() => handleStatusChange(teacher._id, "Leave")}
                        title="Leave"
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          attendance[teacher._id] === "Leave"
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        L
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;
