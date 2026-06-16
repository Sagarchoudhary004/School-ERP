import { useEffect, useState } from "react";
import { getStudents } from "../../services/studentService";
import RecentAdmissionsTable from "../Admission/RecentAdmissionsTable";

const Student = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-2xl font-bold">Student Directory</h1>
      
      {loading ? (
        <div className="flex justify-center py-10 text-slate-500">Loading student records...</div>
      ) : (
        <RecentAdmissionsTable students={students} />
      )}
    </div>
  );
};

export default Student;