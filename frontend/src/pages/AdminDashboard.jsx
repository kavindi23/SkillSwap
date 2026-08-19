import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";

import { getAdminDashboard } from "../service/api";

import "./AdminDashboard.css";


function AdminDashboard() {
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // LOAD ADMIN DASHBOARD
  // =========================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError("");

        const data =
          await getAdminDashboard();

        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="admin-loading">
        Loading admin dashboard...
      </div>
    );
  }


  return (
    <AdminLayout>

      <div className="admin-main">

        {/* =========================
            HEADER
        ========================== */}

        <header className="admin-header">

          <div>

            <p className="admin-header-label">
              ADMINISTRATION
            </p>

            <h1>
              Admin Dashboard
            </h1>

            <p className="admin-header-description">
              Monitor users, exchanges and overall
              SkillSwap activity.
            </p>

          </div>


          <div className="admin-avatar">
            AD
          </div>

        </header>


        {/* =========================
            ERROR
        ========================== */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}


        {stats && (
          <>

            {/* =========================
                STATISTICS
            ========================== */}

            <section className="admin-stats-grid">

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  👥
                </div>

                <div className="admin-stat-info">

                  <p>
                    Total Users
                  </p>

                  <h2>
                    {stats.total_users}
                  </h2>

                </div>

              </div>


              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  📚
                </div>

                <div className="admin-stat-info">

                  <p>
                    Total Skills
                  </p>

                  <h2>
                    {stats.total_skills}
                  </h2>

                </div>

              </div>


              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  🤝
                </div>

                <div className="admin-stat-info">

                  <p>
                    Total Exchanges
                  </p>

                  <h2>
                    {stats.total_exchanges}
                  </h2>

                </div>

              </div>


              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  🔄
                </div>

                <div className="admin-stat-info">

                  <p>
                    Active Exchanges
                  </p>

                  <h2>
                    {stats.active_exchanges}
                  </h2>

                </div>

              </div>


              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  ✅
                </div>

                <div className="admin-stat-info">

                  <p>
                    Completed Exchanges
                  </p>

                  <h2>
                    {stats.completed_exchanges}
                  </h2>

                </div>

              </div>


              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  📅
                </div>

                <div className="admin-stat-info">

                  <p>
                    Total Sessions
                  </p>

                  <h2>
                    {stats.total_sessions}
                  </h2>

                </div>

              </div>


              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  ⭐
                </div>

                <div className="admin-stat-info">

                  <p>
                    Total Reviews
                  </p>

                  <h2>
                    {stats.total_reviews}
                  </h2>

                </div>

              </div>

            </section>


            {/* =========================
                BOTTOM CONTENT
            ========================== */}

            <section className="admin-content-grid">

              {/* PLATFORM OVERVIEW */}

              <div className="admin-card">

                <div className="admin-card-header">

                  <h2>
                    Platform Overview
                  </h2>

                  <p>
                    Current SkillSwap activity summary.
                  </p>

                </div>


                <div className="admin-overview-list">

                  <div className="admin-overview-item">

                    <span>
                      Registered Users
                    </span>

                    <strong>
                      {stats.total_users}
                    </strong>

                  </div>


                  <div className="admin-overview-item">

                    <span>
                      Skills Available
                    </span>

                    <strong>
                      {stats.total_skills}
                    </strong>

                  </div>


                  <div className="admin-overview-item">

                    <span>
                      Exchanges in Progress
                    </span>

                    <strong>
                      {stats.active_exchanges}
                    </strong>

                  </div>


                  <div className="admin-overview-item">

                    <span>
                      Successfully Completed
                    </span>

                    <strong>
                      {stats.completed_exchanges}
                    </strong>

                  </div>


                  <div className="admin-overview-item">

                    <span>
                      Learning Sessions
                    </span>

                    <strong>
                      {stats.total_sessions}
                    </strong>

                  </div>

                </div>

              </div>


              {/* QUICK ACTIONS */}

              <div className="admin-card">

                <div className="admin-card-header">

                  <h2>
                    Quick Actions
                  </h2>

                  <p>
                    Manage the SkillSwap platform.
                  </p>

                </div>


                <div className="admin-quick-actions">

                  <Link
                    className="admin-action-link"
                    to="/admin/users"
                  >
                    👥 Manage Users
                  </Link>


                  <Link
                    className="admin-action-link"
                    to="/admin/users"
                  >
                    🔒 User Status Control
                  </Link>


                  <Link
                    className="admin-action-link"
                    to="/admin/exchanges"
                  >
                    🤝 Monitor Exchanges
                  </Link>

                </div>

              </div>

            </section>

          </>
        )}

      </div>

    </AdminLayout>
  );
}


export default AdminDashboard;