const AcademicInfo = ({ next, prev }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">

      <h2 className="text-lg font-semibold mb-6">
        Academic Information
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        {/* Class */}

        <div>
          <label className="block mb-2 font-medium">
            Class
          </label>

          <select className="w-full border rounded-lg p-3">
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

        {/* Section */}

        <div>
          <label className="block mb-2 font-medium">
            Section
          </label>

          <select className="w-full border rounded-lg p-3">
            <option>Select Section</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
          </select>
        </div>

        {/* Admission Date */}

        <div>
          <label className="block mb-2 font-medium">
            Admission Date
          </label>

          <input
            type="date"
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Roll Number */}

        <div>
          <label className="block mb-2 font-medium">
            Roll Number
          </label>

          <input
            type="text"
            placeholder="Enter Roll Number"
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Previous School */}

        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">
            Previous School
          </label>

          <input
            type="text"
            placeholder="Enter Previous School Name"
            className="w-full border rounded-lg p-3"
          />
        </div>

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
          onClick={next}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Next →
        </button>

      </div>

    </div>
  );
};

export default AcademicInfo;