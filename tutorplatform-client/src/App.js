import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ClassListPage from "./pages/ClassListPage";
import ClassDetailPage from "./pages/ClassDetailPage";
import MyClassesPage from "./pages/MyClassesPage";
import CreateClassPage from "./pages/CreateClassPage";
import EditClassPage from "./pages/EditClassPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import WalletPage from "./pages/WalletPage";
import "./App.css";

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Public - Browse Classes */}
        <Route path="/classes" element={<ClassListPage />} />
        <Route path="/classes/:id" element={<ClassDetailPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Tutor Routes - Protected */}
        <Route
          path="/tutor/classes"
          element={
            <ProtectedRoute>
              <MyClassesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tutor/classes/create"
          element={
            <ProtectedRoute>
              <CreateClassPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tutor/classes/edit/:id"
          element={
            <ProtectedRoute>
              <EditClassPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <WalletPage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/classes" replace />} />
        <Route path="*" element={<Navigate to="/classes" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
