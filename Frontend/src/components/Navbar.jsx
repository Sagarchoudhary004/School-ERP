import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaBars,
  FaUserPlus,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaClipboardCheck,
} from "react-icons/fa";

import logo from "../assets/logo.png";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const quickActions = [
    {
      title: "New Admission",
      icon: <FaUserPlus className="text-blue-600" />,
      route: "/Admission/New-Admission",
    },
    {
      title: "Collect Fee",
      icon: <FaMoneyBillWave className="text-green-600" />,
      route: "/Fees",
    },
    {
      title: "Add Enquiry",
      icon: <FaPhoneAlt className="text-orange-500" />,
      route: "/Student",
    },
    {
      title: "Mark Attendance",
      icon: <FaClipboardCheck className="text-purple-600" />,
      route: "/Attendence",
    },
  ];

  return (
    <>
      <div className="md:hidden bg-white rounded-3xl px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onMenuClick}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700"
            aria-label="Open menu"
          >
            <FaBars />
          </button>

          <img src={logo} alt="DEE Campus" className="w-10 h-10 object-contain" />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-[#4f46e5] text-white px-3 py-2 h-10 rounded-full text-sm font-medium whitespace-nowrap"
            >
              + Quick Create
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-3 w-[260px] bg-white rounded-2xl shadow-xl border z-50 overflow-hidden">
                <div className="px-4 py-3 border-b">
                  <h3 className="font-semibold text-gray-700">Quick Actions</h3>
                </div>

                {quickActions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      navigate(item.route);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 text-left"
                  >
                    {item.icon}
                    {item.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <img
            src="https://i.pravatar.cc/50"
            alt="User avatar"
            className="rounded-full w-9 h-9"
          />
        </div>
      </div>

      <div className="hidden md:flex bg-white p-4 lg:p-5 rounded-3xl flex-col xl:flex-row gap-4 xl:gap-0 justify-between xl:items-center shadow-sm">
        <input
          type="text"
          placeholder="Search students, staff, fees..."
          className="w-full xl:w-[500px] border rounded-full px-5 py-3 outline-none focus:border-[#4f46e5]"
        />

        <div className="flex flex-wrap gap-5 items-center justify-between xl:justify-end">
          <FaBell size={22} />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-[#4f46e5] text-white px-6 py-3 rounded-full"
            >
              + Quick Create
            </button>

            {showMenu && (
              <div className="absolute right-0 top-14 w-72 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden">
                <div className="px-5 py-4 border-b">
                  <h3 className="font-semibold text-gray-700">Quick Actions</h3>
                </div>

                {quickActions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      navigate(item.route);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 text-left"
                  >
                    {item.icon}
                    {item.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <img
            src="https://i.pravatar.cc/50"
            alt="User avatar"
            className="rounded-full w-10 h-10"
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
