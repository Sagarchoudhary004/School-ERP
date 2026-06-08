import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

import PersonalInfo from "./PersonalInfo";
import GuardianInfo from "./GuardianInfo";
import AcademicInfo from "./AcademicInfo";
import Documents from "./Documents";

const NewAdmission = () => {
  const [step, setStep] = useState(1);
 const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
  <div className="min-h-screen bg-[#f5f7fb]">

    <Sidebar  mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}/>

    <main className="md:ml-[280px] p-5 overflow-auto min-h-screen">
        <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />

        <div className="mt-6">

          <h1 className="text-3xl font-bold">
            New Admission
          </h1>

          <p className="text-gray-500">
            Complete the admission form to enroll a new student
          </p>

        </div>

        {/* Step Indicator */}

        <div className="bg-white rounded-2xl p-5 mt-6">

          <div className="flex flex-wrap gap-4 justify-between">

            <StepItem
              number={1}
              title="Personal Info"
              active={step >= 1}
            />

            <StepItem
              number={2}
              title="Guardian Details"
              active={step >= 2}
            />

            <StepItem
              number={3}
              title="Academic Info"
              active={step >= 3}
            />

            <StepItem
              number={4}
              title="Documents"
              active={step >= 4}
            />

          </div>

        </div>

        {/* Form */}

        <div className="mt-6">

          {step === 1 && (
            <PersonalInfo
              next={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <GuardianInfo
              next={() => setStep(3)}
              prev={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <AcademicInfo
              next={() => setStep(4)}
              prev={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <Documents
              prev={() => setStep(3)}
            />
          )}

        </div>

      </main>
    </div>
  );
};

export default NewAdmission;

const StepItem = ({
  number,
  title,
  active,
}) => (
  <div className="flex items-center gap-2 min-w-[140px]">

    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-white
      ${
        active
          ? "bg-blue-500"
          : "bg-gray-300"
      }`}
    >
      {number}
    </div>

    <span className="text-sm md:text-base">
  {title}
</span>

  </div>
);