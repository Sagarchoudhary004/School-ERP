import React, { useState, useEffect } from 'react';
import { getTeachers, createTeacher } from '../../services/teacherService';

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", subject: "", email: "" });

  // Fetch teachers from backend on component mount
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const data = await getTeachers();
        setTeachers(data);
      } catch (error) {
        console.error("Failed to load teachers");
      } finally {
        setLoading(false);
      }
    };
    loadTeachers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.subject) return;
    
    try {
      const newTeacher = {
        ...formData,
        status: "Active"
      };
      
      // Send data to backend
      const savedTeacher = await createTeacher(newTeacher);
      
      // Update local state with the saved teacher from backend
      setTeachers([savedTeacher, ...teachers]);
      setFormData({ name: "", subject: "", email: "" });
      setShowForm(false);
    } catch (error) {
      alert("Failed to save teacher. Please try again.");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Teacher Directory</h1>
          <p className="text-slate-500">Manage and view all registered faculty members</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2 w-fit"
        >
          {showForm ? "Cancel" : "+ Add Teacher"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">Register New Teacher</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" required />
            <input name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" required />
            <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email Address" className="border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" required />
            <button type="submit" className="md:col-span-3 bg-emerald-600 text-white p-3 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-sm">Save Teacher</button>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center">Loading...</td></tr>
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
                  </tr>
                ))
              )}
              {teachers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-500">No teachers found. Click "Add Teacher" to start.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Teacher;
