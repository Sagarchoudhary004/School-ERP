import React, { useState, useEffect } from "react";
import { getFeeSummary, getFeeStructures, createFeeStructure, updateFeeStructure, deleteFeeStructure, getFeePayments, recordFeePayment } from "../../services/feeService";
import { getStudents } from "../../services/studentService";
import { classSectionService } from "../../services/masterSetupServices";
import { FaEdit, FaTrash, FaWallet, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FeeandFinance = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [summary, setSummary] = useState(null);
  const [structures, setStructures] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Structure form state
  const [showStructureForm, setShowStructureForm] = useState(false);
  const [editStructureId, setEditStructureId] = useState(null);
  const [newStructure, setNewStructure] = useState({ name: "", amount: "", type: "Class", targetClass: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Payment form state
  const [newPayment, setNewPayment] = useState({ student: "", amountPaid: "", paymentMethod: "Cash", remarks: "" });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await classSectionService.getAll();
        const data = response.data?.data || [];
        setClasses(data);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      }
    };
    fetchClasses();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "summary") {
        const data = await getFeeSummary();
        setSummary(data);
      } else if (activeTab === "structures") {
        const data = await getFeeStructures();
        setStructures(Array.isArray(data) ? data : []);
      } else if (activeTab === "payments") {
        const [paymentData, studentData] = await Promise.all([
          getFeePayments(),
          getStudents(),
        ]);
        setPayments(Array.isArray(paymentData) ? paymentData : []);
        setStudents(Array.isArray(studentData) ? studentData : []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load data. Please try again.");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const resetStructureForm = () => {
    setNewStructure({ name: "", amount: "", type: "Class", targetClass: "" });
    setEditStructureId(null);
    setShowStructureForm(false);
  };

  const openEditStructure = (structure) => {
    setEditStructureId(structure._id);
    setNewStructure({
      name: structure.name || "",
      amount: structure.amount || "",
      type: structure.type || "Class",
      targetClass: structure.targetClass || "",
    });
    setShowStructureForm(true);
  };

  const handleCreateOrUpdateStructure = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newStructure,
        amount: Number(newStructure.amount),
      };

      if (editStructureId) {
        await updateFeeStructure(editStructureId, payload);
        toast.success("Fee structure updated successfully");
      } else {
        await createFeeStructure(payload);
        toast.success("Fee structure created successfully");
      }

      resetStructureForm();
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save fee structure");
    }
  };

  const handleDeleteStructure = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteFeeStructure(deleteConfirm._id);
      toast.success("Fee structure deleted successfully");
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete fee structure");
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      await recordFeePayment({
        ...newPayment,
        amountPaid: Number(newPayment.amountPaid),
      });
      toast.success("Payment recorded successfully");
      setNewPayment({ student: "", amountPaid: "", paymentMethod: "Cash", remarks: "" });
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to record payment");
    }
  };

  // Get unique class names from fetched class-section data
  const uniqueClasses = [...new Set(classes.map(c => c.className))].sort();

  const tabs = [
    { key: "summary", label: "Summary" },
    { key: "structures", label: "Fee Structures" },
    { key: "payments", label: "Payments" },
  ];

  return (
    <div className="space-y-6">
      <ToastContainer />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Fees & Finance</h1>
        <p className="text-slate-500 mt-1">Manage fee structures, track payments, and monitor financials</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16 text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        </div>
      ) : (
        <>
          {/* Summary Tab */}
          {activeTab === "summary" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Expected</p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mt-2">
                      ₹{(summary?.totalExpected || 0).toLocaleString("en-IN")}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Fee × Students</p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <FaWallet size={18} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Collected</p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-2">
                      ₹{(summary?.totalCollected || 0).toLocaleString("en-IN")}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Amount received</p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <FaCheckCircle size={18} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Pending</p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-red-700 mt-2">
                      ₹{(summary?.totalPending || 0).toLocaleString("en-IN")}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Expected − Collected</p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                    <FaExclamationCircle size={18} />
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              {summary && summary.totalExpected > 0 && (
                <div className="col-span-full bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700">Collection Progress</span>
                    <span className="text-sm font-bold text-blue-700">
                      {Math.round((summary.totalCollected / summary.totalExpected) * 100)}%
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (summary.totalCollected / summary.totalExpected) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Structures Tab */}
          {activeTab === "structures" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => showStructureForm ? resetStructureForm() : setShowStructureForm(true)}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-sm"
                >
                  {showStructureForm ? "Cancel" : "+ Add Fee Structure"}
                </button>
              </div>

              {showStructureForm && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-slate-700 mb-4">
                    {editStructureId ? "Edit Fee Structure" : "New Fee Structure"}
                  </h3>
                  <form onSubmit={handleCreateOrUpdateStructure} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Fee Name *</label>
                      <input
                        type="text"
                        required
                        value={newStructure.name}
                        onChange={e => setNewStructure({ ...newStructure, name: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                        placeholder="e.g. Tuition Fee"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Amount (₹) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newStructure.amount}
                        onChange={e => setNewStructure({ ...newStructure, amount: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                        placeholder="e.g. 10000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Target Class *</label>
                      <select
                        required
                        value={newStructure.targetClass}
                        onChange={e => setNewStructure({ ...newStructure, targetClass: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                      >
                        <option value="">Select Class</option>
                        {uniqueClasses.map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition h-[42px]"
                    >
                      {editStructureId ? "Update" : "Add Structure"}
                    </button>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Fee Name</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Target</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {structures.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-6 text-sm text-slate-500 text-center">
                            No fee structures found. Click "Add Fee Structure" to create one.
                          </td>
                        </tr>
                      ) : (
                        structures.map(s => (
                          <tr key={s._id} className="text-sm hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                            <td className="px-4 py-3 text-slate-600">{s.type}</td>
                            <td className="px-4 py-3 text-slate-600">{s.targetClass || "-"}</td>
                            <td className="px-4 py-3 font-semibold text-slate-800">₹{(s.amount || 0).toLocaleString("en-IN")}</td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-3">
                                <button onClick={() => openEditStructure(s)} className="text-blue-500 hover:text-blue-700 transition" title="Edit">
                                  <FaEdit size={16} />
                                </button>
                                <button onClick={() => setDeleteConfirm(s)} className="text-red-500 hover:text-red-700 transition" title="Delete">
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
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Record New Payment</h3>
                <form onSubmit={handleRecordPayment} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Student *</label>
                    <select
                      required
                      value={newPayment.student}
                      onChange={e => setNewPayment({ ...newPayment, student: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                    >
                      <option value="">Select Student</option>
                      {students.map(s => (
                        <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.rollNumber})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newPayment.amountPaid}
                      onChange={e => setNewPayment({ ...newPayment, amountPaid: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Method</label>
                    <select
                      value={newPayment.paymentMethod}
                      onChange={e => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Remarks</label>
                    <input
                      type="text"
                      value={newPayment.remarks}
                      onChange={e => setNewPayment({ ...newPayment, remarks: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                    />
                  </div>
                  <button type="submit" className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition h-[42px]">
                    Record Payment
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Method</th>
                        <th className="px-4 py-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-6 text-sm text-slate-500 text-center">
                            No payments recorded yet.
                          </td>
                        </tr>
                      ) : (
                        payments.map(p => (
                          <tr key={p._id} className="text-sm hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-slate-600">{new Date(p.paymentDate || p.createdAt).toLocaleDateString("en-IN")}</td>
                            <td className="px-4 py-3 font-medium text-slate-800">{p.student?.firstName} {p.student?.lastName}</td>
                            <td className="px-4 py-3 font-semibold text-emerald-600">₹{(p.amountPaid || 0).toLocaleString("en-IN")}</td>
                            <td className="px-4 py-3 text-slate-600">
                              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                                {p.paymentMethod}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{p.remarks || "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Delete Fee Structure</h3>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg bg-gray-200 text-slate-700 hover:bg-gray-300 transition">Cancel</button>
              <button onClick={handleDeleteStructure} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeandFinance;