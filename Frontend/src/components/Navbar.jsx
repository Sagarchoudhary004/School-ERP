import { FaBell, FaBars } from "react-icons/fa";
import logo from "../assets/logo.png";

const Navbar = ({ onMenuClick }) => {
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
          <button className="bg-[#4f46e5] text-white px-3 py-2 h-10 rounded-full text-sm font-medium whitespace-nowrap">
            + Quick Create
          </button>
          <img
            src="https://i.pravatar.cc/50"
            alt="User avatar"
            className="rounded-full w-9 h-9"
          />
        </div>
      </div>

      <div className="hidden md:flex bg-white p-5 rounded-3xl flex-col xl:flex-row gap-4 xl:gap-0 justify-between xl:items-center">
        <input
          type="text"
          placeholder="Search students, staff, fees..."
          className="w-full xl:w-[500px] border rounded-full px-5 py-3"
        />

        <div className="flex flex-wrap gap-5 items-center justify-between xl:justify-end">
          <FaBell size={22} />

          <button className="bg-[#4f46e5] text-white px-6 py-3 rounded-full">
            + Quick Create
          </button>

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
