import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const Dashboard = () => {

 return (
  <div className="flex">

   <Sidebar />

   <div className="flex-1 p-5">

    <Navbar />

    {/* Welcome Card */}

    <div className="bg-white mt-5 rounded-3xl p-10">

      <h1 className="text-5xl font-bold">
        Welcome Back, Manish 👋
      </h1>

      <p className="mt-3 text-gray-500">
        Manage your school operations efficiently
      </p>

    </div>

   </div>

  </div>
 )
}

export default Dashboard