import React, { useState, useEffect } from "react";
import { apiGet, apiSend } from "@/lib/api";
import "./Notifications.css";

interface Notification {
  id: number;
  title: string;
  message: string;
  status: "done" | "in_progress";
  is_read: boolean;
  created_at: string;
}

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    apiGet<Notification[]>("/api/notifications")
      .then((data) => setNotifications(data))
      .catch(() => {});
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
    try {
      await apiSend(`/api/notifications/${id}/read`, "PATCH");
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
      </div>

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

export default Notifications;