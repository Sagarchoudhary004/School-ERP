import { Route,Routes,Navigate} from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Student from "../pages/Student/Student";
import Transport from "../pages/Transport/Transport";
import Attendence from "../pages/Attendence/Attendence";
import Teacher from "../pages/Teacher/Teacher";
import Timetable from "../pages/Timetable/Timetable";
import FeeandFinance from "../pages/Fees/FeeandFinance";
import Exams from "../pages/Exams/Exams";
import Setting from "../pages/Setting/Setting"
import DashboardLayout from "../layouts/Dasboardlayout";
import Login from "../pages/Login/Login";
import Integrations from "../pages/Setting/Integrations";
import AuditLogs from "../pages/Setting/AuditLogs";
import Masters from "../pages/Setting/Masters-pages/Masters";
import SchoolProfile from "../pages/Setting/SchoolProfile";

function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element={<Navigate to="/Login"/>}/>
            <Route path="/Login" element={<Login/>}/>
            <Route element={<DashboardLayout/>}>
            <Route path="/Dashboard" element={<Dashboard/>}/>
            <Route path="/Student" element={<Student/>}/>
            <Route path="/Transport" element={<Transport/>}/>
            <Route path="/Teacher" element={<Teacher/>}/>
            <Route path="/Attendence" element={<Attendence/>}/>
            <Route path="/Timetable" element={<Timetable/>}/>
            <Route path="/Fees" element={<FeeandFinance/>}/>
            <Route path="/Exams" element={<Exams/>}/>
            <Route path="/Settings/Audit-Logs" element={<AuditLogs/>}/>
            <Route path="/Settings/Integration" element={<Integrations/>}/>
            <Route path="/Settings/Masters" element={<Masters/>}/>
            <Route path="/Settings/School-Profile" element={<SchoolProfile/>}/>
            </Route>
        </Routes>

    );
}
export default AppRoutes;