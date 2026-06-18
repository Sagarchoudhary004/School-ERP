import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

const unwrapList = (response) => {
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.data?.data)) return response.data.data;
  return [];
};

const MarksEntry = () => {
  const [classes, setClasses] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [filters, setFilters] = useState({
    classSection: "",
    examType: "",
    subject: "",
  });
  const [isLoadingMasters, setIsLoadingMasters] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMasters();
  }, []);

  const fetchMasters = async () => {
    try {
      setIsLoadingMasters(true);
      setError("");
      const headers = getAuthHeaders();

      const [classRes, examRes, subjectRes] = await Promise.all([
        axios.get(`${API_BASE}/class-sections`, { headers }),
        axios.get(`${API_BASE}/exam-types`, { headers }),
        axios.get(`${API_BASE}/subjects`, { headers }),
      ]);

      setClasses(unwrapList(classRes));
      setExamTypes(unwrapList(examRes));
      setSubjects(unwrapList(subjectRes));
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to load exam page data");
    } finally {
      setIsLoadingMasters(false);
    }
  };

  const loadStudents = async () => {
    if (!filters.classSection || !filters.examType || !filters.subject) {
      setError("Please select class, exam type and subject first");
      return;
    }

    try {
      setIsLoadingStudents(true);
      setError("");
      const headers = getAuthHeaders();

      const studentRes = await axios.get(
        `${API_BASE}/students/class/${filters.classSection}`,
        { headers }
      );

      const markRes = await axios.get(
        `${API_BASE}/marks?classSection=${filters.classSection}&examType=${filters.examType}&subject=${filters.subject}`,
        { headers }
      );

      const marksData = unwrapList(markRes);
      const marksMap = {};
      marksData.forEach((m) => {
        if (m.student) {
          marksMap[m.student._id || m.student] = m.marks;
        }
      });

      const updatedStudents = unwrapList(studentRes).map((student) => ({
        ...student,
        marks: marksMap[student._id] !== undefined ? marksMap[student._id] : "",
      }));

      setStudents(updatedStudents);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to load students");
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleMarksChange = (index, value) => {
    const updated = [...students];
    updated[index].marks = value;
    setStudents(updated);
  };

  const saveMarks = async () => {
    if (!filters.classSection || !filters.examType || !filters.subject) {
      setError("Please select class, exam type and subject first");
      return;
    }

    try {
      setError("");
      const headers = getAuthHeaders();

      await axios.post(
        `${API_BASE}/marks`,
        {
          classSection: filters.classSection,
          examType: filters.examType,
          subject: filters.subject,
          marksData: students,
        },
        { headers }
      );

      alert("Marks Saved Successfully");
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message || "Failed To Save Marks";
      setError(message);
      alert(message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Marks Entry</h1>
          <p className="text-gray-500">
            Enter and update student exam marks
          </p>
        </div>

        <button
          onClick={saveMarks}
          disabled={!students.length}
          className="bg-blue-900 text-white px-5 py-2 rounded"
        >
          Save Marks
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow">
        <div className="grid grid-cols-4 gap-4">

          {/* Class */}
          <select
            value={filters.classSection}
            onChange={(e) =>
              setFilters({
                ...filters,
                classSection: e.target.value,
              })
            }
            className="border p-3 rounded"
          >
            <option value="">Select Class</option>

            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.className} - {cls.sectionName}
              </option>
            ))}
          </select>

          {/* Exam Type */}
          <select
            value={filters.examType}
            onChange={(e) =>
              setFilters({
                ...filters,
                examType: e.target.value,
              })
            }
            className="border p-3 rounded"
          >
            <option value="">Select Exam</option>

            {examTypes.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.examName}
              </option>
            ))}
          </select>

          {/* Subject */}
          <select
            value={filters.subject}
            onChange={(e) =>
              setFilters({
                ...filters,
                subject: e.target.value,
              })
            }
            className="border p-3 rounded"
          >
            <option value="">Select Subject</option>

            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.subjectName}
              </option>
            ))}
          </select>

          <button
            onClick={loadStudents}
            disabled={isLoadingMasters || isLoadingStudents}
            className="border border-blue-900 text-blue-900 rounded"
          >
            {isLoadingStudents ? "Loading..." : "Load Students"}
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white mt-6 p-6 rounded-xl shadow">
        {students.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Roll No</th>
                <th className="text-left p-3">Student Name</th>
                <th className="text-left p-3">Marks</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr key={student._id}>
                  <td className="p-3">{student.rollNumber}</td>

                  <td className="p-3">
                    {student.firstName} {student.lastName}
                  </td>

                  <td className="p-3">
                    <input
                      type="number"
                      value={student.marks}
                      onChange={(e) =>
                        handleMarksChange(
                          index,
                          e.target.value
                        )
                      }
                      className="border rounded p-2 w-24"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Select class, exam type and subject and click Load Students.
          </div>
        )}
      </div>
    </div>
  );
};

export default MarksEntry;
