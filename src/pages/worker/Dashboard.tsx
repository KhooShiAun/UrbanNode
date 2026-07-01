import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  LayoutGrid,
  MapPin,
  Timer,
} from "lucide-react";
import "./Dashboard.css";

type User = {
  id: number;
  full_name: string;
  role: string;
};

type Report = {
  id: number;
  description: string;
  location_text?: string | null;
  severity: "urgent" | "routine" | "low" | "uncategorised";
  status: "new" | "in_progress" | "resolved" | "uncategorised";
  sla_deadline?: string | null;
  assignee_id?: number | null;
  created_at?: string | null;
};

export function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const userRes = await fetch("/api/auth/me", { credentials: "include" });
        if (!userRes.ok) throw new Error("Failed to fetch user");
        const userData = await userRes.json();
        setUser(userData);

        const reportsRes = await fetch("/api/reports", {
          credentials: "include",
        });
        if (!reportsRes.ok) throw new Error("Failed to fetch reports");

        const reportsData = await reportsRes.json();
        setReports(Array.isArray(reportsData) ? reportsData : reportsData.data ?? []);

        setLastUpdated(new Date());
      } catch (error) {
        console.error("Unable to load worker dashboard:", error);
      }
    }

    loadDashboard();
  }, []);

  const now = new Date();

  const totalReports = reports.length;
  const urgentReports = reports.filter((r) => r.severity === "urgent").length;
  const routineReports = reports.filter((r) => r.severity === "routine").length;
  const lowReports = reports.filter((r) => r.severity === "low").length;
  const overdueReports = reports.filter(
    (r) =>
      r.sla_deadline &&
      new Date(r.sla_deadline) < now &&
      r.status !== "resolved"
  ).length;

  const assignedTickets = useMemo(() => {
    const assigned = reports
      .filter((r) => r.assignee_id === user?.id && r.status !== "resolved")
      .slice(0, 3);

    return assigned;
  }, [reports, user]);

  const recentActivity = reports.slice(0, 3);

  const kpis = [
  {
    id: "total",
    label: "Total Reports",
    value: totalReports,
  },
  {
    id: "urgent",
    label: "Urgent",
    value: urgentReports,
    icon: AlertTriangle,
  },
  {
    id: "routine",
    label: "Routine",
    value: routineReports,
    icon: CheckCircle2,
  },
  {
    id: "low",
    label: "Low",
    value: lowReports,
    icon: LayoutGrid,
  },
  {
    id: "overdue",
    label: "Overdue",
    value: overdueReports,
    icon: AlertTriangle,
  },
];

 function formatLastUpdated(date: Date | null) {
  if (!date) return "--";

  return date.toLocaleTimeString("en-MY", {
    hour: "numeric",
    minute: "2-digit",
  });
}

  function formatSeverity(severity: string) {
    if (severity === "urgent") return "Urgent";
    if (severity === "routine") return "Routine";
    if (severity === "low") return "Low";
    return "Uncategorised";
  }

  function formatStatus(status: string) {
    if (status === "new") return "new";
    if (status === "in_progress") return "in progress";
    if (status === "resolved") return "resolved";
    return "uncategorised";
  }

  function getSlaText(deadline?: string | null) {
    if (!deadline) return "No SLA";

    const diffMs = new Date(deadline).getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

    if (diffHours < 0) {
      const overdueDays = Math.ceil(Math.abs(diffHours) / 24);
      return `+${overdueDays}d Overdue`;
    }

    if (diffHours < 24) return `${diffHours}h left`;

    return `${Math.ceil(diffHours / 24)}d left`;
  }

  function getTicketClass(report: Report) {
    if (
      report.sla_deadline &&
      new Date(report.sla_deadline) < now &&
      report.status !== "resolved"
    ) {
      return "overdue";
    }

    return report.severity;
  }

  return (
    <div className="worker-dashboard-page">
      <header className="worker-dashboard-header">
        <div>
          <h1>Overview</h1>
          <p>Here is your operational status for today.</p>
        </div>

        <span className="last-updated">
          Last updated: {formatLastUpdated(lastUpdated)}
        </span>
      </header>

      <section className="worker-kpi-grid">
        {kpis.map((item) => {
  const Icon = item.icon;

  return (
    <article key={item.id} className={`worker-kpi-card ${item.id}`}>
      <div className="worker-kpi-label">
        {Icon && <Icon size={15} />}
        <span>{item.label}</span>
      </div>

      <h2>{item.value}</h2>
    </article>
  );
})}
      </section>

      <h2 className="assigned-title">My Assigned Tickets</h2>

      <section className="worker-dashboard-bottom">
        <div className="assigned-list">
          {assignedTickets.length > 0 ? (
            assignedTickets.map((ticket) => {
              const ticketType = getTicketClass(ticket);
              const slaText = getSlaText(ticket.sla_deadline);

              return (
                <article
                  key={ticket.id}
                  className={`assigned-ticket ${ticketType}`}
                >
                  <div className="ticket-info">
                    <div className="ticket-meta">
                      <span className="ticket-code">
                        #TSK-{String(ticket.id).padStart(3, "0")}
                      </span>

                      <span className={`ticket-badge ${ticketType}`}>
                        {ticketType === "overdue"
                          ? "Overdue"
                          : formatSeverity(ticket.severity)}
                      </span>
                    </div>

                    <h3>{ticket.description}</h3>

                    <p>
                      <MapPin size={15} />
                      {ticket.location_text ?? "No location provided"}
                    </p>
                  </div>

                  <div className="ticket-actions">
                    <span className={`sla-text ${ticketType}`}>
                      <Timer size={15} />
                      {slaText}
                    </span>

                    <a
                      href={`/worker/tickets/${ticket.id}`}
                      className="update-button"
                    >
                      Update
                    </a>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty-card">No assigned tickets found.</div>
          )}
        </div>

        <aside className="recent-activity-card">
          <h2>Recent Activity</h2>

          <div className="activity-timeline">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={activity.id} className="activity-item">
                  <span
                    className={`activity-dot ${
                      index === 2 ? "danger" : index === 1 ? "muted" : ""
                    }`}
                  />

                  <div>
                    <p>
                      Ticket #TSK-{String(activity.id).padStart(3, "0")}{" "}
                      {formatStatus(activity.status)}
                      {activity.status === "resolved" ? " by worker." : "."}
                    </p>

                    <span>
                      {index === 0
                        ? "10 mins ago"
                        : index === 1
                        ? "1 hour ago"
                        : "2 hours ago"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-card">No recent activity found.</div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}