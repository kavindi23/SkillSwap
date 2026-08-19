import { useEffect, useState } from "react";

import StudentLayout from "../components/StudentLayout";

import {
  getNotifications,
  markNotificationRead,
} from "../service/api";

import "./Notifications.css";


function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  const loadNotifications = async () => {
    try {
      setError("");

      const data = await getNotifications();

      setNotifications(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadNotifications();
  }, []);


  const handleMarkRead = async (notificationId) => {
    try {
      setProcessingId(notificationId);
      setMessage("");
      setError("");

      await markNotificationRead(notificationId);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                is_read: true,
              }
            : notification
        )
      );

      setMessage(
        "Notification marked as read."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };


  if (loading) {
    return (
      <div className="notifications-loading">
        Loading notifications...
      </div>
    );
  }


  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;


  const getNotificationIcon = (type) => {
    switch (type) {
      case "EXCHANGE_REQUEST":
        return "🤝";

      case "REQUEST_ACCEPTED":
        return "✅";

      case "REQUEST_REJECTED":
        return "❌";

      case "SESSION_SCHEDULED":
        return "📅";

      case "SESSION_COMPLETED":
        return "🎓";

      case "EXCHANGE_COMPLETED":
        return "🏆";

      case "REVIEW_RECEIVED":
        return "⭐";

      default:
        return "🔔";
    }
  };


  return (
    <StudentLayout>

      <div className="notifications-main">

        {/* =========================
            HEADER
        ========================== */}

        <header className="notifications-header">

          <div>

            <p className="notifications-label">
              NOTIFICATIONS
            </p>

            <h1>
              Your Notifications
            </h1>

            <p>
              Stay updated with exchange requests,
              sessions and reviews.
            </p>

          </div>


          <div className="notification-count-card">

            <span>
              🔔
            </span>

            <div>

              <p>
                Unread
              </p>

              <h2>
                {unreadCount}
              </h2>

            </div>

          </div>

        </header>


        {/* =========================
            SUCCESS / ERROR
        ========================== */}

        {message && (
          <div className="notifications-success">
            {message}
          </div>
        )}


        {error && (
          <div className="notifications-error">
            {error}
          </div>
        )}


        {/* =========================
            NOTIFICATIONS
        ========================== */}

        <section className="notifications-card">

          <div className="notifications-card-header">

            <div>

              <h2>
                Recent Notifications
              </h2>

              <p>
                {notifications.length} notification
                {notifications.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

          </div>


          {notifications.length === 0 ? (

            <div className="notifications-empty">

              <span>
                🔔
              </span>

              <h3>
                No notifications yet
              </h3>

              <p>
                New exchange and session updates
                will appear here.
              </p>

            </div>

          ) : (

            <div className="notification-list">

              {notifications.map(
                (notification) => (

                  <article
                    className={`notification-item ${
                      notification.is_read
                        ? "read"
                        : "unread"
                    }`}
                    key={notification.id}
                  >

                    {/* ICON */}

                    <div className="notification-icon">

                      {getNotificationIcon(
                        notification.notification_type
                      )}

                    </div>


                    {/* CONTENT */}

                    <div className="notification-content">

                      <div className="notification-title-row">

                        <h3>
                          {notification.title}
                        </h3>


                        {!notification.is_read && (
                          <span
                            className="unread-dot"
                            aria-label="Unread notification"
                          />
                        )}

                      </div>


                      <p className="notification-message">
                        {notification.message}
                      </p>


                      <div className="notification-bottom">

                        <span className="notification-type">

                          {notification.notification_type
                            .replaceAll("_", " ")}

                        </span>


                        <span className="notification-date">

                          {new Date(
                            notification.created_at
                          ).toLocaleString()}

                        </span>

                      </div>

                    </div>


                    {/* ACTION */}

                    {!notification.is_read && (

                      <div className="notification-actions">

                        <button
                          type="button"
                          className="mark-read-button"
                          onClick={() =>
                            handleMarkRead(
                              notification.id
                            )
                          }
                          disabled={
                            processingId ===
                            notification.id
                          }
                        >
                          {processingId ===
                          notification.id
                            ? "Updating..."
                            : "Mark as Read"}
                        </button>

                      </div>

                    )}

                  </article>

                )
              )}

            </div>

          )}

        </section>

      </div>

    </StudentLayout>
  );
}


export default Notifications;