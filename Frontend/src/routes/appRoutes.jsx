import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "../layouts/Dasboardlayout";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Student from "../pages/Student/Student";
import Teacher from "../pages/Teacher/Teacher";
import Attendence from "../pages/Attendence/Attendence";
import Timetable from "../pages/Timetable/Timetable";
import FeeandFinance from "../pages/Fees/FeeandFinance";
import Exams from "../pages/Exams/Exams";
import Results from "../pages/Exams/Results";
import TeacherAttendance from "../pages/Teacher/TeacherAttendance";
// import Transport from "../pages/Transport/Transport";
import NewAdmission from "../pages/Admission/NewAdmission";
import Setting from "../pages/Setting/Setting";
// import AuditLogs from "../pages/Setting/AuditLogs";
// import Integrations from "../pages/Setting/Integrations";
import SchoolProfile from "../pages/Setting/SchoolProfile";
import Masters from "../pages/Setting/Masters-pages/Masters";
import AcademicYears from "../pages/Setting/Masters-pages/AcademicYears";
import ExamTypes from "../pages/Setting/Masters-pages/ExamTypes";
import ClassSections from "../pages/Setting/Masters-pages/ClassSections";
import Subjects from "../pages/Setting/Masters-pages/Subjects";
import Departments from "../pages/Setting/Masters-pages/Departments";
import Designations from "../pages/Setting/Masters-pages/Designations";
import Categories from "../pages/Setting/Masters-pages/Categories";
import AcademicCalendar from "../pages/Setting/Masters-pages/AcademicCalendar";
import ProtectedRoute from "../components/Protectedroutes";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Login" replace />} />
      <Route path="/Login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Student" element={<Student />} />
        <Route path="/Teacher" element={<Teacher />} />
        <Route path="/Teacher-Attendance" element={<TeacherAttendance />} />
        <Route path="/Attendence" element={<Attendence />} />
        <Route path="/Timetable" element={<Timetable />} />
        <Route path="/Fees" element={<FeeandFinance />} />
        <Route path="/Exams" element={<Exams />} />
        <Route path="/Results" element={<Results />} />
        {/* <Route path="/Transport" element={<Transport />} /> */}
        <Route path="/Settings" element={<Setting />} />
       
        <Route path="/Settings/School-Profile" element={<SchoolProfile />} />
        <Route path="/Settings/Masters" element={<Masters />}>
          <Route index element={<Navigate to="Academic-Years" replace />} />
          <Route path="Academic-Years" element={<AcademicYears />} />
          <Route path="Exam-Types" element={<ExamTypes />} />
          <Route path="Class-Sections" element={<ClassSections />} />
          <Route path="Subjects" element={<Subjects />} />
          <Route path="Departments" element={<Departments />} />
          <Route path="Designations" element={<Designations />} />
          <Route path="Categories" element={<Categories />} />
          <Route path="Academic-Calendar" element={<AcademicCalendar />} />
        </Route>
        <Route path="/Admission/New-Admission" element={<NewAdmission />} />

        {/* 404 within dashboard layout */}
        <Route path="*" element={<NotFound />} />
      </Route>
      </Route>
      <Route path="/admission" element={<Navigate to="/Admission/New-Admission" replace />} />
      <Route path="/fees" element={<Navigate to="/Fees" replace />} />
      <Route path="/attendance" element={<Navigate to="/Attendence" replace />} />
      <Route path="/admissions/enquiry" element={<Navigate to="/Student" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
