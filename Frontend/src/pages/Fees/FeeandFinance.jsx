import React, { useState, useEffect, useMemo } from "react";
import {
  getFeeSummary,
  getFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getFeePayments,
  recordFeePayment,
} from "../../services/feeService";
import { getStudents } from "../../services/studentService";
import { classSectionService } from "../../services/masterSetupServices";
import { getAcademicYears } from "../../services/academicYearServices";
import {
  FaEdit,
  FaTrash,
  FaWallet,
  FaCheckCircle,
  FaExclamationCircle,
  FaUserGraduate,
  FaFilePdf,
  FaFileExcel,
  FaMoneyBillWave,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const FeeandFinance = () => {
  const [activeTab, setActiveTab] = useState("collection"); // "collection" | "structure"

  // ---------------- Shared data ----------------
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [structures, setStructures] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------- Fee Collection filters ----------------
  const [searchStudent, setSearchStudent] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFeeHead, setFilterFeeHead] = useState("");
  const [paidDateFrom, setPaidDateFrom] = useState("");
  const [paidDateTo, setPaidDateTo] = useState("");

  // ---------------- Fee Structure form ----------------
  const [showStructureForm, setShowStructureForm] = useState(false);
  const [editStructureId, setEditStructureId] = useState(null);
  const [structureSearch, setStructureSearch] = useState("");
  const [structureYearFilter, setStructureYearFilter] = useState("");
  const [structureClassFilter, setStructureClassFilter] = useState("");
  const [newStructure, setNewStructure] = useState({
    academicYear: "",
    classGroup: "",
    tuition: "",
    admission: "",
    exam: "",
    annual: "",
    waiverSC: "",
    waiverST: "",
    waiverOBC: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ---------------- Payment modal ----------------
  const [payModalStudent, setPayModalStudent] = useState(null);
  const [payForm, setPayForm] = useState({
    amountPaid: "",
    paymentMethod: "Cash",
    remarks: "",
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const results = await Promise.allSettled([
        getStudents(),
        getFeePayments(),
        getFeeStructures(),
        classSectionService.getAll(),
        getAcademicYears(),
      ]);

      const [studentsRes, paymentsRes, structuresRes, classesRes, yearsRes] = results;

      if (studentsRes.status === "fulfilled") {
        const data = studentsRes.value?.data?.data || studentsRes.value?.data || studentsRes.value || [];
        setStudents(Array.isArray(data) ? data : []);
      }

      if (paymentsRes.status === "fulfilled") {
        const data = paymentsRes.value?.data?.data || paymentsRes.value?.data || paymentsRes.value || [];
        setPayments(Array.isArray(data) ? data : []);
      }

      if (structuresRes.status === "fulfilled") {
        const data = structuresRes.value?.data?.data || structuresRes.value?.data || structuresRes.value || [];
        setStructures(Array.isArray(data) ? data : []);
      }

      if (classesRes.status === "fulfilled") {
        const data = classesRes.value?.data?.data || classesRes.value?.data || [];
        setClasses(Array.isArray(data) ? data : []);
      }

      if (yearsRes.status === "fulfilled") {
        const data = yearsRes.value?.data?.data || yearsRes.value?.data || [];
        const yearsList = Array.isArray(data) ? data : [];
        // Extract year names from academic year objects
        setAcademicYears(yearsList.map((y) => (typeof y === "string" ? y : y.name)).filter(Boolean));
      }

      const anyFailed = results.some((r) => r.status === "rejected");
      if (anyFailed) {
        setError("Some data failed to load. Showing partial results.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load data. Please try again.");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Derived: unique classes ----------------
  const uniqueClasses = useMemo(
    () => [...new Set(classes.map((c) => c.className))].filter(Boolean).sort(),
    [classes]
  );

  // class group strings like "6-A" used in structure table
  const classGroupOptions = useMemo(() => {
    const groups = classes.map((c) => `${c.className}-${c.sectionName || c.section || ""}`.replace(/-$/, ""));
    return [...new Set(groups)].filter(Boolean).sort();
  }, [classes]);

  // ---------------- Build per-student fee rows generically ----------------
  const getStructureForStudent = (student) => {
    const studentClass = student.studentClass || student.className || student.class || student.currentClass;
    const studentSection = student.section || student.sectionName;
    const classGroup = `${studentClass}-${studentSection || ""}`.replace(/-$/, "");
    return (
      structures.find(
        (s) =>
          (s.classGroup && classGroup && s.classGroup.toLowerCase() === classGroup.toLowerCase()) ||
          (s.classGroup && studentClass && s.classGroup.toLowerCase() === String(studentClass).toLowerCase())
      ) || null
    );
  };

  const computeTotalFee = (structure) => {
    if (!structure) return 0;
    const base =
      Number(structure.tuition || 0) +
      Number(structure.admission || 0) +
      Number(structure.exam || 0) +
      Number(structure.annual || 0);
    return base;
  };

  const computePaidForStudent = (studentId) => {
    return payments
      .filter((p) => (p.student?._id || p.student) === studentId)
      .reduce((sum, p) => sum + Number(p.amountPaid || 0), 0);
  };

  const collectionRows = useMemo(() => {
    return students.map((s) => {
      const structure = getStructureForStudent(s);
      const totalFee = computeTotalFee(structure);
      const paid = computePaidForStudent(s._id);
      const remaining = Math.max(0, totalFee - paid);
      let status = "Pending";
      if (totalFee > 0 && paid >= totalFee) status = "Paid";
      else if (paid > 0) status = "Partial";

      return {
        student: s,
        totalFee,
        paid,
        remaining,
        status,
      };
    });
  }, [students, structures, payments]);

  // ---------------- Apply filters to collection rows ----------------
  const filteredCollectionRows = useMemo(() => {
    return collectionRows.filter((row) => {
      const { student, status } = row;
      const fullName = `${student.firstName || ""} ${student.lastName || ""}`.toLowerCase();
      const admissionNo = (student.admissionNumber || student.rollNumber || "").toLowerCase();

      if (searchStudent && !fullName.includes(searchStudent.toLowerCase()) && !admissionNo.includes(searchStudent.toLowerCase())) {
        return false;
      }
      if (filterClass && String(student.studentClass || student.className || student.class) !== filterClass) {
        return false;
      }
      if (filterStatus && status !== filterStatus) {
        return false;
      }
      return true;
    });
  }, [collectionRows, searchStudent, filterClass, filterStatus]);

  // ---------------- Summary cards ----------------
  const summaryStats = useMemo(() => {
    const totalStudents = filteredCollectionRows.length;
    const totalCollected = filteredCollectionRows.reduce((sum, r) => sum + r.paid, 0);
    const totalPending = filteredCollectionRows.reduce((sum, r) => sum + r.remaining, 0);
    const overdue = filteredCollectionRows.filter((r) => r.status === "Pending").length;
    return { totalStudents, totalCollected, totalPending, overdue };
  }, [filteredCollectionRows]);

  // ---------------- Fee Structure filtering ----------------
  const filteredStructures = useMemo(() => {
    return structures.filter((s) => {
      if (structureSearch && !(s.classGroup || "").toLowerCase().includes(structureSearch.toLowerCase())) {
        return false;
      }
      if (structureYearFilter && s.academicYear !== structureYearFilter) return false;
      if (structureClassFilter && s.classGroup !== structureClassFilter) return false;
      return true;
    });
  }, [structures, structureSearch, structureYearFilter, structureClassFilter]);

  // ---------------- Structure form handlers ----------------
  const resetStructureForm = () => {
    setNewStructure({
      academicYear: "",
      classGroup: "",
      tuition: "",
      admission: "",
      exam: "",
      annual: "",
      waiverSC: "",
      waiverST: "",
      waiverOBC: "",
    });
    setEditStructureId(null);
    setShowStructureForm(false);
  };

  const openEditStructure = (structure) => {
    setEditStructureId(structure._id);
    setNewStructure({
      academicYear: structure.academicYear || "",
      classGroup: structure.classGroup || "",
      tuition: structure.tuition ?? "",
      admission: structure.admission ?? "",
      exam: structure.exam ?? "",
      annual: structure.annual ?? "",
      waiverSC: structure.waiverSC ?? "",
      waiverST: structure.waiverST ?? "",
      waiverOBC: structure.waiverOBC ?? "",
    });
    setShowStructureForm(true);
  };

  const handleCreateOrUpdateStructure = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        academicYear: newStructure.academicYear,
        classGroup: newStructure.classGroup,
        tuition: Number(newStructure.tuition) || 0,
        admission: Number(newStructure.admission) || 0,
        exam: Number(newStructure.exam) || 0,
        annual: Number(newStructure.annual) || 0,
        waiverSC: Number(newStructure.waiverSC) || 0,
        waiverST: Number(newStructure.waiverST) || 0,
        waiverOBC: Number(newStructure.waiverOBC) || 0,
      };

      if (editStructureId) {
        await updateFeeStructure(editStructureId, payload);
        toast.success("Fee structure updated successfully");
      } else {
        await createFeeStructure(payload);
        toast.success("Fee structure created successfully");
      }

      resetStructureForm();
      fetchAll();
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
      fetchAll();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete fee structure");
    } finally {
      setDeleteConfirm(null);
    }
  };

  // ---------------- Record payment (modal) ----------------
  const openPayModal = (row) => {
    setPayModalStudent(row);
    setPayForm({ amountPaid: "", paymentMethod: "Cash", remarks: "" });
  };

  const closePayModal = () => {
    setPayModalStudent(null);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!payModalStudent) return;
    try {
      await recordFeePayment({
        student: payModalStudent.student._id,
        amountPaid: Number(payForm.amountPaid),
        paymentMethod: payForm.paymentMethod,
        remarks: payForm.remarks,
      });
      toast.success("Payment recorded successfully");
      closePayModal();
      fetchAll();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to record payment");
    }
  };

  // ---------------- Export: Fee Collection ----------------
  const exportCollectionPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Fee Collection Report", 14, 16);

      const tableData = filteredCollectionRows.map((r) => [
        r.student.firstName + " " + (r.student.lastName || ""),
        r.student.admissionNumber || r.student.rollNumber || "-",
        r.student.studentClass || r.student.className || r.student.class || "-",
        r.student.section || r.student.sectionName || "-",
        r.student.fatherName || r.student.guardianName || "-",
        `Rs.${r.totalFee.toLocaleString("en-IN")}`,
        `Rs.${r.paid.toLocaleString("en-IN")}`,
        `Rs.${r.remaining.toLocaleString("en-IN")}`,
        r.status,
      ]);

      autoTable(doc, {
        startY: 24,
        head: [["Student", "Admission No", "Class", "Section", "Guardian", "Total", "Paid", "Remaining", "Status"]],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [37, 99, 235] },
      });

      doc.save("fee-collection-report.pdf");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export PDF");
    }
  };

  const exportCollectionExcel = () => {
    try {
      const data = filteredCollectionRows.map((r) => ({
        "Student Name": r.student.firstName + " " + (r.student.lastName || ""),
        "Admission No": r.student.admissionNumber || r.student.rollNumber || "-",
        Class: r.student.studentClass || r.student.className || r.student.class || "-",
        Section: r.student.section || r.student.sectionName || "-",
        "Guardian Name": r.student.fatherName || r.student.guardianName || "-",
        "Total Fee": r.totalFee,
        Paid: r.paid,
        Remaining: r.remaining,
        Status: r.status,
      }));
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Fee Collection");
      XLSX.writeFile(workbook, "fee-collection-report.xlsx");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel");
    }
  };

  // ---------------- Export: Fee Structure ----------------
  const exportStructurePDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Fee Structure Report", 14, 16);

      const tableData = filteredStructures.map((s) => [
        s.academicYear || "-",
        s.classGroup || "-",
        `Rs.${(s.tuition || 0).toLocaleString("en-IN")}`,
        `Rs.${(s.admission || 0).toLocaleString("en-IN")}`,
        `Rs.${(s.exam || 0).toLocaleString("en-IN")}`,
        `Rs.${(s.annual || 0).toLocaleString("en-IN")}`,
        `SC ${s.waiverSC || 0}% / ST ${s.waiverST || 0}% / OBC ${s.waiverOBC || 0}%`,
      ]);

      autoTable(doc, {
        startY: 24,
        head: [["Academic Year", "Class Group", "Tuition", "Admission", "Exam", "Annual", "Waivers"]],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [37, 99, 235] },
      });

      doc.save("fee-structure-report.pdf");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export PDF");
    }
  };

  const exportStructureExcel = () => {
    try {
      const data = filteredStructures.map((s) => ({
        "Academic Year": s.academicYear || "-",
        "Class Group": s.classGroup || "-",
        Tuition: s.tuition || 0,
        Admission: s.admission || 0,
        Exam: s.exam || 0,
        Annual: s.annual || 0,
        "Waiver SC%": s.waiverSC || 0,
        "Waiver ST%": s.waiverST || 0,
        "Waiver OBC%": s.waiverOBC || 0,
      }));
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Fee Structure");
      XLSX.writeFile(workbook, "fee-structure-report.xlsx");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel");
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Fees & Finance</h1>
        <p className="text-slate-500 mt-1">Manage fee structures, collections, receipts and exports</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        <button
          className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "collection" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab("collection")}
        >
          Fee Collection
        </button>
        <button
          className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "structure" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab("structure")}
        >
          Fee Structure
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
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
          {/* ===================== FEE COLLECTION TAB ===================== */}
          {activeTab === "collection" && (
            <div className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <p className="text-sm text-slate-500 font-medium">Total Students</p>
                  <div className="flex items-end justify-between mt-2">
                    <h2 className="text-3xl font-bold text-slate-800">{summaryStats.totalStudents}</h2>
                    <FaUserGraduate className="text-slate-400" size={22} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <p className="text-sm text-slate-500 font-medium">Total Fee Collected</p>
                  <div className="flex items-end justify-between mt-2">
                    <h2 className="text-3xl font-bold text-emerald-700">
                      ₹{summaryStats.totalCollected.toLocaleString("en-IN")}
                    </h2>
                    <FaCheckCircle className="text-emerald-400" size={22} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <p className="text-sm text-slate-500 font-medium">Pending Amount</p>
                  <div className="flex items-end justify-between mt-2">
                    <h2 className="text-3xl font-bold text-red-700">
                      ₹{summaryStats.totalPending.toLocaleString("en-IN")}
                    </h2>
                    <FaExclamationCircle className="text-red-400" size={22} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <p className="text-sm text-slate-500 font-medium">Pending Students</p>
                  <div className="flex items-end justify-between mt-2">
                    <h2 className="text-3xl font-bold text-amber-600">{summaryStats.overdue}</h2>
                    <FaWallet className="text-amber-400" size={22} />
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Search Student</label>
                    <input
                      type="text"
                      value={searchStudent}
                      onChange={(e) => setSearchStudent(e.target.value)}
                      placeholder="Name or admission no."
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Academic Year</label>
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                    >
                      <option value="">All Years</option>
                      {academicYears.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Class</label>
                    <select
                      value={filterClass}
                      onChange={(e) => setFilterClass(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                    >
                      <option value="">All Classes</option>
                      {uniqueClasses.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                    >
                      <option value="">All Status</option>
                      <option value="Paid">Paid</option>
                      <option value="Partial">Partial</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
                    <input
                      type="date"
                      value={paidDateFrom}
                      onChange={(e) => setPaidDateFrom(e.target.value)}
                      className="border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                    />
                    <input
                      type="date"
                      value={paidDateTo}
                      onChange={(e) => setPaidDateTo(e.target.value)}
                      className="border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={exportCollectionPDF}
                      className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition"
                    >
                      <FaFilePdf size={14} /> PDF
                    </button>
                    <button
                      onClick={exportCollectionExcel}
                      className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-emerald-800 transition"
                    >
                      <FaFileExcel size={14} /> Excel
                    </button>
                  </div>
                </div>
              </div>

              {/* Collection Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Admission No.</th>
                        <th className="px-4 py-3">Class</th>
                        <th className="px-4 py-3">Section</th>
                        <th className="px-4 py-3">Guardian</th>
                        <th className="px-4 py-3">Total Fee</th>
                        <th className="px-4 py-3">Paid</th>
                        <th className="px-4 py-3">Remaining</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCollectionRows.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="px-4 py-6 text-sm text-slate-500 text-center">
                            No students found.
                          </td>
                        </tr>
                      ) : (
                        filteredCollectionRows.map((row) => (
                          <tr key={row.student._id} className="text-sm hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-800">
                              {row.student.firstName} {row.student.lastName}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {row.student.admissionNumber || row.student.rollNumber || "-"}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {row.student.studentClass || row.student.className || row.student.class || "-"}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {row.student.section || row.student.sectionName || "-"}
                            </td>
                            <td className="px-4 py-3 text-slate-600">{row.student.fatherName || row.student.guardianName || "-"}</td>
                            <td className="px-4 py-3 font-semibold text-slate-800">
                              ₹{row.totalFee.toLocaleString("en-IN")}
                            </td>
                            <td className="px-4 py-3 font-semibold text-emerald-600">
                              ₹{row.paid.toLocaleString("en-IN")}
                            </td>
                            <td className="px-4 py-3 font-semibold text-red-600">
                              ₹{row.remaining.toLocaleString("en-IN")}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  row.status === "Paid"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : row.status === "Partial"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => openPayModal(row)}
                                className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition"
                              >
                                <FaMoneyBillWave size={12} /> Record Pay
                              </button>
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

          {/* ===================== FEE STRUCTURE TAB ===================== */}
          {activeTab === "structure" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Fee Structure</h3>
                    <p className="text-sm text-slate-500">Configure one fee structure per academic year and class group.</p>
                  </div>
                  <button
                    onClick={() => (showStructureForm ? resetStructureForm() : setShowStructureForm(true))}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-sm"
                  >
                    {showStructureForm ? "Cancel" : "+ Add Fee Structure"}
                  </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Search</label>
                    <input
                      type="text"
                      value={structureSearch}
                      onChange={(e) => setStructureSearch(e.target.value)}
                      placeholder="Search class group..."
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Academic Year</label>
                    <select
                      value={structureYearFilter}
                      onChange={(e) => setStructureYearFilter(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                    >
                      <option value="">Select Academic Year</option>
                      {academicYears.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Class Group</label>
                    <select
                      value={structureClassFilter}
                      onChange={(e) => setStructureClassFilter(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                    >
                      <option value="">Select Class Group</option>
                      {classGroupOptions.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={exportStructurePDF}
                    className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition"
                  >
                    <FaFilePdf size={14} /> PDF
                  </button>
                  <button
                    onClick={exportStructureExcel}
                    className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-emerald-800 transition"
                  >
                    <FaFileExcel size={14} /> Excel
                  </button>
                </div>
              </div>

              {/* Add/Edit form */}
              {showStructureForm && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-slate-700 mb-4">
                    {editStructureId ? "Edit Fee Structure" : "New Fee Structure"}
                  </h3>
                  <form onSubmit={handleCreateOrUpdateStructure} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Academic Year *</label>
                        <select
                          required
                          value={newStructure.academicYear}
                          onChange={(e) => setNewStructure({ ...newStructure, academicYear: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                        >
                          <option value="">Select Year</option>
                          {academicYears.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Class Group *</label>
                        <select
                          required
                          value={newStructure.classGroup}
                          onChange={(e) => setNewStructure({ ...newStructure, classGroup: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                        >
                          <option value="">Select Class Group</option>
                          {classGroupOptions.length > 0
                            ? classGroupOptions.map((g) => (
                                <option key={g} value={g}>
                                  {g}
                                </option>
                              ))
                            : uniqueClasses.map((cls) => (
                                <option key={cls} value={cls}>
                                  {cls}
                                </option>
                              ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Tuition (₹) *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={newStructure.tuition}
                          onChange={(e) => setNewStructure({ ...newStructure, tuition: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Admission (₹) *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={newStructure.admission}
                          onChange={(e) => setNewStructure({ ...newStructure, admission: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Exam (₹) *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={newStructure.exam}
                          onChange={(e) => setNewStructure({ ...newStructure, exam: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Annual (₹) *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={newStructure.annual}
                          onChange={(e) => setNewStructure({ ...newStructure, annual: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">SC Waiver (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={newStructure.waiverSC}
                          onChange={(e) => setNewStructure({ ...newStructure, waiverSC: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">ST Waiver (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={newStructure.waiverST}
                          onChange={(e) => setNewStructure({ ...newStructure, waiverST: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">OBC Waiver (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={newStructure.waiverOBC}
                          onChange={(e) => setNewStructure({ ...newStructure, waiverOBC: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={resetStructureForm}
                        className="px-5 py-2.5 rounded-lg font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition"
                      >
                        {editStructureId ? "Update Structure" : "Add Structure"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Structure Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Academic Year</th>
                        <th className="px-4 py-3">Class Group</th>
                        <th className="px-4 py-3">Tuition</th>
                        <th className="px-4 py-3">Admission</th>
                        <th className="px-4 py-3">Exam</th>
                        <th className="px-4 py-3">Annual</th>
                        <th className="px-4 py-3">Waivers</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStructures.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-4 py-6 text-sm text-slate-500 text-center">
                            No fee structures found. Click "+ Add Fee Structure" to create one.
                          </td>
                        </tr>
                      ) : (
                        filteredStructures.map((s) => (
                          <tr key={s._id} className="text-sm hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-800">{s.academicYear}</td>
                            <td className="px-4 py-3 text-slate-600">{s.classGroup}</td>
                            <td className="px-4 py-3 text-slate-600">₹{(s.tuition || 0).toLocaleString("en-IN")}</td>
                            <td className="px-4 py-3 text-slate-600">₹{(s.admission || 0).toLocaleString("en-IN")}</td>
                            <td className="px-4 py-3 text-slate-600">₹{(s.exam || 0).toLocaleString("en-IN")}</td>
                            <td className="px-4 py-3 text-slate-600">₹{(s.annual || 0).toLocaleString("en-IN")}</td>
                            <td className="px-4 py-3 text-slate-600">
                              SC {s.waiverSC || 0}% / ST {s.waiverST || 0}% / OBC {s.waiverOBC || 0}%
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-3">
                                <button
                                  onClick={() => openEditStructure(s)}
                                  className="text-blue-500 hover:text-blue-700 transition"
                                  title="Edit"
                                >
                                  <FaEdit size={16} />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(s)}
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
            </div>
          )}
        </>
      )}

      {/* ===================== Record Payment Modal ===================== */}
      {payModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Record Payment</h3>
            <p className="text-slate-500 text-sm mb-4">
              {payModalStudent.student.firstName} {payModalStudent.student.lastName} — Remaining: ₹
              {payModalStudent.remaining.toLocaleString("en-IN")}
            </p>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={payForm.amountPaid}
                  onChange={(e) => setPayForm({ ...payForm, amountPaid: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Method</label>
                <select
                  value={payForm.paymentMethod}
                  onChange={(e) => setPayForm({ ...payForm, paymentMethod: e.target.value })}
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
                  value={payForm.remarks}
                  onChange={(e) => setPayForm({ ...payForm, remarks: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closePayModal}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-slate-700 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== Delete Confirmation Modal ===================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Delete Fee Structure</h3>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.classGroup}</strong> ({deleteConfirm.academicYear})? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-slate-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStructure}
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

export default FeeandFinance;