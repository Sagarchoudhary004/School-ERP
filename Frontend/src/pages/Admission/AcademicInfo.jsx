const AcademicInfo = ({ next, prev }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold">Academic Information</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-5">
        <div>
          <label className="mb-2 block font-medium">Class</label>
          <select className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500">
            <option>Select Class</option>
            <option>Nursery</option>
            <option>LKG</option>
            <option>UKG</option>
            <option>1st</option>
            <option>2nd</option>
            <option>3rd</option>
            <option>4th</option>
            <option>5th</option>
            <option>6th</option>
            <option>7th</option>
            <option>8th</option>
            <option>9th</option>
            <option>10th</option>
            <option>11th</option>
            <option>12th</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">Section</label>
          <select className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500">
            <option>Select Section</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">Admission Date</label>
          <input type="date" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        </div>

        <div>
          <label className="mb-2 block font-medium">Roll Number</label>
          <input type="text" placeholder="Enter Roll Number" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">Previous School</label>
          <input type="text" placeholder="Enter Previous School Name" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button onClick={prev} className="rounded-lg border border-slate-300 px-5 py-3">
          ← Previous
        </button>
        <button onClick={next} className="rounded-lg bg-blue-600 px-5 py-3 text-white">
          Next →
        </button>
      </div>
    </div>
  );
};

export default AcademicInfo;
