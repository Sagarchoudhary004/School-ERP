const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN");
};

const RecentAdmissionsTable = ({ students }) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="border-b px-4 py-4 sm:px-6">
        <h2 className="text-lg font-semibold">Recent Admissions</h2>
        <p className="text-sm text-slate-500">Latest students saved in MongoDB</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Roll Number</th>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Guardian Name</th>
              <th className="px-4 py-3">Admission Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {students.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-sm text-slate-500" colSpan={7}>
                  No admissions found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id} className="text-sm">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{student.rollNumber}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{student.firstName} {student.lastName}</td>
                  <td className="px-4 py-3 text-slate-600">{student.studentClass}</td>
                  <td className="px-4 py-3 text-slate-600">{student.section}</td>
                  <td className="px-4 py-3 text-slate-600">{student.guardianName}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(student.admissionDate)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {student.status || "Active"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAdmissionsTable;
