import React, { useState, useEffect } from 'react';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from '../../services/teacherService';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const emptyForm = {
  name: "",
  subject: "",
  email: "",
  employeeCode: "",
  phone: "",
  dob: "",
  gender: "",
  joinDate: "",
  qualification: "",
  experience: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  monthlySalary: "",
  panNumber: "",
  epfNumber: "",
};

const formatDate = (val) => (val ? val.split("T")[0] : "");

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchTeachers = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getTeachers();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load teachers", err);
      setError("Failed to load teachers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setEditId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (teacher) => {
    setEditId(teacher._id);
    setFormData({
      name: teacher.name || "",
      subject: teacher.subject || "",
      email: teacher.email || "",
      employeeCode: teacher.employeeCode || "",
      phone: teacher.phone || "",
      dob: formatDate(teacher.dob),
      gender: teacher.gender || "",
      joinDate: formatDate(teacher.joinDate),
      qualification: teacher.qualification || "",
      experience: teacher.experience || "",
      bankName: teacher.bankName || "",
      accountNumber: teacher.accountNumber || "",
      ifscCode: teacher.ifscCode || "",
      monthlySalary: teacher.monthlySalary || "",
      panNumber: teacher.panNumber || "",
      epfNumber: teacher.epfNumber || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.subject || !formData.employeeCode || !formData.phone || !formData.email) {
      toast.warning("Please fill all required fields.");
      return;
    }

    try {
      const payload = { ...formData, status: "Active" };

      if (editId) {
        await updateTeacher(editId, payload);
        toast.success("Teacher updated successfully.");
      } else {
        await createTeacher(payload);
        toast.success("Teacher created successfully.");
      }

      setFormData(emptyForm);
      setEditId(null);
      setShowForm(false);
      await fetchTeachers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save teacher. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteTeacher(deleteConfirm._id);
      toast.success("Teacher deleted successfully.");
      setDeleteConfirm(null);
      await fetchTeachers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete teacher.");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Teacher Directory</h1>
          <p className="text-slate-500">Manage and view all registered faculty members</p>
        </div>
        <button
          onClick={() => showForm ? (setShowForm(false), setEditId(null), setFormData(emptyForm)) : openAddForm()}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2 w-fit"
        >
          {showForm ? "Cancel" : "+ Add Teacher"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">
            {editId ? "Edit Teacher" : "Register New Teacher"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name *" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" required />
              <input name="employeeCode" value={formData.employeeCode} onChange={handleInputChange} placeholder="Employee Code *" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" required />
              <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number *" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" required />
              <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email Address *" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" required />
              <input name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject *" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" required />
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div className="flex flex-col"><label className="text-[10px] uppercase font-bold text-slate-400 ml-1 mb-1">Date of Birth</label><input name="dob" type="date" value={formData.dob} onChange={handleInputChange} className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" /></div>
              <div className="flex flex-col"><label className="text-[10px] uppercase font-bold text-slate-400 ml-1 mb-1">Join Date</label><input name="joinDate" type="date" value={formData.joinDate} onChange={handleInputChange} className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" /></div>
              <input name="qualification" value={formData.qualification} onChange={handleInputChange} placeholder="Qualification" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" />
              <input name="experience" value={formData.experience} onChange={handleInputChange} placeholder="Experience (Years)" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" />
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="font-semibold text-slate-700 mb-3">Bank & Salary Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="Bank Name" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" />
                <input name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} placeholder="Account Number" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" />
                <input name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} placeholder="IFSC Code" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" />
                <input name="monthlySalary" type="number" value={formData.monthlySalary} onChange={handleInputChange} placeholder="Monthly Salary" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" />
                <input name="panNumber" value={formData.panNumber} onChange={handleInputChange} placeholder="PAN Number" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" />
                <input name="epfNumber" value={formData.epfNumber} onChange={handleInputChange} placeholder="EPF Number" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" />
              </div>
            </div>

            {!editId && (
              <div className="border-t border-slate-100 pt-4">
                <h3 className="font-semibold text-slate-700 mb-3">Upload Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1"><label className="text-sm text-slate-500 block">Resume</label><input type="file" className="text-xs w-full" /></div>
                  <div className="space-y-1"><label className="text-sm text-slate-500 block">ID Proof</label><input type="file" className="text-xs w-full" /></div>
                  <div className="space-y-1"><label className="text-sm text-slate-500 block">Certificates</label><input type="file" className="text-xs w-full" /></div>
                </div>
              </div>
            )}

            <button type="submit" className="w-full bg-emerald-600 text-white p-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md">
              {editId ? "Update Teacher" : "Save Teacher"}
            </button>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center">Loading...</td></tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher._id || teacher.id} className="text-sm hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{teacher.name}</td>
                    <td className="px-6 py-4">{teacher.subject}</td>
                    <td className="px-6 py-4">{teacher.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {teacher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => openEditForm(teacher)}
                          className="text-blue-500 hover:text-blue-700 transition"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(teacher)}
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
              {!loading && teachers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">No teachers found. Click "Add Teacher" to start.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Delete Teacher</h3>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-slate-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teacher;
