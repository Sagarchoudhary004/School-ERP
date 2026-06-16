const PersonalInfo = ({ next, formData, onChange }) => {
  return (
    <div className="space-y-5">
      <h2 className="text-lg sm:text-xl font-semibold">Personal Information</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-5">
        <input name="firstName" value={formData.firstName} onChange={onChange} placeholder="First Name" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        <input name="lastName" value={formData.lastName} onChange={onChange} placeholder="Last Name" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        <input name="dob" value={formData.dob} onChange={onChange} type="date" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        <select name="gender" value={formData.gender} onChange={onChange} className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input name="phone" value={formData.phone} onChange={onChange} placeholder="Phone" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
        <input name="email" value={formData.email} onChange={onChange} placeholder="Email" className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500" />
      </div>

      <textarea
        name="address"
        value={formData.address}
        onChange={onChange}
        placeholder="Address"
        className="mt-5 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
      />

      <div className="flex justify-end">
        <button type="button" onClick={next} className="rounded-lg bg-blue-600 px-6 py-3 text-white">
          Next →
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
