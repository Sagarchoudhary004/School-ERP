const PersonalInfo = ({ next }) => {
  return (
    <div className="bg-white rounded-xl p-6">

      <h2 className="font-semibold mb-5">
        Personal Information
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <input
          placeholder="First Name"
          className="border p-3 rounded-lg"
        />

        <input
          placeholder="Last Name"
          className="border p-3 rounded-lg"
        />

        <input
          type="date"
          className="border p-3 rounded-lg"
        />

        <select
          className="border p-3 rounded-lg"
        >
          <option>
            Select Gender
          </option>
        </select>

        <input
          placeholder="Phone"
          className="border p-3 rounded-lg"
        />

        <input
          placeholder="Email"
          className="border p-3 rounded-lg"
        />

      </div>

      <textarea
        placeholder="Address"
        className="border p-3 rounded-lg w-full mt-5"
      />

      <div className="flex justify-end mt-6">

        <button
          onClick={next}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Next →
        </button>

      </div>

    </div>
  );
};

export default PersonalInfo;