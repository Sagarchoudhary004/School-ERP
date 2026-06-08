import { Link } from "react-router-dom";
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaCalendarAlt,
  FaMoneyBill,
  FaBook,
  FaBus,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";

import logo from "../assets/logo.png";

const Sidebar = ({ mobileOpen = false, onClose = () => {} }) => {
  const menu = [
    { icon: <FaHome />, name: "Dashboard", path: "/dashboard" },
    { icon: <FaUserGraduate />, name: "Students", path: "/students" },
    { icon: <FaChalkboardTeacher />, name: "Teachers", path: "/teachers" },
    { icon: <FaClipboardCheck />, name: "Attendance", path: "/attendance" },
    { icon: <FaCalendarAlt />, name: "Timetable", path: "/timetable" },
    { icon: <FaMoneyBill />, name: "Fees & Finance", path: "/fees" },
    { icon: <FaFileAlt />, name: "Exams", path: "/exams" },
    { icon: <FaBook />, name: "Library", path: "/library" },
    { icon: <FaBus />, name: "Transport", path: "/transport" },
    { icon: <FaCog />, name: "Settings", path: "/settings", 
      subRoutes:[{ icon: <FaCog />, name: "auditlogs", path: "/settings/auditlogs", 

      },
      { icon: <FaCog />, name: "integration", path: "/settings/integration", 

      },
      { icon: <FaCog />, name: "masters", path: "/settings/masters", 

      },
      { icon: <FaCog />, name: "schoolprofile", path: "/settings/schoolprofile", 

      },]
    },
  ];

  return (
    <>
      <div className="hidden md:flex md:w-[280px] md:fixed md:left-0 md:top-0 md:h-screen md:min-h-screen bg-[#06123f] text-white p-5 flex-col overflow-y-auto">
        <SidebarContent menu={menu} />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            aria-label="Close sidebar overlay"
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <div className="relative z-50 h-full w-[280px] max-w-[85vw] bg-[#06123f] text-white p-4 flex flex-col overflow-y-auto shadow-2xl">
            <SidebarContent menu={menu} />
          </div>
        </div>
      ) : null}
    </>
  );
};

const SidebarContent = ({ menu }) => {
  return (
    <>
      <div className="flex items-center gap-3 mb-8 md:mb-10">
        <img
          src={logo}
          alt="DEE Campus"
          className="w-12 h-12 md:w-14 md:h-14 object-contain"
        />

        <div>
          <h1 className="text-xl md:text-2xl font-bold text-blue-400">DEE</h1>
          <h2 className="text-xl md:text-2xl font-bold text-cyan-400 -mt-1">
            Campus
          </h2>
        </div>
      </div>

      <div className="space-y-1 flex-1">
        {menu.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
              index === 0 ? "bg-[#4f46e5]" : "hover:bg-[#0f215f]"
            }`}
          >
            <span className="text-lg md:text-base">{item.icon}</span>
            <span className="text-sm md:text-base">{item.name}</span>
          </Link>
        ))}
      </div>

      <div className="bg-[#0d1d57] rounded-3xl p-4 mt-4 mb-2 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 rounded-full bg-[#1b2d78] flex items-center justify-center mb-4">
          📅
        </div>

        <p className="text-gray-300 text-xs md:text-sm tracking-wider">
          ACADEMIC YEAR
        </p>

        <h2 className="text-2xl md:text-3xl font-bold mt-2">2026-27</h2>

        <div className="flex items-center gap-2 mt-4">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-sm text-gray-300">Active Session</span>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
