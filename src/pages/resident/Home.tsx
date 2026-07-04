import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import {
  User,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Paintbrush,
  ChevronRight,
  Check,
  RefreshCw,
} from "lucide-react";

import "./Home.css";

type Report = {
  id: number;
  description: string;
  status: string;
  severity: string;
  created_at?: string;
};

export function Home() {
  const hour = new Date().getHours();

  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  const [userName, setUserName] = useState("User");
  const [reports, setReports] = useState<Report[]>([]);

  // 🟡 FIXED: Now correctly checks res.ok (via apiGet) and handles errors cleanly
  useEffect(() => {
    async function loadUser() {
      try {
        const data = await apiGet<{ full_name?: string }>("/api/auth/me");
        setUserName(data.full_name ?? "User");
      } catch (error) {
        console.error("Unable to load user:", error);
        setUserName("User"); // Fallback on error path
      }
    }

    loadUser();
  }, []);

  // 🟠 FIXED: Deriving stats directly from the fetched reports data array
  useEffect(() => {
    async function loadReports() {
      try {
        const data = await apiGet<Report[]>("/api/reports");
        setReports(data);
      } catch (error) {
        console.error("Unable to load reports:", error);
        setReports([]);
      }
    }

    loadReports();
  }, []);

  const totalReports = reports.length;

  const reportsInProgress = reports.filter(
    (report) =>
      report.status === "in_progress" ||
      report.status === "In Progress" ||
      report.status === "pending"
  ).length;

  const reportsResolved = reports.filter(
    (report) =>
      report.status === "resolved" ||
      report.status === "Resolved" ||
      report.status === "completed"
  ).length;

  const stats = [
    {
      id: "submitted",
      title: "Total Reports Submitted",
      value: totalReports,
      icon: ClipboardList,
    },
    {
      id: "progress",
      title: "Reports In Progress",
      value: reportsInProgress,
      icon: Clock,
    },
    {
      id: "resolved",
      title: "Reports Resolved",
      value: reportsResolved,
      icon: CheckCircle,
    },
  ];

  const recentReports = reports.slice(0, 3);

  // Helper to determine icon from description
  function getReportIcon(description: string) {
    const value = description.toLowerCase();

    if (value.includes("light") || value.includes("lamp") || value.includes("dark")) return Lightbulb;
    if (value.includes("graffiti") || value.includes("paint")) return Paintbrush;

    return AlertTriangle;
  }

  function formatReportDate(date?: string) {
    if (!date) return "Recently reported";

    return `Reported ${new Date(date).toLocaleDateString("en-MY", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }

  // Exact mockup statuses to display
  function formatStatus(status: string) {
    if (status === "in_progress" || status === "pending") return "In Progress";
    if (status === "resolved" || status === "completed") return "Resolved";
    return status;
  }

  return (
    <div className="home-page">
      <section className="greeting-card">
        <div className="greeting-icon">
          <User size={42} />
        </div>

        <div className="greeting-text">
          <h1>
            {greeting}, {userName}.
          </h1>
          <p>Help keep your city safe and beautiful today.</p>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="stats-section">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.id} className="stat-card">
              <div className="stat-top">
                <p>{item.title}</p>

                <div className={`stat-icon ${item.id}`}>
                  <Icon size={20} />
                </div>
              </div>

              <h2 className={`stat-value ${item.id}`}>{item.value}</h2>
            </div>
          );
        })}
      </section>

      {/* Recent Reports List */}
      <section className="recent-section">
        <div className="recent-header">
          <h2>My Recent Reports</h2>

          <a href="reports" className="view-all">
            View All
          </a>
        </div>

        <div className="report-list">
          {recentReports.length > 0 ? (
            recentReports.map((report) => {
              const Icon = getReportIcon(report.description);
              const statusText = formatStatus(report.status);

              return (
                <div key={report.id} className="report-item">
                  <div className="report-left">
                    <div className="report-icon">
                      <Icon size={22} />
                    </div>

                    <div className="report-details">
                      <h3>{report.description.length > 40 ? report.description.slice(0, 40) + "..." : report.description}</h3>
                      <p>{formatReportDate(report.created_at)}</p>
                    </div>
                  </div>

                  <div className="report-right">
                    <span
                      className={
                        statusText === "Resolved"
                          ? "status-resolved"
                          : "status-progress"
                      }
                    >
                      {statusText === "Resolved" ? (
                        <>
                          <Check size={14} className="badge-icon" />
                          <span>Resolved</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw size={12} className="badge-icon" />
                          <span>In Progress</span>
                        </>
                      )}
                    </span>
                    <ChevronRight size={20} className="report-chevron" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-reports">
              No recent reports found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}