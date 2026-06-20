import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaPlus, FaReceipt, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import { getAcademicYears } from "../../services/academicYearServices";
import {
  createFeeStructure, deleteFeeStructure, getFeeReceipt, getFeeStructures, getFeeSummary,
  getStudentFeeStatus, recordFeePayment, updateFeeStructure,
} from "../../services/feeService";
import { classSectionService } from "../../services/masterSetupServices";
import { getStudents } from "../../services/studentService";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const emptyStructure = { academicYear: "", className: "", components: [{ name: "Tuition Fee", amount: "" }] };
const emptyPayment = { amountPaid: "", paymentDate: new Date().toISOString().slice(0, 10), paymentMethod: "Cash", remarks: "", transactionId: "" };
const unwrap = (response) => response?.data?.data || response?.data || response || [];

export default function FeeandFinance() {
  const [tab, setTab] = useState("overview");
  const [years, setYears] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [structureForm, setStructureForm] = useState(emptyStructure);
  const [editingId, setEditingId] = useState("");
  const [showStructureForm, setShowStructureForm] = useState(false);
  const [selection, setSelection] = useState({ academicYear: "", className: "", studentId: "" });
  const [feeStatus, setFeeStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [paymentForm, setPaymentForm] = useState(emptyPayment);
  const [overviewYear, setOverviewYear] = useState("");
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  const classes = useMemo(() => [...new Set(classSections.map((item) => item.className).filter(Boolean))].sort(), [classSections]);
  const selectedYear = years.find((year) => year._id === selection.academicYear);
  const eligibleStudents = useMemo(() => students
    .filter((student) => !selection.className || student.studentClass === selection.className)
    .sort((a, b) => String(a.rollNumber).localeCompare(String(b.rollNumber), undefined, { numeric: true })), [students, selection.className]);
  const structureTotal = useMemo(() => structureForm.components.reduce((sum, item) => sum + (Number(item.amount) || 0), 0), [structureForm.components]);
  const overviewStudents = useMemo(
    () => overview?.classDetails?.flatMap((item) => item.studentDetails || []) || [],
    [overview]
  );

  const loadMasters = async () => {
    setLoading(true);
    try {
      const [yearResponse, classResponse, studentData, structureData] = await Promise.all([
        getAcademicYears(), classSectionService.getAll(), getStudents(), getFeeStructures(),
      ]);
      const yearList = unwrap(yearResponse);
      setYears(Array.isArray(yearList) ? yearList : []);
      setClassSections(Array.isArray(unwrap(classResponse)) ? unwrap(classResponse) : []);
      setStudents(Array.isArray(studentData) ? studentData : []);
      setStructures(Array.isArray(structureData) ? structureData : []);
      const current = yearList.find((year) => year.isCurrent) || yearList[0];
      if (current) {
        setSelection((value) => ({ ...value, academicYear: value.academicYear || current._id }));
        setOverviewYear(current._id);
        setOverview(await getFeeSummary(current._id));
      }
    } catch (error) { toast.error(error?.response?.data?.message || "Unable to load fee data"); }
    finally { setLoading(false); }
  };

  // Initial API synchronization is intentionally performed once on mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadMasters(); }, []);

  const loadOverview = async (academicYear) => {
    setOverviewLoading(true);
    try { setOverview(await getFeeSummary(academicYear)); }
    catch (error) { setOverview(null); toast.error(error?.response?.data?.message || "Unable to load fee overview"); }
    finally { setOverviewLoading(false); }
  };

  const changeOverviewYear = (academicYear) => {
    setOverviewYear(academicYear);
    if (academicYear) loadOverview(academicYear);
    else setOverview(null);
  };

  useEffect(() => {
    // Clear stale details as soon as the selection becomes incomplete.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!selection.studentId || !selection.academicYear) { setFeeStatus(null); return; }
    let active = true;
    setStatusLoading(true);
    getStudentFeeStatus(selection.studentId, selection.academicYear)
      .then((data) => { if (active) setFeeStatus(data); })
      .catch((error) => { if (active) { setFeeStatus(null); toast.error(error?.response?.data?.message || "Unable to load student fee"); } })
      .finally(() => { if (active) setStatusLoading(false); });
    return () => { active = false; };
  }, [selection.studentId, selection.academicYear]);

  const changeSelection = (field, value) => {
    setSelection((current) => ({
      ...current, [field]: value,
      ...(field === "academicYear" ? { studentId: "" } : {}),
      ...(field === "className" ? { studentId: "" } : {}),
    }));
    setPaymentForm(emptyPayment);
  };

  const addComponent = () => setStructureForm((value) => ({ ...value, components: [...value.components, { name: "", amount: "" }] }));
  const updateComponent = (index, field, value) => setStructureForm((current) => ({ ...current, components: current.components.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }));
  const removeComponent = (index) => setStructureForm((current) => ({ ...current, components: current.components.filter((_, itemIndex) => itemIndex !== index) }));
  const closeStructureForm = () => { setShowStructureForm(false); setEditingId(""); setStructureForm(emptyStructure); };

  const editStructure = (structure) => {
    setEditingId(structure._id);
    setStructureForm({ academicYear: structure.academicYear?._id || structure.academicYear, className: structure.className, components: structure.components.map((item) => ({ name: item.name, amount: item.amount })) });
    setShowStructureForm(true);
  };

  const saveStructure = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { ...structureForm, components: structureForm.components.map((item) => ({ name: item.name.trim(), amount: Number(item.amount) })) };
      if (editingId) await updateFeeStructure(editingId, payload); else await createFeeStructure(payload);
      toast.success(`Fee structure ${editingId ? "updated" : "created"} successfully`);
      closeStructureForm();
      setStructures(await getFeeStructures());
      if (overviewYear) await loadOverview(overviewYear);
    } catch (error) { toast.error(error?.response?.data?.message || "Unable to save fee structure"); }
    finally { setSaving(false); }
  };

  const removeStructure = async (structure) => {
    if (!window.confirm(`Delete the fee structure for ${structure.className}?`)) return;
    try { await deleteFeeStructure(structure._id); setStructures(await getFeeStructures()); if (overviewYear) await loadOverview(overviewYear); toast.success("Fee structure deleted"); }
    catch (error) { toast.error(error?.response?.data?.message || "Unable to delete fee structure"); }
  };

  const pay = async (event) => {
    event.preventDefault();
    if (Number(paymentForm.amountPaid) > feeStatus.pendingAmount) return toast.error("Payment cannot exceed the pending amount");
    setSaving(true);
    try {
      const result = await recordFeePayment({ ...paymentForm, amountPaid: Number(paymentForm.amountPaid), student: selection.studentId, academicYear: selection.academicYear });
      toast.success("Payment saved and receipt generated");
      setPaymentForm(emptyPayment);
      setFeeStatus(await getStudentFeeStatus(selection.studentId, selection.academicYear));
      if (overviewYear) await loadOverview(overviewYear);
      if (result?.payment?._id) await downloadReceipt(result.payment._id);
    } catch (error) { toast.error(error?.response?.data?.message || "Unable to save payment"); }
    finally { setSaving(false); }
  };

  const downloadReceipt = async (paymentId) => {
    try {
      const receipt = await getFeeReceipt(paymentId);
      const doc = new jsPDF();
      doc.setFontSize(18); doc.text(receipt.schoolName, 105, 18, { align: "center" });
      doc.setFontSize(12); doc.text("FEE RECEIPT", 105, 28, { align: "center" });
      doc.line(18, 34, 192, 34);
      const rows = [
        ["Receipt Number", receipt.receiptNumber],
        ["Student", `${receipt.student.firstName} ${receipt.student.lastName}`],
        ["Roll Number", receipt.student.rollNumber],
        ["Class", `${receipt.student.studentClass} - ${receipt.student.section}`],
        ["Academic Year", receipt.academicYear.name],
        ["Amount Paid", money(receipt.amountPaid)],
        ["Remaining Amount", money(receipt.remainingAmount)],
        ["Payment Date", new Date(receipt.paymentDate).toLocaleDateString("en-IN")],
        ["Payment Method", receipt.paymentMethod],
      ];
      rows.forEach(([label, value], index) => { const y = 46 + index * 11; doc.setFont(undefined, "bold"); doc.text(`${label}:`, 22, y); doc.setFont(undefined, "normal"); doc.text(String(value || "-"), 75, y); });
      doc.text("This is a computer-generated receipt.", 105, 155, { align: "center" });
      doc.save(`${receipt.receiptNumber}.pdf`);
    } catch (error) { toast.error(error?.response?.data?.message || "Unable to generate receipt"); }
  };

  if (loading) return <div className="rounded-2xl bg-white p-10 text-center text-slate-500">Loading fee and finance data…</div>;

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" />
      <div><h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Fees & Finance</h1><p className="mt-1 text-slate-500">Create class fees, collect installments, and issue receipts.</p></div>
      <div className="flex w-fit gap-1 rounded-xl bg-slate-100 p-1" role="tablist">
        <Tab active={tab === "overview"} onClick={() => setTab("overview")}>Fee Overview</Tab>
        <Tab active={tab === "pay"} onClick={() => setTab("pay")}>Fee Pay</Tab>
        <Tab active={tab === "structure"} onClick={() => setTab("structure")}>Fee Structure</Tab>
      </div>

      {tab === "overview" ? (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div><h2 className="font-semibold text-slate-900">Class-wise Fee Overview</h2><p className="mt-1 text-sm text-slate-500">Live fee structure, collection, and pending totals from the backend.</p></div>
              <div className="w-full sm:w-64"><Field label="Academic Year"><select value={overviewYear} onChange={(e) => changeOverviewYear(e.target.value)}><option value="">Select year</option>{years.map((year) => <option key={year._id} value={year._id}>{year.name}</option>)}</select></Field></div>
            </div>
          </section>

          {overviewLoading ? <div className="rounded-2xl bg-white p-10 text-center text-slate-500">Loading fee overview…</div> : overview && (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <Stat label="Total Fee Amount" value={money(overview.totalExpected)} />
                <Stat label="Amount Paid" value={money(overview.totalCollected)} tone="text-emerald-700" />
                <Stat label="Pending Amount" value={money(overview.totalPending)} tone="text-amber-700" />
                <Stat label="Students Paid" value={overview.studentsPaid} tone="text-blue-700" />
                <Stat label="Students Pending" value={overview.studentsPending} tone="text-red-700" />
              </section>
              <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">Class</th><th className="p-4">Fee Structure</th><th className="p-4 text-right">Fee / Student</th><th className="p-4 text-right">Students</th><th className="p-4 text-right">Paid Students</th><th className="p-4 text-right">Fully Paid</th><th className="p-4 text-right">Total Amount</th><th className="p-4 text-right">Paid Amount</th><th className="p-4 text-right">Pending</th></tr></thead><tbody>{overview.classDetails?.length ? overview.classDetails.map((item) => <tr key={item.feeStructureId} className="border-t border-slate-100"><td className="p-4 font-semibold text-slate-900">{item.className}</td><td className="p-4 text-slate-600"><div className="max-w-xs space-y-1">{item.components.map((component) => <div key={component.name} className="flex justify-between gap-4"><span>{component.name}</span><span className="font-medium text-slate-800">{money(component.amount)}</span></div>)}</div></td><td className="p-4 text-right font-medium">{money(item.feePerStudent)}</td><td className="p-4 text-right">{item.totalStudents}</td><td className="p-4 text-right text-blue-700">{item.studentsPaid}</td><td className="p-4 text-right text-emerald-700">{item.fullyPaidStudents}</td><td className="p-4 text-right font-medium">{money(item.totalAmount)}</td><td className="p-4 text-right font-medium text-emerald-700">{money(item.paidAmount)}</td><td className="p-4 text-right font-medium text-amber-700">{money(item.pendingAmount)}</td></tr>) : <tr><td colSpan="9" className="p-10 text-center text-slate-500">No fee structures are available for this academic year.</td></tr>}</tbody></table></div>
              </section>
              <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="p-5"><h2 className="font-semibold text-slate-900">Student Fee Details</h2><p className="mt-1 text-sm text-slate-500">Paid, partially paid, and unpaid students for the selected academic year.</p></div>
                <div className="overflow-x-auto"><table className="w-full min-w-[950px] text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">Roll Number</th><th className="p-4">Student Name</th><th className="p-4">Class</th><th className="p-4">Section</th><th className="p-4 text-right">Total Fee</th><th className="p-4 text-right">Amount Paid</th><th className="p-4 text-right">Pending Amount</th><th className="p-4 text-right">Installments</th><th className="p-4">Status</th></tr></thead><tbody>{overviewStudents.length ? overviewStudents.map((student) => <tr key={student.studentId} className="border-t border-slate-100"><td className="p-4 font-medium text-slate-800">{student.rollNumber || "-"}</td><td className="p-4 font-medium text-slate-900">{student.studentName}</td><td className="p-4 text-slate-600">{student.className}</td><td className="p-4 text-slate-600">{student.section || "-"}</td><td className="p-4 text-right">{money(student.totalFee)}</td><td className="p-4 text-right font-medium text-emerald-700">{money(student.paidAmount)}</td><td className="p-4 text-right font-medium text-amber-700">{money(student.pendingAmount)}</td><td className="p-4 text-right">{student.installmentCount}</td><td className="p-4"><StatusBadge status={student.status} /></td></tr>) : <tr><td colSpan="9" className="p-10 text-center text-slate-500">No students have an assigned fee structure for this academic year.</td></tr>}</tbody></table></div>
              </section>
            </>
          )}
        </div>
      ) : tab === "pay" ? (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">Select student</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Field label="1. Academic Year"><select value={selection.academicYear} onChange={(e) => changeSelection("academicYear", e.target.value)} required><option value="">Select year</option>{years.map((year) => <option key={year._id} value={year._id}>{year.name}</option>)}</select></Field>
              <Field label="2. Class"><select value={selection.className} onChange={(e) => changeSelection("className", e.target.value)} required><option value="">Select class</option>{classes.map((name) => <option key={name}>{name}</option>)}</select></Field>
              <Field label="3. Student"><select value={selection.studentId} disabled={!selection.className} onChange={(e) => changeSelection("studentId", e.target.value)} required><option value="">Select student</option>{eligibleStudents.map((student) => <option key={student._id} value={student._id}>{student.rollNumber} — {student.firstName} {student.lastName} ({student.section})</option>)}</select></Field>
            </div>
          </section>

          {statusLoading && <div className="rounded-xl bg-white p-6 text-center text-slate-500">Loading fee details…</div>}
          {feeStatus && !statusLoading && (
            <>
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Total Fee" value={money(feeStatus.totalFee)} /><Stat label="Paid Amount" value={money(feeStatus.paidAmount)} tone="text-emerald-700" /><Stat label="Pending Amount" value={money(feeStatus.pendingAmount)} tone="text-amber-700" /><Stat label="Status" value={feeStatus.status} tone={feeStatus.status === "Paid" ? "text-emerald-700" : "text-amber-700"} />
              </section>
              <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
                <form onSubmit={pay} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <h2 className="font-semibold text-slate-900">Record payment</h2><p className="mt-1 text-sm text-slate-500">{feeStatus.student.firstName} {feeStatus.student.lastName} · {feeStatus.student.studentClass}-{feeStatus.student.section} · {selectedYear?.name}</p>
                  <div className="mt-4 space-y-4">
                    <Field label="Payment Amount"><input type="number" min="0.01" step="0.01" max={feeStatus.pendingAmount} required value={paymentForm.amountPaid} onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })} /></Field>
                    <div className="grid grid-cols-2 gap-4"><Field label="Payment Date"><input type="date" max={new Date().toISOString().slice(0, 10)} required value={paymentForm.paymentDate} onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })} /></Field><Field label="Method"><select value={paymentForm.paymentMethod} onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}><option>Cash</option><option>Card</option><option>UPI</option><option>Bank Transfer</option></select></Field></div>
                    <Field label="Transaction ID (optional)"><input maxLength="100" value={paymentForm.transactionId} onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })} /></Field>
                    <Field label="Remarks (optional)"><textarea rows="3" maxLength="500" value={paymentForm.remarks} onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })} /></Field>
                    <button disabled={saving || feeStatus.pendingAmount <= 0} className="min-h-11 w-full rounded-xl bg-emerald-600 px-4 font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">{feeStatus.pendingAmount <= 0 ? "Fee fully paid" : saving ? "Saving…" : "Save Payment & Generate Receipt"}</button>
                  </div>
                </form>
                <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"><div className="p-5"><h2 className="font-semibold text-slate-900">Payment history</h2><p className="text-sm text-slate-500">All installments for the selected year.</p></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Receipt</th><th className="p-3">Date</th><th className="p-3">Method</th><th className="p-3 text-right">Paid</th><th className="p-3 text-right">Balance</th><th className="p-3"><span className="sr-only">Action</span></th></tr></thead><tbody>{feeStatus.payments.length ? feeStatus.payments.map((payment) => <tr key={payment._id} className="border-t border-slate-100"><td className="p-3 font-medium text-slate-800">{payment.receiptNumber}</td><td className="p-3 text-slate-600">{new Date(payment.paymentDate).toLocaleDateString("en-IN")}</td><td className="p-3 text-slate-600">{payment.paymentMethod}</td><td className="p-3 text-right">{money(payment.amountPaid)}</td><td className="p-3 text-right">{money(payment.remainingAfterPayment)}</td><td className="p-3 text-right"><button type="button" aria-label={`Download receipt ${payment.receiptNumber}`} onClick={() => downloadReceipt(payment._id)} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-blue-700 hover:bg-blue-50"><FaReceipt /></button></td></tr>) : <tr><td colSpan="6" className="p-8 text-center text-slate-500">No payments recorded yet.</td></tr>}</tbody></table></div></section>
              </section>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex justify-end"><button onClick={() => { setStructureForm(emptyStructure); setEditingId(""); setShowStructureForm(true); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 font-medium text-white hover:bg-blue-700"><FaPlus /> Add Fee Structure</button></div>
          {showStructureForm && <form onSubmit={saveStructure} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-slate-900">{editingId ? "Edit" : "Create"} Fee Structure</h2><p className="text-sm text-slate-500">One structure is allowed per academic year and class.</p></div><button type="button" onClick={closeStructureForm} className="min-h-10 rounded-lg px-3 text-slate-600 hover:bg-slate-100">Cancel</button></div><div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Academic Year"><select required value={structureForm.academicYear} onChange={(e) => setStructureForm({ ...structureForm, academicYear: e.target.value })}><option value="">Select year</option>{years.map((year) => <option key={year._id} value={year._id}>{year.name}</option>)}</select></Field><Field label="Class"><select required value={structureForm.className} onChange={(e) => setStructureForm({ ...structureForm, className: e.target.value })}><option value="">Select class</option>{classes.map((name) => <option key={name}>{name}</option>)}</select></Field></div><div className="mt-5 space-y-3"><div className="flex items-center justify-between"><h3 className="text-sm font-medium text-slate-700">Fee Components</h3><button type="button" onClick={addComponent} className="min-h-10 rounded-lg px-3 text-sm font-medium text-blue-700 hover:bg-blue-50">+ Add component</button></div>{structureForm.components.map((item, index) => <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-3"><input aria-label={`Component ${index + 1} name`} placeholder="Component name" required maxLength="80" value={item.name} onChange={(e) => updateComponent(index, "name", e.target.value)} /><input aria-label={`Component ${index + 1} amount`} placeholder="Amount" type="number" min="0" step="0.01" required value={item.amount} onChange={(e) => updateComponent(index, "amount", e.target.value)} /><button aria-label={`Remove component ${index + 1}`} type="button" disabled={structureForm.components.length === 1} onClick={() => removeComponent(index)} className="min-h-11 min-w-11 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-30"><FaTrash className="mx-auto" /></button></div>)}</div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5"><div><p className="text-sm text-slate-500">Total Fee</p><p className="text-2xl font-bold text-slate-900">{money(structureTotal)}</p></div><button disabled={saving || structureTotal <= 0} className="min-h-11 rounded-xl bg-blue-600 px-6 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving…" : editingId ? "Update Structure" : "Create Structure"}</button></div></form>}
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">Academic Year</th><th className="p-4">Class</th><th className="p-4">Components</th><th className="p-4 text-right">Total Fee</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{structures.length ? structures.map((structure) => <tr key={structure._id} className="border-t border-slate-100"><td className="p-4">{structure.academicYear?.name || "-"}</td><td className="p-4 font-medium text-slate-900">{structure.className}</td><td className="p-4 text-slate-600">{structure.components.map((item) => `${item.name}: ${money(item.amount)}`).join(" · ")}</td><td className="p-4 text-right font-semibold">{money(structure.totalFee)}</td><td className="p-4"><div className="flex justify-end gap-2"><button aria-label={`Edit ${structure.className} fee structure`} onClick={() => editStructure(structure)} className="min-h-10 min-w-10 rounded-lg text-blue-700 hover:bg-blue-50"><FaEdit className="mx-auto" /></button><button aria-label={`Delete ${structure.className} fee structure`} onClick={() => removeStructure(structure)} className="min-h-10 min-w-10 rounded-lg text-red-600 hover:bg-red-50"><FaTrash className="mx-auto" /></button></div></td></tr>) : <tr><td colSpan="5" className="p-10 text-center text-slate-500">No fee structures created yet.</td></tr>}</tbody></table></div></section>
        </div>
      )}
    </div>
  );
}

function Tab({ active, children, onClick }) { return <button role="tab" aria-selected={active} onClick={onClick} className={`min-h-11 rounded-lg px-5 text-sm font-medium transition ${active ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>{children}</button>; }
function Field({ label, children }) { return <label className="block text-sm font-medium text-slate-700">{label}<span className="mt-1 block [&>input]:min-h-11 [&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-slate-200 [&>input]:px-3 [&>select]:min-h-11 [&>select]:w-full [&>select]:rounded-lg [&>select]:border [&>select]:border-slate-200 [&>select]:bg-white [&>select]:px-3 [&>textarea]:w-full [&>textarea]:rounded-lg [&>textarea]:border [&>textarea]:border-slate-200 [&>textarea]:p-3">{children}</span></label>; }
function Stat({ label, value, tone = "text-slate-900" }) { return <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p></div>; }
function StatusBadge({ status }) {
  const tone = status === "Paid" ? "bg-emerald-50 text-emerald-700" : status === "Partially Paid" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}
