import { useEffect, useState } from "react";

import AdminLayout from "../components/AdminLayout";

import {
  getAdminUsers,
  updateAdminUserStatus,
} from "../service/api";

import "./AdminUsers.css";


function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [processingId, setProcessingId] =
    useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // =========================
  // LOAD USERS
  // =========================

  const loadUsers = async () => {
    try {
      setError("");

      const data =
        await getAdminUsers();

      setUsers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadUsers();
  }, []);


  // =========================
  // CHANGE USER STATUS
  // =========================

  const handleStatusChange = async (user) => {
    const newStatus = !user.is_active;

    const confirmed = window.confirm(
      newStatus
        ? `Activate ${user.full_name}?`
        : `Deactivate ${user.full_name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(user.id);

      setMessage("");
      setError("");

      await updateAdminUserStatus(
        user.id,
        newStatus
      );

      setUsers((previous) =>
        previous.map((item) =>
          item.id === user.id
            ? {
                ...item,
                is_active: newStatus,
              }
            : item
        )
      );

      setMessage(
        newStatus
          ? `${user.full_name} activated successfully.`
          : `${user.full_name} deactivated successfully.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="admin-users-loading">
        Loading users...
      </div>
    );
  }


  return (
    <AdminLayout>

      <div className="admin-users-main">

        {/* =========================
            HEADER
        ========================== */}

        <header className="admin-users-header">

          <div>

            <p className="admin-users-label">
              USER MANAGEMENT
            </p>

            <h1>
              Manage Users
            </h1>

            <p>
              View registered users and control
              account access.
            </p>

          </div>


          <div className="admin-users-count">

            <span>
              👥
            </span>

            <div>

              <p>
                Total Users
              </p>

              <h2>
                {users.length}
              </h2>

            </div>

          </div>

        </header>


        {/* =========================
            SUCCESS / ERROR
        ========================== */}

        {message && (
          <div className="admin-users-success">
            {message}
          </div>
        )}


        {error && (
          <div className="admin-users-error">
            {error}
          </div>
        )}


        {/* =========================
            USERS CARD
        ========================== */}

        <section className="admin-users-card">

          <div className="admin-users-card-header">

            <div>

              <h2>
                Registered Users
              </h2>

              <p>
                All users currently registered
                in SkillSwap.
              </p>

            </div>

          </div>


          {users.length === 0 ? (

            <div className="admin-users-empty">
              No users found.
            </div>

          ) : (

            <div className="admin-users-table-wrapper">

              <table className="admin-users-table">

                <thead>

                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>University</th>
                    <th>Location</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>

                </thead>


                <tbody>

                  {users.map((user) => {
                    const initials =
                      user.full_name
                        ?.split(" ")
                        .map((name) => name[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "U";

                    return (
                      <tr key={user.id}>

                        {/* USER */}

                        <td>

                          <div className="admin-user-info">

                            <div className="admin-user-avatar">
                              {initials}
                            </div>


                            <div>

                              <strong>
                                {user.full_name}
                              </strong>

                              <span>
                                {user.email}
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* ROLE */}

                        <td>

                          <span
                            className={`admin-role-badge ${user.role}`}
                          >
                            {user.role}
                          </span>

                        </td>


                        {/* UNIVERSITY */}

                        <td>

                          <div className="admin-university-info">

                            <span>
                              {user.university ||
                                "Not added"}
                            </span>


                            {user.department && (

                              <small>
                                {user.department}

                                {user.year
                                  ? ` • ${user.year}`
                                  : ""}
                              </small>

                            )}

                          </div>

                        </td>


                        {/* LOCATION */}

                        <td>
                          {user.location ||
                            "Not added"}
                        </td>


                        {/* RATING */}

                        <td>
                          ⭐{" "}
                          {Number(
                            user.rating || 0
                          ).toFixed(1)}
                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              user.is_active
                                ? "admin-status-badge active"
                                : "admin-status-badge inactive"
                            }
                          >
                            {user.is_active
                              ? "ACTIVE"
                              : "INACTIVE"}
                          </span>

                        </td>


                        {/* ACTION */}

                        <td>

                          {user.role === "admin" ? (

                            <span className="admin-protected-text">
                              Protected
                            </span>

                          ) : (

                            <button
                              type="button"
                              className={
                                user.is_active
                                  ? "deactivate-user-button"
                                  : "activate-user-button"
                              }
                              onClick={() =>
                                handleStatusChange(user)
                              }
                              disabled={
                                processingId === user.id
                              }
                            >
                              {processingId === user.id
                                ? "Updating..."
                                : user.is_active
                                  ? "Deactivate"
                                  : "Activate"}
                            </button>

                          )}

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

    </AdminLayout>
  );
}


export default AdminUsers;