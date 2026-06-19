import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../services/dashboardService";
import {
  FaArrowRight,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaMoneyBillWave,
  FaUserGraduate,
  FaUserPlus,
} from "react-icons/fa";

const attendanceRate = (attendance = {}) => {
  const marked =
    (attendance.present || 0) +
    (attendance.absent || 0) +
    (attendance.leave || 0);

  if (!marked) return 0;
  return Math.round(((attendance.present || 0) / marked) * 100);
};

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError("");
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
        setError(error?.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = useMemo(
    () => [
      {
        label: "Total Students",
        value: stats?.totalStudents || 0,
        helper: "Active student records",
        icon: <FaUserGraduate />,
        tone: "bg-blue-50 text-blue-700",
      },
      {
        label: "Total Teachers",
        value: stats?.totalTeachers || 0,
        helper: "Teaching staff records",
        icon: <FaChalkboardTeacher />,
        tone: "bg-emerald-50 text-emerald-700",
      },
      {
        label: "Student Attendance",
        value: `${attendanceRate(stats?.studentAttendance)}%`,
        helper: "Present rate today",
        icon: <FaClipboardCheck />,
        tone: "bg-violet-50 text-violet-700",
      },
      {
        label: "Staff Attendance",
        value: `${attendanceRate(stats?.staffAttendance)}%`,
        helper: "Present rate today",
        icon: <FaClipboardCheck />,
        tone: "bg-amber-50 text-amber-700",
      },
    ],
    [stats]
  );

  const quickActions = [
    { label: "New Admission", path: "/Admission/New-Admission", icon: <FaUserPlus /> },
    { label: "Mark Attendance", path: "/Attendence", icon: <FaClipboardCheck /> },
    { label: "Collect Fee", path: "/Fees", icon: <FaMoneyBillWave /> },
  ];

  if (loading) {
    return (
      <div className="grid gap-5">
        <div className="h-40 rounded-2xl bg-white animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-32 rounded-2xl bg-white animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-[#0f172a] p-5 sm:p-6 lg:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-cyan-200">Today overview</p>
            <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold">
              {stats?.schoolName || "School CRM"} Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-300">
              Monitor admissions, attendance, staff strength, and daily operations from one clean workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
            <MiniStat label="Students Present" value={stats?.studentAttendance?.present || 0} />
            <MiniStat label="Staff Present" value={stats?.staffAttendance?.present || 0} />
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">{card.value}</h2>
                <p className="mt-1 text-sm text-slate-500">{card.helper}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.tone}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-5">
        <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Attendance Snapshot</h2>
              <p className="text-sm text-slate-500">Present, absent, and leave totals for today.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <AttendancePanel title="Students" data={stats?.studentAttendance} />
            <AttendancePanel title="Staff" data={stats?.staffAttendance} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
          <p className="text-sm text-slate-500 mb-4">Jump into frequent school workflows.</p>

          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="w-full min-h-12 rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between gap-3 text-left hover:border-blue-300 hover:bg-blue-50 transition"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-slate-800">
                  <span className="text-blue-700">{action.icon}</span>
                  {action.label}
                </span>
                <FaArrowRight className="text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const MiniStat = ({ label, value }) => (
  <div className="rounded-xl bg-white/10 p-4 border border-white/10">
    <p className="text-xs text-slate-300">{label}</p>
    <p className="mt-1 text-2xl font-bold">{value}</p>
  </div>
);

const AttendancePanel = ({ title, data = {} }) => {
  const present = data.present || 0;
  const absent = data.absent || 0;
  const leave = data.leave || 0;
  const total = data.total || 0;
  const marked = present + absent + leave;
  const rate = attendanceRate(data);

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <span className="text-sm font-semibold text-blue-700">{rate}% present</span>
      </div>

      <div className="mt-4 h-3 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-emerald-500"
          style={{ width: `${marked ? (present / marked) * 100 : 0}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <StatusCount label="Present" value={present} color="text-emerald-700" />
        <StatusCount label="Absent" value={absent} color="text-red-700" />
        <StatusCount label="Leave" value={leave} color="text-amber-700" />
      </div>

      <p className="mt-4 text-xs text-slate-500">
        {marked} marked out of {total} records
      </p>
    </div>
  );
};

const StatusCount = ({ label, value, color }) => (
  <div className="rounded-lg bg-slate-50 p-3">
    <p className={`text-lg font-bold ${color}`}>{value}</p>
    <p className="text-xs text-slate-500">{label}</p>
  </div>
);

export default Dashboard;
