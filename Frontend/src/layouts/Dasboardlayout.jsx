import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 md:pl-[280px]">

      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="min-w-0">

        <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />

        <div className="p-4 sm:p-5 lg:p-6">
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;
