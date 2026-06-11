import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function AcademicYears() {
  const [academicYears, setAcademicYears] = useState([
    {
      id: 1,
      name: "2025-26",
      startDate: "2025-04-01",
      endDate: "2026-03-31",
    },
  ]);

  const [currentYear, setCurrentYear] = useState("2025-26");
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editId, setEditId] = useState(null);

  const handleAddYear = () => {
    if (!startDate || !endDate) {
      alert("Please select both dates");
      return;
    }

    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    const academicYearName = `${startYear}-${String(endYear).slice(-2)}`;

    if (editId) {
      setAcademicYears(
        academicYears.map((year) =>
          year.id === editId
            ? { ...year, name: academicYearName, startDate, endDate }
            : year
        )
      );
    } else {
      const newYear = {
        id: Date.now(),
        name: academicYearName,
        startDate,
        endDate,
      };
      setAcademicYears([...academicYears, newYear]);
    }

    setCurrentYear(academicYearName);
    setEditId(null);
    setStartDate("");
    setEndDate("");
    setShowModal(false);
  };

  const handleDelete = (id) => {
    const updated = academicYears.filter((year) => year.id !== id);
    setAcademicYears(updated);
  };

  const handleEdit = (year) => {
    setEditId(year.id);
    setStartDate(year.startDate);
    setEndDate(year.endDate);
    setShowModal(true);
  };

  return (
    <div className="bg-white p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-1">Academic Years</h2>

      {/* Top Section */}
      <div className="grid lg:grid-cols-2 gap-3 mb-4">
        {/* Info Box */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-base mb-2">
            School session & current year
          </h3>

          <p className="text-gray-600 text-sm">
            Add each academic session (e.g. April 2025 to March 2026),
            then pick the current year.
          </p>

          <p className="text-blue-600 text-sm mt-3">
            Configure this before other masters.
          </p>
        </div>

        {/* Right Side */}
        <div className="p-4">
          <label className="text-xs text-gray-500 uppercase block mb-2">
            Current Academic Year
          </label>

          <div className="flex gap-3">
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
              className="bg-gray-100 rounded-lg px-3 py-2 text-sm flex-1 outline-none"
            >
              {academicYears.map((year) => (
                <option key={year.id} value={year.name}>
                  {year.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setEditId(null);
                setStartDate("");
                setEndDate("");
                setShowModal(true);
              }}
              className="bg-blue-900 text-white px-6 py-2 rounded-lg"
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <div className="grid grid-cols-4 bg-gray-100 p-4 font-semibold rounded-lg">
          <div>#</div>
          <div>Academic Year</div>
          <div>Duration</div>
          <div className="text-right">Actions</div>
        </div>

        {academicYears.map((year, index) => (
          <div
            key={year.id}
            className="grid grid-cols-4 p-4 items-center"
          >
            <div>{index + 1}</div>

            <div>{year.name}</div>

            <div>
              {year.startDate} → {year.endDate}
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => handleEdit(year)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit />
              </button>

              <button
                onClick={() => handleDelete(year.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              {editId ? "Edit Academic Year" : "Add Academic Year"}
            </h3>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  End Date
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg px-4 py-3 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAddYear}
                className="bg-blue-900 text-white px-5 py-2 rounded-lg"
              >
                {editId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}