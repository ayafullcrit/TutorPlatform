import { Navigate, Outlet } from "react-router-dom";

// Backend UserRole enum: Student=1, Tutor=2, Admin=3
export default function AdminRoute() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // role là số nguyên từ backend (Admin = 3)
  if (!user || user.role !== 3) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}