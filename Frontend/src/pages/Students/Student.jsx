import React from 'react'
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const Student = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7fb] md:flex">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-4 md:py-6 ">
        <div className="space-y-4 md:space-y-6">
          <Navbar onMenuClick={() => setMobileMenuOpen(true)} />

          
         
        
        </div>
      </main>
    </div>
  );
};
export default Student