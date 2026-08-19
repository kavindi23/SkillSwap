import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Skills from "./pages/Skills";
import Matches from "./pages/Matches";
import Exchanges from "./pages/Exchanges";
import Notifications from "./pages/Notifications";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminExchanges from "./pages/AdminExchanges";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================== */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            STUDENT ROUTES
        ========================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["student"]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={["student"]}
            >
              <Profile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/skills"
          element={
            <ProtectedRoute
              allowedRoles={["student"]}
            >
              <Skills />
            </ProtectedRoute>
          }
        />


        <Route
          path="/matches"
          element={
            <ProtectedRoute
              allowedRoles={["student"]}
            >
              <Matches />
            </ProtectedRoute>
          }
        />


        <Route
          path="/exchanges"
          element={
            <ProtectedRoute
              allowedRoles={["student"]}
            >
              <Exchanges />
            </ProtectedRoute>
          }
        />


        <Route
          path="/notifications"
          element={
            <ProtectedRoute
              allowedRoles={["student"]}
            >
              <Notifications />
            </ProtectedRoute>
          }
        />


        {/* =========================
            ADMIN ROUTES
        ========================== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/users"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <AdminUsers />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/exchanges"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <AdminExchanges />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}


export default App;