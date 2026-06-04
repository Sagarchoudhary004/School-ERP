// import logo from "../assets/logo.png";
// import {
//  FaHome,
//  FaUserGraduate,
//  FaChalkboardTeacher,
//  FaClipboardCheck,
//  FaCalendarAlt,
//  FaMoneyBill,
//  FaBook,
//  FaBus,
//  FaFileAlt,
//  FaCog
// } from "react-icons/fa";

// const Sidebar = () => {

//  const menu = [
//   {icon:<FaHome/>,name:"Dashboard"},
//   {icon:<FaUserGraduate/>,name:"Students"},
//   {icon:<FaChalkboardTeacher/>,name:"Teachers"},
//   {icon:<FaClipboardCheck/>,name:"Attendance"},
//   {icon:<FaCalendarAlt/>,name:"Timetable"},
//   {icon:<FaMoneyBill/>,name:"Fees & Finance"},
//   {icon:<FaFileAlt/>,name:"Exams"},
//   {icon:<FaBook/>,name:"Library"},
//   {icon:<FaBus/>,name:"Transport"},
//   {icon:<FaCog/>,name:"Settings"},
//  ];

//  return (
//   <div className="w-[280px] h-screen bg-[#06123f] text-white p-5">

//    <h1 className="text-3xl font-bold mb-10">
//     DEE
//     <span className="text-cyan-400">
//       Campus
//     </span>
//    </h1>

//    <div className="space-y-2">

//     {menu.map((item,index)=>(
//       <div
//        key={index}
//        className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer
//        ${index===0 && "bg-[#4f46e5]"}`}
//       >
//         {item.icon}
//         {item.name}
//       </div>
//     ))}

//    </div>

//   </div>
//  );
// };

// export default Sidebar;











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

const Sidebar = () => {
  const menu = [
    { icon: <FaHome />, name: "Dashboard" },
    { icon: <FaUserGraduate />, name: "Students" },
    { icon: <FaChalkboardTeacher />, name: "Teachers" },
    { icon: <FaClipboardCheck />, name: "Attendance" },
    { icon: <FaCalendarAlt />, name: "Timetable" },
    { icon: <FaMoneyBill />, name: "Fees & Finance" },
    { icon: <FaFileAlt />, name: "Exams" },
    { icon: <FaBook />, name: "Library" },
    { icon: <FaBus />, name: "Transport" },
    { icon: <FaCog />, name: "Settings" },
  ];

  return (
    // <div className="w-[280px] h-screen bg-[#06123f] text-white p-5 flex flex-col">
<div className="w-[280px] h-screen bg-[#06123f] text-white p-5 flex flex-col overflow-y-auto">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-10">
        <img
          src={logo}
          alt="DEE Campus"
          className="w-14 h-14 object-contain"
        />

        <div>
          <h1 className="text-2xl font-bold text-blue-400">
            DEE
          </h1>

          <h2 className="text-2xl font-bold text-cyan-400 -mt-1">
            Campus
          </h2>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-1 flex-1">
        {menu.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
            ${
              index === 0
                ? "bg-[#4f46e5]"
                : "hover:bg-[#0f215f]"
            }`}
          >
            {item.icon}
            {item.name}
          </div>
        ))}
      </div>

      {/* Academic Year Card */}
      <div className="bg-[#0d1d57] rounded-3xl p-4 mt-4 mb-2 flex flex-col items-center justify-center text-center">

        <div className="w-10 h-10 rounded-full bg-[#1b2d78] flex items-center justify-center mb-4">
          📅
        </div>

        <p className="text-gray-300 text-sm tracking-wider">
          ACADEMIC YEAR
        </p>

        <h2 className="text-3xl font-bold mt-2">
          2026-27
        </h2>

        <div className="flex items-center gap-2 mt-4">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>

          <span className="text-sm text-gray-300">
            Active Session
          </span>
        </div>

      </div>

    </div>
  );
};

export default Sidebar;