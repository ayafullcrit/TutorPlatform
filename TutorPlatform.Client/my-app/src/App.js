import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* Admin */
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Accounts from "./pages/admin/Accounts";
import Verifications from "./pages/admin/Verifications";
import Transactions from "./pages/admin/Transactions";
import SystemConfig from "./pages/admin/SystemConfig";
import ClassManagement from "./pages/admin/ClassManagement";

/* Student */
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import FindTutor from "./pages/student/FindTutor";
import Schedule from "./pages/student/Schedule";
import Profile from "./pages/student/Profile";

/* Tutor */
import TutorLayout from "./layouts/TutorLayout";
import TutorDashboard from "./pages/tutor/Dashboard";
import TutorClasses from "./pages/tutor/Classes";
import TutorStudents from "./pages/tutor/Students";
import TutorSchedule from "./pages/tutor/Schedule";
import TutorFinance from "./pages/tutor/Finance";
import TutorProfile from "./pages/tutor/Profile";
import TutorSubjects from "./pages/tutor/Subjects";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="verifications" element={<Verifications />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="system-config" element={<SystemConfig />} />
            <Route path="classes" element={<ClassManagement />} />
          </Route>
        </Route>

        {/* Student */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="find-tutor" element={<FindTutor />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Tutor */}
        <Route path="/tutor" element={<TutorLayout />}>
          <Route path="dashboard" element={<TutorDashboard />} />
          <Route path="classes" element={<TutorClasses />} />
          <Route path="students" element={<TutorStudents />} />
          <Route path="schedule" element={<TutorSchedule />} />
          <Route path="finance" element={<TutorFinance />} />
          <Route path="profile" element={<TutorProfile />} />
          <Route path="subjects" element={<TutorSubjects />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;