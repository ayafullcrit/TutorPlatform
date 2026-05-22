import { Navigate, Outlet } from "react-router-dom";

// Backend UserRole enum: Student=1, Tutor=2, Admin=3
export default function TutorRoute() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role: Tutor = 2
  if (!user || user.role !== 2) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
