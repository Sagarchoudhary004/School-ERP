import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  createTimetable,
  deleteTimetable,
  getClasses,
  getSections,
  getSubjects,
  getTeachers,
  getTimetables,
  updateTimetable,
} from "../../services/timetableService";

const dayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const emptyForm = {
  classId: "",
  sectionId: "",
  subjectId: "",
  teacherId: "",
  day: "",
  startTime: "",
  endTime: "",
};

const normalizeResponse = (response) =>
  response?.data?.data ?? response?.data ?? [];

const Timetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const [selectedViewClassId, setSelectedViewClassId] = useState("");

  const uniqueClasses = useMemo(() => {
    const map = new Map();
    classes.forEach((item) => {
      if (!map.has(item.className)) {
        map.set(item.className, item);
      }
    });
    return Array.from(map.values());
  }, [classes]);

  const uniqueSections = useMemo(() => {
    const map = new Map();
    sections.forEach((item) => {
      if (!map.has(item.sectionName)) {
        map.set(item.sectionName, item);
      }
    });
    return Array.from(map.values());
  }, [sections]);

  const activeViewClassId = useMemo(() => {
    const selectedClassStillExists = uniqueClasses.some(
      (item) => String(item._id) === String(selectedViewClassId)
    );

    return selectedClassStillExists
      ? selectedViewClassId
      : String(uniqueClasses[0]?._id || "");
  }, [selectedViewClassId, uniqueClasses]);

  const selectedViewClass = useMemo(
    () =>
      uniqueClasses.find(
        (item) => String(item._id) === String(activeViewClassId)
      ),
    [activeViewClassId, uniqueClasses]
  );

  const filteredTimetables = useMemo(() => {
    if (!selectedViewClass) return [];

    return timetables.filter((row) => {
      const rowClassId = row.classId?._id || row.classId;
      const rowClassName = row.classId?.className || row.className;

      return (
        String(rowClassId || "") === String(selectedViewClass._id) ||
        rowClassName === selectedViewClass.className
      );
    });
  }, [selectedViewClass, timetables]);

  const selectedClassName = useMemo(
    () =>
      uniqueClasses.find((item) => item._id === formData.classId)?.className ||
      "",
    [uniqueClasses, formData.classId]
  );

  const selectedSectionName = useMemo(
    () =>
      uniqueSections.find((item) => item._id === formData.sectionId)
        ?.sectionName || "",
    [uniqueSections, formData.sectionId]
  );

  const fetchAll = async () => {
  try {
    setLoading(true);

    const timetableRes = await getTimetables();
    console.log("Timetables =>", timetableRes.data);

    const classRes = await getClasses();
    console.log("Classes =>", classRes.data);

    const sectionRes = await getSections();
    console.log("Sections =>", sectionRes.data);

    const subjectRes = await getSubjects();
    console.log("Subjects =>", subjectRes.data);

    const teacherRes = await getTeachers();
    console.log("Teachers =>", teacherRes.data);

    setTimetables(normalizeResponse(timetableRes));
    setClasses(normalizeResponse(classRes));
    setSections(normalizeResponse(sectionRes));
    setSubjects(normalizeResponse(subjectRes));
    setTeachers(normalizeResponse(teacherRes));

  } catch (fetchError) {
    console.error("FETCH ERROR =>", fetchError);

    setError(
      fetchError?.response?.data?.message ||
      "Failed to load timetable data"
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchAll();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setError("");
  };

  const openAddModal = () => {
    resetForm();
    setSuccessMessage("");
    setShowModal(true);
  };

  const openEditModal = (row) => {
    setError("");
    setSuccessMessage("");
    setEditingId(row._id);
    setFormData({
      classId: row.classId?._id || "",
      sectionId: row.sectionId?._id || "",
      subjectId: row.subjectId?._id || "",
      teacherId: row.teacherId?._id || "",
      day: row.day || "",
      startTime: row.startTime || "",
      endTime: row.endTime || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    resetForm();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const validateForm = () => {
    if (
      !formData.classId ||
      !formData.sectionId ||
      !formData.subjectId ||
      !formData.teacherId ||
      !formData.day ||
      !formData.startTime ||
      !formData.endTime
    ) {
      return "All fields are required";
    }

    if (formData.endTime <= formData.startTime) {
      return "End Time must be greater than Start Time";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const payload = {
        ...formData,
        academicYear: "",
        className: selectedClassName,
        sectionName: selectedSectionName,
      };

      const response = editingId
        ? await updateTimetable(editingId, payload)
        : await createTimetable(payload);

      setSuccessMessage(response?.data?.message || "Timetable saved successfully");
      setShowModal(false);
      resetForm();
      await fetchAll();
    } catch (saveError) {
      setError(
        saveError?.response?.data?.message ||
          "Failed to save timetable"
      );
    } finally {
      setSaving(false);
    }
  };

  const promptDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setSaving(true);
      const response = await deleteTimetable(deleteId);
      setSuccessMessage(response?.data?.message || "Timetable deleted successfully");
      setShowDeleteModal(false);
      setDeleteId(null);
      await fetchAll();
    } catch (deleteError) {
      setError(
        deleteError?.response?.data?.message ||
          "Failed to delete timetable"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Timetable</h1>
          <p className="text-slate-500">
            Manage class schedules, teachers, and subject assignments
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2 w-fit"
        >
          + Add Timetable
        </button>
      </div>

      {(error || successMessage) && !showModal && !showDeleteModal && (
        <div
          className={`rounded-xl px-4 py-3 ${
            error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || successMessage}
        </div>
      )}

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <label
          htmlFor="timetable-class-filter"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          View timetable for class
        </label>
        <select
          id="timetable-class-filter"
          value={activeViewClassId}
          onChange={(event) => setSelectedViewClassId(event.target.value)}
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-xs"
          disabled={loading || !uniqueClasses.length}
        >
          {!uniqueClasses.length && <option value="">No classes available</option>}
          {uniqueClasses.map((item) => (
            <option key={item._id} value={item._id}>
              {item.className}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4">Day</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Section</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Teacher</th>
                <th className="px-6 py-4">Start Time</th>
                <th className="px-6 py-4">End Time</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredTimetables.length ? (
                filteredTimetables.map((row) => (
                  <tr key={row._id} className="text-sm hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{row.day}</td>
                    <td className="px-6 py-4">{row.classId?.className || row.className || "-"}</td>
                    <td className="px-6 py-4">{row.sectionId?.sectionName || row.sectionName || "-"}</td>
                    <td className="px-6 py-4">{row.subjectId?.subjectName || "-"}</td>
                    <td className="px-6 py-4">{row.teacherId?.name || "-"}</td>
                    <td className="px-6 py-4">{row.startTime}</td>
                    <td className="px-6 py-4">{row.endTime}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => openEditModal(row)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => promptDelete(row._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-slate-500">
                    {selectedViewClass
                      ? `No timetable entries found for ${selectedViewClass.className}.`
                      : "No classes available. Create a class before adding a timetable."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {editingId ? "Edit Timetable" : "Add Timetable"}
                </h2>
                <p className="text-sm text-slate-500">
                  Create a class schedule using existing master data.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-500 hover:text-slate-700"
                disabled={saving}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Class</label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Class</option>
                  {uniqueClasses.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.className}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Section</label>
                <select
                  name="sectionId"
                  value={formData.sectionId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Section</option>
                  {uniqueSections.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.sectionName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Day</label>
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Day</option>
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Subject</label>
                <select
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.subjectName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Teacher</label>
                <select
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>

              {error && (
                <div className="md:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl bg-slate-100 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-200"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {saving ? "Saving..." : editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-slate-800">Delete Timetable</h3>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete this timetable entry?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl bg-slate-100 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-200"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={saving}
                className="rounded-xl bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
              >
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
