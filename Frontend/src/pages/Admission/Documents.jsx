const Documents = ({ prev, formData, onChange, onSubmit, loading }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-6">Upload Documents</h2>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block mb-2 font-medium">Student Photo</label>
          <input name="studentPhoto" type="file" onChange={onChange} className="w-full border rounded-lg p-3" />
        </div>
        <div>
          <label className="block mb-2 font-medium">Aadhaar Card</label>
          <input name="aadhaarCard" type="file" onChange={onChange} className="w-full border rounded-lg p-3" />
        </div>
        <div>
          <label className="block mb-2 font-medium">Birth Certificate</label>
          <input name="birthCertificate" type="file" onChange={onChange} className="w-full border rounded-lg p-3" />
        </div>
        <div>
          <label className="block mb-2 font-medium">Transfer Certificate</label>
          <input name="transferCertificate" type="file" onChange={onChange} className="w-full border rounded-lg p-3" />
        </div>
        <div>
          <label className="block mb-2 font-medium">Previous Report Card</label>
          <input name="reportCard" type="file" onChange={onChange} className="w-full border rounded-lg p-3" />
        </div>
        <div>
          <label className="block mb-2 font-medium">Other Documents</label>
          <input
            name="otherDocuments"
            type="file"
            multiple
            onChange={(e) => onChange({ target: { name: "otherDocuments", type: "file", multiple: true, files: e.target.files } })}
            className="w-full border rounded-lg p-3"
          />
        </div>
      </div>

      <div className="mt-8">
        <label className="flex gap-3 items-center">
          <input name="declaration" type="checkbox" checked={formData.declaration} onChange={onChange} />
          <span>I hereby declare that all information provided is true and correct.</span>
        </label>
      </div>

      <div className="flex justify-between mt-8">
        <button type="button" onClick={prev} className="px-6 py-2 border rounded-lg">
          ← Previous
        </button>
        <button type="button" onClick={onSubmit} disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Submitting..." : "Submit Admission"}
        </button>
      </div>
    </div>
  );
};

export default Documents;
