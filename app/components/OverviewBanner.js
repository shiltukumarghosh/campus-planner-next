import { formatDate } from "../planner-date";

export default function OverviewBanner({ today, total, complete, overdue, onOpenCalendar, onSelectStatus }) {
  return (
    <>
      <section className="hero">
        <div>
          <div className="hero-date">{today ? formatDate(today, { weekday: "long", month: "long", day: "numeric" }) : "Your academic dashboard"}</div>
          <h2>Manage class coursework</h2>
          <p>Publish assignments, exams, and projects for your students.</p>
          <button className="btn btn-light" onClick={onOpenCalendar}>View calendar <span aria-hidden="true">↗</span></button>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="art-sheet"><i /><i /><i /><b>✓</b></div></div>
      </section>
      <section className="row g-3 metrics" aria-label="Task statistics">
        {[["▤", "Total tasks", total, "violet", "All"], ["◷", "Open tasks", total - complete, "blue", "Open"], ["✓", "Completed", complete, "green", "Completed"], ["!", "Overdue", overdue, "amber", "Overdue"]].map(([icon, label, value, color, filter]) => (
          <div key={label} className="col-6 col-xl-3">
            <button className="surface metric" onClick={() => onSelectStatus(filter)}>
              <span className={"metric-icon " + color} aria-hidden="true">{icon}</span>
              <span><strong>{value}</strong><small>{label}</small></span>
            </button>
          </div>
        ))}
      </section>
    </>
  );
}
