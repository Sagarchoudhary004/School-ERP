import React, { useState, useEffect } from "react";
import { getFeeSummary, getFeeStructures, createFeeStructure, getFeePayments, recordFeePayment } from "../../services/feeService";
import { getStudents } from "../../services/studentService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FeeandFinance = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [summary, setSummary] = useState(null);
  const [structures, setStructures] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Forms state
  const [newStructure, setNewStructure] = useState({ name: "", amount: "", type: "Class", targetClass: "" });
  const [newPayment, setNewPayment] = useState({ student: "", amountPaid: "", paymentMethod: "Cash", remarks: "" });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "summary") {
        const data = await getFeeSummary();
        setSummary(data);
      } else if (activeTab === "structures") {
        const data = await getFeeStructures();
        setStructures(data);
      } else if (activeTab === "payments") {
        const data = await getFeePayments();
        setPayments(data);
        const studentData = await getStudents();
        setStudents(studentData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStructure = async (e) => {
    e.preventDefault();
    try {
      await createFeeStructure({
        ...newStructure,
        amount: Number(newStructure.amount),
      });
      toast.success("Fee structure created");
      setNewStructure({ name: "", amount: "", type: "Class", targetClass: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to create structure");
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      await recordFeePayment({
        ...newPayment,
        amountPaid: Number(newPayment.amountPaid),
      });
      toast.success("Payment recorded");
      setNewPayment({ student: "", amountPaid: "", paymentMethod: "Cash", remarks: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to record payment");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Fees & Finance</h1>
      
      <div className="flex gap-4 mb-6 border-b">
        <button 
          className={`pb-2 px-4 ${activeTab === 'summary' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button 
          className={`pb-2 px-4 ${activeTab === 'structures' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('structures')}
        >
          Fee Structures
        </button>
        <button 
          className={`pb-2 px-4 ${activeTab === 'payments' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('payments')}
        >
          Payments
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow">
          {activeTab === "summary" && summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-500">Total Expected</p>
                <h2 className="text-2xl font-bold text-blue-700">₹{summary.totalExpected.toLocaleString()}</h2>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-gray-500">Total Collected</p>
                <h2 className="text-2xl font-bold text-green-700">₹{summary.totalCollected.toLocaleString()}</h2>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <p className="text-gray-500">Total Pending</p>
                <h2 className="text-2xl font-bold text-red-700">₹{summary.totalPending.toLocaleString()}</h2>
              </div>
            </div>
          )}

          {activeTab === "structures" && (
            <div>
              <form onSubmit={handleCreateStructure} className="mb-8 bg-gray-50 p-4 rounded grid grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-sm mb-1">Fee Name</label>
                  <input type="text" required value={newStructure.name} onChange={e => setNewStructure({...newStructure, name: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Amount (₹)</label>
                  <input type="number" required value={newStructure.amount} onChange={e => setNewStructure({...newStructure, amount: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Type</label>
                  <select value={newStructure.type} onChange={e => setNewStructure({...newStructure, type: e.target.value})} className="w-full border p-2 rounded">
                    <option value="Class">Class</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Target Class</label>
                  <input type="text" required value={newStructure.targetClass} onChange={e => setNewStructure({...newStructure, targetClass: e.target.value})} className="w-full border p-2 rounded" placeholder="e.g. 10" />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded h-[42px]">Add Structure</button>
              </form>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border-b">Fee Name</th>
                    <th className="p-3 border-b">Type</th>
                    <th className="p-3 border-b">Target</th>
                    <th className="p-3 border-b">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {structures.map(s => (
                    <tr key={s._id} className="border-b">
                      <td className="p-3">{s.name}</td>
                      <td className="p-3">{s.type}</td>
                      <td className="p-3">{s.targetClass || "-"}</td>
                      <td className="p-3">₹{s.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "payments" && (
            <div>
              <form onSubmit={handleRecordPayment} className="mb-8 bg-gray-50 p-4 rounded grid grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-sm mb-1">Student</label>
                  <select required value={newPayment.student} onChange={e => setNewPayment({...newPayment, student: e.target.value})} className="w-full border p-2 rounded">
                    <option value="">Select Student</option>
                    {students.map(s => (
                      <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.rollNumber})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Amount Paid (₹)</label>
                  <input type="number" required value={newPayment.amountPaid} onChange={e => setNewPayment({...newPayment, amountPaid: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Method</label>
                  <select value={newPayment.paymentMethod} onChange={e => setNewPayment({...newPayment, paymentMethod: e.target.value})} className="w-full border p-2 rounded">
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Remarks</label>
                  <input type="text" value={newPayment.remarks} onChange={e => setNewPayment({...newPayment, remarks: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded h-[42px]">Record Payment</button>
              </form>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border-b">Date</th>
                    <th className="p-3 border-b">Student</th>
                    <th className="p-3 border-b">Amount</th>
                    <th className="p-3 border-b">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p._id} className="border-b">
                      <td className="p-3">{new Date(p.paymentDate).toLocaleDateString()}</td>
                      <td className="p-3">{p.student?.firstName} {p.student?.lastName}</td>
                      <td className="p-3 text-green-600 font-bold">₹{p.amountPaid}</td>
                      <td className="p-3">{p.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeeandFinance;