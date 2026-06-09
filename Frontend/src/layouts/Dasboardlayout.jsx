import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen md:pl-[280px]">

      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="min-w-0">

        <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />

        <div className="p-5">
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;
