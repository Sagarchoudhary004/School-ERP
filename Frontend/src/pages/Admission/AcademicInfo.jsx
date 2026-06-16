const AcademicInfo = ({ next, prev, formData, onChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold">Academic Information</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-5">
        <div>
          <label className="mb-2 block font-medium">Class</label>
          <select name="studentClass" value={formData.studentClass} onChange={onChange} className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500">
            <option value="">Select Class</option>
            <option value="Nursery">Nursery</option>
            <option value="LKG">LKG</option>
            <option value="UKG">UKG</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
            <option value="5th">5th</option>
            <option value="6th">6th</option>
            <option value="7th">7th</option>
            <option value="8th">8th</option>
            <option value="9th">9th</option>
            <option value="10th">10th</option>
            <option value="11th">11th</option>
            <option value="12th">12th</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">Section</label>
          <select name="section" value={formData.section} onChange={onChange} className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500">
            <option value="">Select Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">Admission Date</label>
          <input name="admissionDate" value={formData.admissionDate} onChange={onChange} type="date" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        </div>

        <div>
          <label className="mb-2 block font-medium">Roll Number</label>
          <input name="rollNumber" value={formData.rollNumber} onChange={onChange} type="text" placeholder="Enter Roll Number" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">Previous School</label>
          <input name="previousSchool" value={formData.previousSchool} onChange={onChange} type="text" placeholder="Enter Previous School Name" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={prev} className="rounded-lg border border-slate-300 px-5 py-3">
          ← Previous
        </button>
        <button type="button" onClick={next} className="rounded-lg bg-blue-600 px-5 py-3 text-white">
          Next →
        </button>
      </div>
    </div>
  );
};

export default AcademicInfo;
