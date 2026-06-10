import React from 'react'
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AuditLogs from './AuditLogs';
import Integrations from './Integrations';
import Masters from './Masters-pages/Masters';
import SchoolProfile from './SchoolProfile';



const  Setting = () => {
  return (

          <div className="space-y-4 md:space-y-6">

            {/* Your page content goes here */}
            <h1 className="text-2xl font-bold">Welcome to Setting Page</h1>

          </div>
  );
};

export default  Setting;



