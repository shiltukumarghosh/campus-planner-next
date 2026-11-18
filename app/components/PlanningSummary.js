import { formatDate } from "../planner-date";

export default function PlanningSummary({ progress, complete, total, upcoming, onEdit }) {
  return (
    <aside className="col-12 col-xl-4 d-grid gap-3" aria-label="Planning summary">
      <section className="surface summary">
        <h2>Semester progress</h2>
        <div className="progress-number">{progress}<span>%</span></div>
        <div className="progress" role="progressbar" aria-label="Task completion" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-bar" style={{ width: progress + "%" }} />
        </div>
        <p>{complete} of {total} tasks completed</p>
      </section>
      <section className="surface summary">
        <h2>Upcoming deadlines</h2>
        {upcoming.length ? <ul className="list-unstyled upcoming-list mb-0">{upcoming.map(task => (
          <li key={task.id}><time dateTime={task.date}>{formatDate(task.date)}</time><button className="deadline-link" onClick={() => onEdit(task)}>{task.title}</button></li>
        ))}</ul> : <p className="mt-3">You have no upcoming deadlines.</p>}
      </section>
    </aside>
  );
}
