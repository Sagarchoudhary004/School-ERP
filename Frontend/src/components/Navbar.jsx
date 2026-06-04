import { FaBell } from "react-icons/fa";

const Navbar = () => {
 return (

  <div className="bg-white p-5 rounded-3xl flex justify-between items-center">

   <input
    type="text"
    placeholder="Search students, staff, fees..."
    className="w-[500px] border rounded-full px-5 py-3"
   />

   <div className="flex gap-5 items-center">

    <FaBell size={22}/>

    <button className="bg-[#4f46e5] text-white px-6 py-3 rounded-full">
      + Quick Create
    </button>

    <img
     src="https://i.pravatar.cc/50"
     className="rounded-full"
    />

   </div>

  </div>
 )
}

export default Navbar