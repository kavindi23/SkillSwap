import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./AdminLayout.css";

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    navigate("/");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-layout">

      {/* DESKTOP SIDEBAR */}
      <aside className="admin-shared-sidebar">

        <div>

          <h2 className="admin-shared-logo">
            SkillSwap
          </h2>

          <p className="admin-shared-subtitle">
            Platform Administration
          </p>

          <span className="admin-panel-badge">
            ADMIN PANEL
          </span>

          <nav className="admin-shared-nav">

            <Link
              className={`admin-shared-nav-link ${
                isActive("/admin/dashboard")
                  ? "active"
                  : ""
              }`}
              to="/admin/dashboard"
            >
              Dashboard
            </Link>

            <Link
              className={`admin-shared-nav-link ${
                isActive("/admin/users")
                  ? "active"
                  : ""
              }`}
              to="/admin/users"
            >
              User Management
            </Link>

            <Link
              className={`admin-shared-nav-link ${
                isActive("/admin/exchanges")
                  ? "active"
                  : ""
              }`}
              to="/admin/exchanges"
            >
              Exchange Management
            </Link>

          </nav>

        </div>


        <button
          className="admin-shared-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>


      {/* MOBILE TOP BAR */}
      <header className="admin-mobile-navbar">

        <div>
          <strong>
            SkillSwap
          </strong>

          <span>
            Admin
          </span>
        </div>


        <button
          type="button"
          className="admin-mobile-menu-button"
          aria-label="Toggle admin navigation"
          aria-expanded={mobileMenuOpen}
          onClick={() =>
            setMobileMenuOpen(
              (previous) => !previous
            )
          }
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

      </header>


      {/* MOBILE MENU */}
      {mobileMenuOpen && (

        <nav className="admin-mobile-menu">

          <Link
            className={`admin-mobile-nav-link ${
              isActive("/admin/dashboard")
                ? "active"
                : ""
            }`}
            to="/admin/dashboard"
            onClick={closeMobileMenu}
          >
            Dashboard
          </Link>

          <Link
            className={`admin-mobile-nav-link ${
              isActive("/admin/users")
                ? "active"
                : ""
            }`}
            to="/admin/users"
            onClick={closeMobileMenu}
          >
            User Management
          </Link>

          <Link
            className={`admin-mobile-nav-link ${
              isActive("/admin/exchanges")
                ? "active"
                : ""
            }`}
            to="/admin/exchanges"
            onClick={closeMobileMenu}
          >
            Exchange Management
          </Link>

          <button
            type="button"
            className="admin-mobile-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </nav>

      )}


      {/* PAGE CONTENT */}
      <main className="admin-layout-content">
        {children}
      </main>

    </div>
  );
}

export default AdminLayout;