import React, { useState } from "react";
import "./Notifications.css";

interface Notification {
  id: number;
  reportId?: string;
  title: string;
  message: string;
  date: string;
  category:
    | "status"
    | "sla"
    | "ai"
    | "reward"
    | "location"
    | "system";
  read: boolean;
}

const Notifications: React.FC = () => {
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      reportId: "UR-031",
      title: "Report Resolved",
      message: "Your report UR-031 has been marked as Resolved.",
      date: "25 May 2026, 10:30 AM",
      category: "status",
      read: false,
    },
    {
      id: 2,
      reportId: "UR-042",
      title: "Report In Progress",
      message: "Ahmad bin Ali is currently working on your report.",
      date: "25 May 2026, 8:15 AM",
      category: "status",
      read: false,
    },
    {
      id: 3,
      reportId: "UR-042",
      title: "AI Severity Assigned",
      message: "Your report has been classified as ROUTINE severity.",
      date: "24 May 2026, 6:00 PM",
      category: "ai",
      read: true,
    },
    {
      id: 4,
      reportId: "UR-029",
      title: "SLA Warning",
      message: "24 hours remaining before SLA deadline.",
      date: "23 May 2026, 9:00 AM",
      category: "sla",
      read: true,
    },
    {
      id: 5,
      title: "Community Bear Reward",
      message:
        "🎉 Congratulations! You unlocked the Safety Helmet gear.",
      date: "22 May 2026, 4:15 PM",
      category: "reward",
      read: true,
    },
    {
      id: 6,
      reportId: "UR-050",
      title: "Location Confirmed",
      message: "Report submitted successfully at pinned location.",
      date: "21 May 2026, 1:45 PM",
      category: "location",
      read: true,
    },
  ]);

  const getCategoryClass = (category: string) => {
    switch (category) {
      case "status":
        return "status";
      case "sla":
        return "sla";
      case "ai":
        return "ai";
      case "reward":
        return "reward";
      case "location":
        return "location";
      default:
        return "system";
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
      </div>

      <div className="notifications-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-card ${getCategoryClass(
              notification.category
            )} ${notification.read ? "" : "unread"}`}
          >
            <div className="notification-icon">
              {notification.category === "reward"
                ? "🏆"
                : notification.category === "sla"
                ? "⏱️"
                : notification.category === "ai"
                ? "🧠"
                : notification.category === "location"
                ? "📍"
                : "✔️"}
            </div>

            <div className="notification-content">
              <h3>{notification.title}</h3>

              <p>{notification.message}</p>

              {notification.reportId && (
                <span className="report-tag">
                  Report: {notification.reportId}
                </span>
              )}

              <small>{notification.date}</small>
            </div>

            <button className="view-btn">
              View Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;