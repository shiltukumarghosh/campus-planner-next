import { formatDate } from "../planner-date";

export default function TaskRow({ task, today, onToggle, onEdit, onDelete, readOnly = false }) {
  return (
    <li className={readOnly ? "task-row task-row-readonly" : "task-row"}>
      {!readOnly && <input className="form-check-input" type="checkbox" checked={task.done}
        aria-label={(task.done ? "Reopen " : "Complete ") + task.title}
        onChange={() => onToggle(task)} />}
      <div className="task-details">
        <strong className={task.done ? "done" : ""}>{task.title}</strong>
        <div className="task-meta"><span className="pill">{task.category}</span>
          <span className={"priority " + task.priority.toLowerCase()}>{task.priority}</span>
          {task.subject && <span>{task.subject}</span>}
          {readOnly && task.done && <span className="pill">Closed</span>}
        </div>
        {task.notes && <p className="task-notes">{task.notes}</p>}
      </div>
      <time className={!task.done && task.date < today ? "overdue" : ""} dateTime={task.date}>{formatDate(task.date)}</time>
      {!readOnly && <div className="task-actions">
        <button className="btn btn-soft" aria-label={"Edit " + task.title} onClick={() => onEdit(task)}>Edit</button>
        <button className="btn btn-soft delete-button" aria-label={"Delete " + task.title} onClick={() => onDelete(task)}>Delete</button>
      </div>}
    </li>
  );
}
