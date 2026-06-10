const PersonalInfo = ({ next }) => {
  return (
    <div className="space-y-5">
      <h2 className="text-lg sm:text-xl font-semibold">Personal Information</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-5">
        <input placeholder="First Name" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        <input placeholder="Last Name" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        <input type="date" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        <select className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500">
          <option>Select Gender</option>
        </select>
        <input placeholder="Phone" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        <input placeholder="Email" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
      </div>

      <textarea
        placeholder="Address"
        className="mt-5 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
      />

      <div className="flex justify-end">
        <button onClick={next} className="rounded-lg bg-blue-600 px-6 py-3 text-white">
          Next →
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
