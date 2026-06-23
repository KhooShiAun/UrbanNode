import React, { useState, useEffect } from "react";
import "./Notifications.css";

// ✅ FIX: Aligned interface to real schema — removed nonexistent `title` and
//    `status` fields; added `type` which is likely the real discriminator column.
interface Notification {
  id: number;
  message: string;
  type: "done" | "in_progress" | string;
  is_read: boolean;
  created_at: string;
}

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // ✅ FIX: Added loading and error state for proper UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ FIX: Added credentials:'include' so session cookie is sent,
    //    res.ok check so HTTP errors don't silently succeed,
    //    and .catch() so network failures become visible errors
    //    (mirrors the MyReports pattern).
    fetch("/api/notifications", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load notifications:", err);
        setError("Could not load notifications. Please try again.");
        setLoading(false);
      });
  }, []);

  const getNotificationStyle = (type: string, isRead: boolean) => {
    if (isRead) {
      return { cardClass: "read", icon: "🔔" };
    }

    switch (type) {
      case "done":
        return { cardClass: "done", icon: "✔️" };
      case "in_progress":
        return { cardClass: "in-progress", icon: "⏱️" };
      default:
        return { cardClass: "read", icon: "🔔" };
    }
  };

  const handleNotificationClick = async (id: number) => {
    // ✅ FIX: Snapshot previous state so we can roll back if PATCH fails
    const previous = notifications;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        // ✅ FIX: credentials included so auth cookie is sent to the now-protected route
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      // ✅ FIX: Roll back optimistic update on failure so UI reflects truth
      console.error("Failed to mark notification as read:", err);
      setNotifications(previous);
    }
  };

  // ✅ FIX: Loading state — no longer renders blank while fetching
  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-header">
          <h1>Notifications</h1>
        </div>
        <div className="notifications-loading" aria-live="polite">
          Loading notifications…
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="notifications-page">
        <div className="notifications-header">
          <h1>Notifications</h1>
        </div>
        <div className="notifications-error" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
      </div>

      {/* ✅ FIX: Empty state — no longer renders blank when list is empty */}
      {notifications.length === 0 ? (
        <div className="notifications-empty">
          <span className="notifications-empty-icon">🔕</span>
          <p>You're all caught up — no notifications yet.</p>
        </div>
      ) : (
        notifications.map((notification) => {
          const style = getNotificationStyle(
            notification.type,
            notification.is_read,
          );

          return (
            // ✅ FIX: Replaced <div onClick> with <button> so it is keyboard-
            //    focusable and announces correctly to screen readers.
            //    type="button" prevents any accidental form submission.
            <button
              key={notification.id}
              type="button"
              onClick={() => handleNotificationClick(notification.id)}
              className={`notification-card ${style.cardClass}`}
              aria-pressed={notification.is_read}
              aria-label={`Notification from ${new Date(notification.created_at).toLocaleString()}. ${notification.is_read ? "Read" : "Unread"}.`}
            >
              <div className="notification-icon" aria-hidden="true">
                {style.icon}
              </div>

              <div className="notification-content">
                <p>{notification.message}</p>
                <small>
                  {new Date(notification.created_at).toLocaleString()}
                </small>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
};

export default Notifications;