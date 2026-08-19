import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // User is not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Route requires a specific role
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {
    // Admin trying to access student pages
    if (role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    // Student trying to access admin pages
    if (role === "student") {
      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );
    }

    // Unknown role
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;