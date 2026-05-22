import { Navigate, Outlet } from "react-router-dom";

// Backend UserRole enum: Student=1, Tutor=2, Admin=3
export default function StudentRoute() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role: Student = 1
  if (!user || user.role !== 1) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
