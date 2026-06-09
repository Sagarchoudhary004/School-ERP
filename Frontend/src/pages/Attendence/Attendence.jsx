import React from 'react'
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const  Attendence = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
    <h1 className="text-2xl font-bold">Welcome to Attendence  Page</h1>
    </div>
  );
};

export default  Attendence;