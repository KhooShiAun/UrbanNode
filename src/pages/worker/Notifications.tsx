import React, { useState, useEffect } from "react";
import "./Notifications.css";

interface Notification {
  id: number;
  title: string;
  message: string;
  status: "done" | "in_progress" | "urgent";
  is_read: boolean;
  created_at: string;
}

export const WorkerNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  fetch("/api/notifications")
    .then((res) => {
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      setNotifications(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to load notifications:", err);
      setError("Failed to load notifications. Please try again.");
      setLoading(false);
    });
}, []);

  const getNotificationStyle = (
    status: string,
    isRead: boolean,
  ) => {
    if (isRead) {
      return {
        cardClass: "read",
        icon: "🔔",
      };
    }

    switch (status) {
      case "done":
        return {
          cardClass: "done",
          icon: "✔️",
        };

      case "in_progress":
        return {
          cardClass: "in-progress",
          icon: "⏱️",
        };

      case "urgent":
        return {
          cardClass: "in-urgent",
          icon: "❗",
        };

      default:
        return {
          cardClass: "read",
          icon: "🔔",
        };
    }
  };

  const handleNotificationClick = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, is_read: true } : n)
    );
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
  };

return (
  <div className="notifications-page">
    <div className="notifications-header">
      <h1>Notifications</h1>
    </div>

    {loading && <p>Loading notifications…</p>}
    {error && <p className="error-message">{error}</p>}
    {!loading && !error && notifications.length === 0 && (
      <p>No notifications yet.</p>
    )}


      {notifications.map((notification) => {
        const style = getNotificationStyle(
          notification.status,
          notification.is_read,
        );

        return (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification.id)}
            className={`notification-card ${style.cardClass}`}
          >
            <div className="notification-icon">
              {style.icon}
            </div>

            <div className="notification-content">
              <h3>{notification.title}</h3>

              <p>{notification.message}</p>

              <small>
                {new Date(notification.created_at).toLocaleString()}
              </small>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkerNotifications;