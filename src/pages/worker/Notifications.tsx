import React, { useState, useEffect } from "react";
import { Bell, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
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

  const getNotificationStatus = (message: string): "urgent" | "in_progress" | "done" | "default" => {
    const msg = message.toLowerCase();
    if (msg.includes("urgent") || msg.includes("critical")) return "urgent";
    if (msg.includes("in progress") || msg.includes("assigned")) return "in_progress";
    if (msg.includes("resolved") || msg.includes("completed") || msg.includes("thank you")) return "done";
    return "default";
  };

  const getNotificationStyle = (
    message: string,
    isRead: boolean,
  ) => {
    if (isRead) {
      return {
        cardClass: "read",
        icon: <Bell size={24} style={{ color: '#9ca3af' }} />,
      };
    }

    const status = getNotificationStatus(message);
    switch (status) {
      case "done":
        return {
          cardClass: "done",
          icon: <CheckCircle2 size={24} style={{ color: '#10b981' }} />,
        };

      case "in_progress":
        return {
          cardClass: "in-progress",
          icon: <Clock size={24} style={{ color: '#f59e0b' }} />,
        };

      case "urgent":
        return {
          cardClass: "urgent",
          icon: <AlertTriangle size={24} style={{ color: '#ef4444' }} />,
        };

      default:
        return {
          cardClass: "unread-default",
          icon: <Bell size={24} style={{ color: 'var(--color-outline)' }} />,
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

    <div className="notifications-container">
      {notifications.map((notification) => {
        const style = getNotificationStyle(
          notification.message,
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
              <p className="notification-message">{notification.message}</p>

              <span className="notification-time">
                {new Date(notification.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
};

export default WorkerNotifications;