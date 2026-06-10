import { useState } from "react";

import PersonalInfo from "./PersonalInfo";
import GuardianInfo from "./GuardianInfo";
import AcademicInfo from "./AcademicInfo";
import Documents from "./Documents";

const NewAdmission = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-4 sm:space-y-6">
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
        {step === 1 && <PersonalInfo next={() => setStep(2)} />}
        {step === 2 && <GuardianInfo next={() => setStep(3)} prev={() => setStep(1)} />}
        {step === 3 && <AcademicInfo next={() => setStep(4)} prev={() => setStep(2)} />}
        {step === 4 && <Documents prev={() => setStep(3)} />}
      </div>
    </div>
  );
};

export default NewAdmission;

const StepItem = ({ number, title, active }) => (
  <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${active ? "border-blue-200 bg-blue-50" : "border-slate-100 bg-white"}`}>
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white ${
        active ? "bg-blue-500" : "bg-gray-300"
      }`}
    >
      {number}
    </div>
    <span className="text-sm sm:text-base font-medium text-slate-700">{title}</span>
  </div>
);
