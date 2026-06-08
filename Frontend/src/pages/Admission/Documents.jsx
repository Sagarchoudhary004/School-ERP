const Documents = ({ prev }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">

      <h2 className="text-lg font-semibold mb-6">
        Upload Documents
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        {/* Student Photo */}

        <div>
          <label className="block mb-2 font-medium">
            Student Photo
          </label>

          <input
            type="file"
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Aadhaar */}

        <div>
          <label className="block mb-2 font-medium">
            Aadhaar Card
          </label>

          <input
            type="file"
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Birth Certificate */}

        <div>
          <label className="block mb-2 font-medium">
            Birth Certificate
          </label>

          <input
            type="file"
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Transfer Certificate */}

        <div>
          <label className="block mb-2 font-medium">
            Transfer Certificate
          </label>

          <input
            type="file"
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Report Card */}

        <div>
          <label className="block mb-2 font-medium">
            Previous Report Card
          </label>

          <input
            type="file"
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Other Documents */}

        <div>
          <label className="block mb-2 font-medium">
            Other Documents
          </label>

          <input
            type="file"
            className="w-full border rounded-lg p-3"
          />
        </div>

      </div>

      {/* Declaration */}

      <div className="mt-8">

        <label className="flex gap-3 items-center">

          <input type="checkbox" />

          <span>
            I hereby declare that all information
            provided is true and correct.
          </span>

        </label>

      </div>

      {/* Buttons */}

      <div className="flex justify-between mt-8">

        <button
          onClick={prev}
          className="px-6 py-2 border rounded-lg"
        >
          ← Previous
        </button>

        <button
          className="px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          Submit Admission
        </button>

      </div>

    </div>
  );
};

export default Documents;