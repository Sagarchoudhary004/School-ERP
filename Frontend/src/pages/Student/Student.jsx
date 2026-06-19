import { useEffect, useState } from "react";
import { getStudents, deleteStudent, updateStudent } from "../../services/studentService";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN");
};

const formatDateForInput = (val) => (val ? val.split("T")[0] : "");

const Student = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchStudents = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteStudent(deleteConfirm._id);
      toast.success("Student deleted successfully.");
      setDeleteConfirm(null);
      await fetchStudents();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete student.");
    }
  };

  const openEditModal = (student) => {
    setEditStudent(student);
    setEditForm({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      gender: student.gender || "",
      dob: formatDateForInput(student.dob),
      address: student.address || "",
      email: student.email || "",
      phone: student.phone || "",
      guardianName: student.guardianName || "",
      guardianPhone: student.guardianPhone || "",
      guardianOccupation: student.guardianOccupation || "",
      guardianEmail: student.guardianEmail || "",
      studentClass: student.studentClass || "",
      section: student.section || "",
      admissionDate: formatDateForInput(student.admissionDate),
      rollNumber: student.rollNumber || "",
      previousSchool: student.previousSchool || "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (value !== null && value !== "") payload.append(key, value);
      });
      await updateStudent(editStudent._id, payload);
      toast.success("Student updated successfully.");
      setEditStudent(null);
      await fetchStudents();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update student.");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Student Directory</h1>
          <p className="text-slate-500">Manage and view all student records</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10 text-slate-500">Loading student records...</div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Roll Number</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Guardian Name</th>
                  <th className="px-4 py-3">Admission Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {students.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-sm text-slate-500" colSpan={8}>
                      No students found.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student._id} className="text-sm hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{student.rollNumber}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{student.firstName} {student.lastName}</td>
                      <td className="px-4 py-3 text-slate-600">{student.studentClass}</td>
                      <td className="px-4 py-3 text-slate-600">{student.section}</td>
                      <td className="px-4 py-3 text-slate-600">{student.guardianName}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(student.admissionDate)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {student.status || "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => openEditModal(student)}
                            className="text-blue-500 hover:text-blue-700 transition"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(student)}
                            className="text-red-500 hover:text-red-700 transition"
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Edit Student</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">First Name *</label><input name="firstName" value={editForm.firstName} onChange={handleEditChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500" required /></div>
                <div><label className="block text-sm font-medium mb-1">Last Name *</label><input name="lastName" value={editForm.lastName} onChange={handleEditChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500" required /></div>
                <div><label className="block text-sm font-medium mb-1">Email *</label><input name="email" type="email" value={editForm.email} onChange={handleEditChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500" required /></div>
                <div><label className="block text-sm font-medium mb-1">Phone *</label><input name="phone" value={editForm.phone} onChange={handleEditChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500" required /></div>
                <div><label className="block text-sm font-medium mb-1">Gender *</label>
                  <select name="gender" value={editForm.gender} onChange={handleEditChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500" required>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">Date of Birth *</label><input name="dob" type="date" value={editForm.dob} onChange={handleEditChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500" required /></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Address *</label><input name="address" value={editForm.address} onChange={handleEditChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500" required /></div>
                <div><label className="block text-sm font-medium mb-1">Roll Number *</label><input name="rollNumber" value={editForm.rollNumber} onChange={handleEditChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500" required /></div>
                <div><label className="block text-sm font-medium mb-1">Class *</label><input name="studentClass" value={editForm.studentClass} onChange={handleEditChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500" required /></div>
                <div><label className="block text-sm font-medium mb-1">Section *</label><input name="section" value={editForm.section} onChange={handleEditChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500" required /></div>
                <div><label className="block text-sm font-medium mb-1">Admission Date *</label><input name="admissionDate" type="date" value={editForm.admissionDate} onChange={handleEditChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500" required /></div>
                <div><label className="block text-sm font-medium mb-1">Guardian Name *</label><input name="guardianName" value={editForm.guardianName} onChange={handleEditChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500" required /></div>
                <div><label className="block text-sm font-medium mb-1">Guardian Phone *</label><input name="guardianPhone" value={editForm.guardianPhone} onChange={handleEditChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500" required /></div>
                <div><label className="block text-sm font-medium mb-1">Guardian Occupation</label><input name="guardianOccupation" value={editForm.guardianOccupation} onChange={handleEditChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500" /></div>
                <div><label className="block text-sm font-medium mb-1">Guardian Email</label><input name="guardianEmail" type="email" value={editForm.guardianEmail} onChange={handleEditChange} className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditStudent(null)} className="px-4 py-2 rounded-lg bg-gray-200 text-slate-700 hover:bg-gray-300 transition">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Update Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Delete Student</h3>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.firstName} {deleteConfirm.lastName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg bg-gray-200 text-slate-700 hover:bg-gray-300 transition">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;