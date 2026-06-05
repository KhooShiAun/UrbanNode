import React, { useState, useEffect } from "react";
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
    // Replace this section with database query later
    const mockData: Notification[] = [
      {
        id: 1,
        title: "Report Resolved",
        message: "Your report UR-031 has been marked as Resolved.",
        status: "done",
        is_read: false,
        created_at: "2026-05-25T10:30:00",
      },
      {
        id: 2,
        title: "Report In Progress",
        message: "Ahmad bin Ali is currently working on your report.",
        status: "in_progress",
        is_read: false,
        created_at: "2026-05-25T08:15:00",
      },
      {
        id: 3,
        title: "AI Severity Assigned",
        message: "Your report has been classified as ROUTINE severity.",
        status: "done",
        is_read: true,
        created_at: "2026-05-24T18:00:00",
      },
      {
        id: 4,
        title: "SLA Warning",
        message: "24 hours remaining before SLA deadline.",
        status: "done",
        is_read: true,
        created_at: "2026-05-23T09:00:00",
      },
      {
        id: 5,
        title: "Community Bear Reward",
        message: "🎉 Congratulations! You unlocked the Safety Helmet gear.",
        status: "in_progress",
        is_read: true,
        created_at: "2026-05-22T16:15:00",
      },
      {
        id: 6,
        title: "Location Confirmed",
        message: "Report submitted successfully at pinned location.",
        status: "done",
        is_read: true,
        created_at: "2026-05-21T13:45:00",
      },
    ];

    setNotifications(mockData);
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
    prev.map((notification) =>
      notification.id === id
        ? {
            ...notification,
            is_read: true,
          }
        : notification,
    ),
  );

  // Future database update
  /*
  await db.notifications.update({
    is_read: true
  })
  */
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
      onClick={() =>
        handleNotificationClick(notification.id)
      }
      className={`notification-card ${style.cardClass}`}
    >
      <div className="notification-icon">
        {style.icon}
      </div>

      <div className="notification-content">
        <h3>{notification.title}</h3>

        <p>{notification.message}</p>

        <small>
          {new Date(
            notification.created_at,
          ).toLocaleString()}
        </small>
      </div>
    </div>
  );
})}
    </div>
  );
};

export default Notifications;