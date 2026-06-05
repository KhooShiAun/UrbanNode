import {
  User,
  ClipboardList,
  Clock3,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Paintbrush,
  ChevronRight,
} from "lucide-react";
import "./Home.css";

export function Home() {
  const hour = new Date().getHours();

  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  const stats = [
    { title: "Total Reports Submitted", value: 42, icon: ClipboardList },
    { title: "Reports In Progress", value: 3, icon: Clock3 },
    { title: "Reports Resolved", value: 39, icon: CheckCircle },
  ];

  const reports = [
    { title: "Pothole on 5th Avenue", date: "Reported Oct 12, 2023", status: "In Progress", icon: AlertTriangle },
    { title: "Broken Streetlight", date: "Reported Oct 10, 2023", status: "Resolved", icon: Lightbulb },
    { title: "Graffiti on Wall", date: "Reported Oct 05, 2023", status: "Resolved", icon: Paintbrush },
  ];

  return (
    <div className="home-page">
      <div className="profile-container">
        <a href="/profile" className="profile-btn">
          <User size={22} />
        </a>
      </div>

      <section className="greeting-card">
        <div className="greeting-icon">
          <User size={42} />
        </div>

        <div className="greeting-text">
          <h1>{greeting}, User.</h1>
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
                <div className="stat-icon">
                  <Icon size={24} />
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