import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import "./StudentLayout.css";

function StudentLayout({ children }) {
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
    <div className="student-layout">

      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}

      <aside className="student-sidebar">

        <div>
          <h2 className="student-logo">
            SkillSwap
          </h2>

          <p className="student-logo-subtitle">
            Learn. Teach. Connect.
          </p>

          <nav className="student-sidebar-nav">

            <Link
              className={`student-nav-link ${
                isActive("/dashboard")
                  ? "active"
                  : ""
              }`}
              to="/dashboard"
            >
              Dashboard
            </Link>

            <Link
              className={`student-nav-link ${
                isActive("/profile")
                  ? "active"
                  : ""
              }`}
              to="/profile"
            >
              My Profile
            </Link>

            <Link
              className={`student-nav-link ${
                isActive("/skills")
                  ? "active"
                  : ""
              }`}
              to="/skills"
            >
              My Skills
            </Link>

            <Link
              className={`student-nav-link ${
                isActive("/matches")
                  ? "active"
                  : ""
              }`}
              to="/matches"
            >
              Skill Matches
            </Link>

            <Link
              className={`student-nav-link ${
                isActive("/exchanges")
                  ? "active"
                  : ""
              }`}
              to="/exchanges"
            >
              Exchanges
            </Link>

            <Link
              className={`student-nav-link ${
                isActive("/notifications")
                  ? "active"
                  : ""
              }`}
              to="/notifications"
            >
              Notifications
            </Link>

          </nav>
        </div>


        <button
          className="student-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>


      {/* =========================
          MOBILE TOP BAR
      ========================== */}

      <header className="student-mobile-navbar">

        <div className="student-mobile-brand">
          SkillSwap
        </div>


        <button
          className="student-mobile-menu-button"
          type="button"
          aria-label="Toggle navigation menu"
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


      {/* =========================
          MOBILE MENU
      ========================== */}

      {mobileMenuOpen && (

        <nav className="student-mobile-menu">

          <Link
            className={`student-mobile-nav-link ${
              isActive("/dashboard")
                ? "active"
                : ""
            }`}
            to="/dashboard"
            onClick={closeMobileMenu}
          >
            Dashboard
          </Link>

          <Link
            className={`student-mobile-nav-link ${
              isActive("/profile")
                ? "active"
                : ""
            }`}
            to="/profile"
            onClick={closeMobileMenu}
          >
            My Profile
          </Link>

          <Link
            className={`student-mobile-nav-link ${
              isActive("/skills")
                ? "active"
                : ""
            }`}
            to="/skills"
            onClick={closeMobileMenu}
          >
            My Skills
          </Link>

          <Link
            className={`student-mobile-nav-link ${
              isActive("/matches")
                ? "active"
                : ""
            }`}
            to="/matches"
            onClick={closeMobileMenu}
          >
            Skill Matches
          </Link>

          <Link
            className={`student-mobile-nav-link ${
              isActive("/exchanges")
                ? "active"
                : ""
            }`}
            to="/exchanges"
            onClick={closeMobileMenu}
          >
            Exchanges
          </Link>

          <Link
            className={`student-mobile-nav-link ${
              isActive("/notifications")
                ? "active"
                : ""
            }`}
            to="/notifications"
            onClick={closeMobileMenu}
          >
            Notifications
          </Link>


          <button
            className="student-mobile-logout-button"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </nav>

      )}


      {/* =========================
          PAGE CONTENT
      ========================== */}

      <main className="student-layout-content">
        {children}
      </main>

    </div>
  );
}

export default StudentLayout;