import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { label: "Academic Years", path: "Academic-Years" },
  { label: "Exam Types", path: "Exam-Types" },
  { label: "Class & Sections", path: "Class-Sections" },
  { label: "Subjects", path: "Subjects" },
  { label: "Departments", path: "Departments" },
  { label: "Designations", path: "Designations" },
  { label: "Categories", path: "Categories" },
  { label: "Academic Calendar", path: "Academic-Calendar" },
];

export default function Masters() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Master Setup</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500">
          Configure system masters and lookups
        </p>
      </div>

      <div className="rounded-2xl bg-gray-100 p-2 overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-xl px-4 py-2 text-sm sm:text-base transition-all ${
                  isActive ? "bg-white text-blue-900 shadow font-semibold" : "text-gray-600 hover:bg-gray-200"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
