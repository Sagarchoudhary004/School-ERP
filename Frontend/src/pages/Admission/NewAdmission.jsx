import { useEffect, useState } from "react";
import PersonalInfo from "./PersonalInfo";
import GuardianInfo from "./GuardianInfo";
import AcademicInfo from "./AcademicInfo";
import Documents from "./Documents";
import RecentAdmissionsTable from "./RecentAdmissionsTable";
import { createStudent, getStudents } from "../../services/studentService";

const initialFormState = {
  firstName: "",
  lastName: "",
  gender: "",
  dob: "",
  address: "",
  email: "",
  phone: "",
  guardianName: "",
  guardianPhone: "",
  guardianOccupation: "",
  guardianEmail: "",
  studentClass: "",
  section: "",
  admissionDate: "",
  rollNumber: "",
  previousSchool: "",
  studentPhoto: null,
  aadhaarCard: null,
  birthCertificate: null,
  transferCertificate: null,
  reportCard: null,
  otherDocuments: [],
  declaration: false,
};

const NewAdmission = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormState);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [shouldResetAfterSuccess, setShouldResetAfterSuccess] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      setToast({ type: "", message: "" });
    }, 3000);
  };

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setFetching(true);
        const data = await getStudents();
        setStudents(data);
      } catch {
        showToast("error", "Failed to load recent admissions.");
      } finally {
        setFetching(false);
      }
    };

    loadStudents();
    return () => window.clearTimeout(showToast.timer);
  }, []);

  const resetForm = () => {
    setFormData(initialFormState);
    setStep(1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.multiple ? Array.from(files) : files[0] || null,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === "" || value === false) return;
        if (Array.isArray(value)) {
          value.forEach((file) => payload.append(key, file));
          return;
        }
        payload.append(key, value);
      });

      const savedStudent = await createStudent(payload);
      setStudents((prev) => [savedStudent, ...prev.filter((item) => item._id !== savedStudent._id)]);
      showToast("success", "Admission completed successfully.");
      setShouldResetAfterSuccess(true);
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Admission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shouldResetAfterSuccess) return;

    const timer = window.setTimeout(() => {
      resetForm();
      setShouldResetAfterSuccess(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [shouldResetAfterSuccess]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {toast.message ? (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">New Admission</h1>
        <p className="text-sm sm:text-base text-gray-500">
          Complete the admission form to enroll a new student
        </p>
      </div>

      <div className="rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <StepItem number={1} title="Personal Info" active={step >= 1} />
          <StepItem number={2} title="Guardian Details" active={step >= 2} />
          <StepItem number={3} title="Academic Info" active={step >= 3} />
          <StepItem number={4} title="Documents" active={step >= 4} />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
        {step === 1 && <PersonalInfo next={() => setStep(2)} formData={formData} onChange={handleChange} />}
        {step === 2 && <GuardianInfo next={() => setStep(3)} prev={() => setStep(1)} formData={formData} onChange={handleChange} />}
        {step === 3 && <AcademicInfo next={() => setStep(4)} prev={() => setStep(2)} formData={formData} onChange={handleChange} />}
        {step === 4 && <Documents prev={() => setStep(3)} formData={formData} onChange={handleChange} onSubmit={handleSubmit} loading={loading} />}
      </div>

      <RecentAdmissionsTable students={fetching ? [] : students} />
    </div>
  );
};

export default NewAdmission;

const StepItem = ({ number, title, active }) => (
  <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${active ? "border-blue-200 bg-blue-50" : "border-slate-100 bg-white"}`}>
    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white ${active ? "bg-blue-500" : "bg-gray-300"}`}>
      {number}
    </div>
    <span className="text-sm sm:text-base font-medium text-slate-700">{title}</span>
  </div>
);
