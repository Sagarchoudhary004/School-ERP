const GuardianInfo = ({
  next,
  prev,
}) => {
  return (
    <div className="bg-white rounded-xl p-6">

      <h2 className="font-semibold mb-5">
        Guardian Details
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <input
          placeholder="Guardian Name"
          className="border p-3 rounded-lg"
        />

        <input
          placeholder="Phone Number"
          className="border p-3 rounded-lg"
        />

        <input
          placeholder="Occupation"
          className="border p-3 rounded-lg"
        />

        <input
          placeholder="Email"
          className="border p-3 rounded-lg"
        />

      </div>

      <div className="flex justify-between mt-6">

        <button
          onClick={prev}
          className="border px-5 py-2 rounded-lg"
        >
          ← Previous
        </button>

        <button
          onClick={next}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Next →
        </button>

      </div>

    </div>
  );
};

export default GuardianInfo;