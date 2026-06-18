import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const getAuthHeaders = () => {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
};

const Results = () => {
  const [classes, setClasses] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [filters, setFilters] = useState({
    classSection: "",
    examType: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMasters();
  }, []);

  const fetchMasters = async () => {
    try {
      const headers = getAuthHeaders();
      const [classRes, examRes] = await Promise.all([
        axios.get(`${API_BASE}/class-sections`, { headers }),
        axios.get(`${API_BASE}/exam-types`, { headers }),
      ]);
      setClasses(classRes.data.data || classRes.data || []);
      setExamTypes(examRes.data.data || examRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load filter options");
    }
  };

  const loadResults = async () => {
    if (!filters.classSection || !filters.examType) {
      setError("Please select both class and exam type");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const headers = getAuthHeaders();
      const markRes = await axios.get(
        `${API_BASE}/marks?classSection=${filters.classSection}&examType=${filters.examType}`,
        { headers }
      );
      
      const marksData = markRes.data.data || markRes.data || [];
      
      const studentMap = {};
      const subjectSet = new Set();
      
      marksData.forEach((mark) => {
        if (!mark.student) return;
        const studentId = mark.student._id;
        const subjectName = mark.subject?.subjectName || "Unknown";
        
        subjectSet.add(subjectName);
        
        if (!studentMap[studentId]) {
          studentMap[studentId] = {
            student: mark.student,
            marks: {},
            totalMarks: 0,
            subjectCount: 0,
          };
        }
        
        studentMap[studentId].marks[subjectName] = mark.marks;
        studentMap[studentId].totalMarks += mark.marks;
        studentMap[studentId].subjectCount += 1;
      });
      
      const compiledResults = Object.values(studentMap).map(data => {
        const percentage = data.subjectCount > 0 
          ? (data.totalMarks / (data.subjectCount * 100)) * 100 
          : 0;
          
        return {
          ...data,
          percentage: percentage.toFixed(2)
        };
      });
      
      setSubjects(Array.from(subjectSet));
      setResults(compiledResults);
    } catch (err) {
      console.error(err);
      setError("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Exam Results</h1>
        <p className="text-gray-500">View compiled results and percentages</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Class & Section</label>
            <select
              value={filters.classSection}
              onChange={(e) => setFilters({ ...filters, classSection: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className} - {cls.sectionName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Exam Type</label>
            <select
              value={filters.examType}
              onChange={(e) => setFilters({ ...filters, examType: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Exam</option>
              {examTypes.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {exam.examName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={loadResults}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 h-[42px]"
          >
            {loading ? "Loading..." : "View Results"}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        {results.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border-b">Roll No</th>
                <th className="p-3 border-b">Student Name</th>
                {subjects.map(sub => (
                  <th key={sub} className="p-3 border-b">{sub}</th>
                ))}
                <th className="p-3 border-b font-bold">Total</th>
                <th className="p-3 border-b font-bold">%</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res) => (
                <tr key={res.student._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{res.student.rollNumber || "-"}</td>
                  <td className="p-3 font-medium">{res.student.firstName} {res.student.lastName}</td>
                  {subjects.map(sub => (
                    <td key={sub} className="p-3 text-gray-600">
                      {res.marks[sub] !== undefined ? res.marks[sub] : "-"}
                    </td>
                  ))}
                  <td className="p-3 font-bold">{res.totalMarks}</td>
                  <td className="p-3 font-bold text-blue-600">{res.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-gray-500">
            {loading ? "Calculating results..." : "Select class and exam to view results."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
