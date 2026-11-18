import { useState } from "react";
import { dateKey } from "../planner-date";

export default function Calendar({ tasks, today, onSelect }) {
  const [month, setMonth] = useState(() => {
    const date = new Date(today + "T00:00:00");
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const leadingDays = (month.getDay() + 6) % 7;
  const monthDays = new Date(year, monthIndex + 1, 0).getDate();
  const tasksByDate = new Map();
  for (const task of tasks) {
    if (!tasksByDate.has(task.date)) tasksByDate.set(task.date, []);
    tasksByDate.get(task.date).push(task);
  }
  const monthLabel = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <section className="surface calendar-panel" aria-label="Deadline calendar">
      <div className="panel-heading">
        <h2 aria-live="polite">{monthLabel}</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-soft" aria-label="Previous month" onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}>‹</button>
          <button className="btn btn-soft" aria-label="Next month" onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}>›</button>
        </div>
      </div>
      <div className="calendar-grid">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => <div className="weekday" key={day}>{day}</div>)}
        {Array.from({ length: leadingDays }, (_, index) => <div className="calendar-blank" key={index} />)}
        {Array.from({ length: monthDays }, (_, index) => {
          const day = index + 1;
          const key = dateKey(new Date(year, monthIndex, day));
          const entries = tasksByDate.get(key) ?? [];
          return (
            <button key={key} className={key === today ? "calendar-day calendar-today" : "calendar-day"}
              aria-label={monthLabel + ", day " + day + ", " + entries.length + " tasks"}
              onClick={() => onSelect(key)}>
              <span className="day-number">{day}</span>
              {entries.length > 0 && <><span className="calendar-count">{entries.length}</span><span className="calendar-entry">{entries[0].title}</span></>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
