import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const stats = [
  { label: "Students", value: "1,248" },
  { label: "Teachers", value: "84" },
  { label: "Attendance", value: "96%" },
  { label: "Fees Collected", value: "₹12.4L" },
];

const Dashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7fb] md:flex">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-4 md:py-6 md:ml-[280px]">
        <div className="space-y-4 md:space-y-6">
          <Navbar onMenuClick={() => setMobileMenuOpen(true)} />

          <div className="bg-white rounded-3xl p-5 md:p-8">
            <div className="flex flex-col gap-4 md:gap-5">
              <div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Welcome Back, Manish 👋
                </h1>
                <p className="mt-2 text-sm md:text-base text-gray-500">
                  Manage your school operations efficiently
                </p>
              </div>

              <div className="max-w-2xl">
                <input
                  type="text"
                  placeholder="Search students, staff, fees..."
                  className="w-full border rounded-full px-4 md:px-5 py-3"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100"
              >
                <p className="text-sm text-gray-500">{stat.label}</p>
                <h2 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900">
                  {stat.value}
                </h2>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white rounded-3xl p-5 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold">
                Attendance Overview
              </h3>
              <div className="mt-4 h-56 rounded-2xl bg-[#f5f7fb] border border-dashed border-slate-200" />
            </div>

            <div className="bg-white rounded-3xl p-5 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold">
                Recent Activity
              </h3>
              <div className="mt-4 space-y-3">
                <div className="h-14 rounded-2xl bg-[#f5f7fb]" />
                <div className="h-14 rounded-2xl bg-[#f5f7fb]" />
                <div className="h-14 rounded-2xl bg-[#f5f7fb]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
