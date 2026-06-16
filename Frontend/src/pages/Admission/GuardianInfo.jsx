const GuardianInfo = ({ next, prev, formData, onChange }) => {
  return (
    <div className="space-y-5">
      <h2 className="text-lg sm:text-xl font-semibold">Guardian Details</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-5">
        <input name="guardianName" value={formData.guardianName} onChange={onChange} placeholder="Guardian Name" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        <input name="guardianPhone" value={formData.guardianPhone} onChange={onChange} placeholder="Phone Number" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        <input name="guardianOccupation" value={formData.guardianOccupation} onChange={onChange} placeholder="Occupation" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        <input name="guardianEmail" value={formData.guardianEmail} onChange={onChange} placeholder="Email" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
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

export default GuardianInfo;
