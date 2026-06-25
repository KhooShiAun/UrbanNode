import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import {
  User,
  ClipboardList,
  ClipboardClock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  PaintbrushVertical,
  ChevronRight,
} from "lucide-react";
import "./Home.css";

export function Home() {
  const hour = new Date().getHours();

  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  const [userName, setUserName] = useState("User");

useEffect(() => {
apiGet<{ full_name?: string }>("/api/auth/me")
    .then((data) => {
      if (data.full_name) {
        setUserName(data.full_name);
      }
    })
    .catch(() => {
      setUserName("User");
    });
}, []);

  const stats = [
    { title: "Total Reports Submitted", value: 42, icon: ClipboardList },
    { title: "Reports In Progress", value: 3, icon: ClipboardClock },
    { title: "Reports Resolved", value: 39, icon: CheckCircle },
  ];

  const reports = [
    { title: "Pothole on 5th Avenue", date: "Reported Oct 12, 2023", status: "In Progress", icon: AlertTriangle },
    { title: "Broken Streetlight", date: "Reported Oct 10, 2023", status: "Resolved", icon: Lightbulb },
    { title: "Graffiti on Wall", date: "Reported Oct 05, 2023", status: "Resolved", icon: PaintbrushVertical },
  ];

  return (
    <div className="home-page">


      <section className="greeting-card">
        <div className="greeting-icon">
          <User size={42} />
        </div>

        <div className="greeting-text">
          <h1>{greeting}, {userName}.</h1>
          <p>Help keep your city safe and beautiful today.</p>
        </div>
      </section>

      <section className="stats-section">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div className="stat-card" key={item.title}>
              <div className="stat-top">
                <p>{item.title}</p>
<div className={`stat-icon ${item.title === "Total Reports Submitted" ? "submitted" :
  item.title === "Reports In Progress" ? "progress" : "resolved"}`}>
  <Icon size={20} />
</div>
              </div>
              <h2>{item.value}</h2>
            </div>
          );
        })}
      </section>

      <section className="recent-section">
        <div className="recent-header">
          <h2>My Recent Reports</h2>
          <a href="/reports" className="view-all">
            View All
          </a>
        </div>

        <div className="report-list">
          {reports.map((report) => {
            const Icon = report.icon;

            return (
              <div className="report-item" key={report.title}>
                <div className="report-left">
                  <div className="report-icon">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h3>{report.title}</h3>
                    <p>{report.date}</p>
                  </div>
                </div>

                <div className="report-right">
                  <span
                    className={
                      report.status === "Resolved"
                        ? "status-resolved"
                        : "status-progress"
                    }
                  >
                    {report.status}
                  </span>

                  <ChevronRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}