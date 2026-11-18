import { formatDate } from "../planner-date";
import { categories } from "../planner-options";
import TaskRow from "./TaskRow";

export default function TaskPanel({ visible, total, today, selectedDate, loading,
  query, filter, category, sort, setQuery, setFilter, setCategory, setSort,
  onClearDate, onAdd, onToggle, onEdit, onDelete, loadSamples }) {
  return (
    <section className="surface task-panel">
      <div className="panel-heading">
        <div><h2>{selectedDate ? formatDate(selectedDate, { month: "long", day: "numeric" }) : "Task list"}</h2><p>{visible.length} of {total} tasks</p></div>
        {selectedDate && <button className="btn btn-soft" onClick={onClearDate}>Clear date</button>}
      </div>
      <div className="task-controls">
        <input className="form-control" type="search" placeholder="Search tasks…" aria-label="Search tasks" value={query} onChange={event => setQuery(event.target.value)} />
        <select className="form-select" aria-label="Filter by status" value={filter} onChange={event => setFilter(event.target.value)}>
          {["All", "Open", "Completed", "Overdue"].map(option => <option key={option} value={option}>{option === "All" ? "All statuses" : option}</option>)}
        </select>
        <select className="form-select" aria-label="Filter by category" value={category} onChange={event => setCategory(event.target.value)}>
          {["All categories", ...categories].map(option => <option key={option}>{option}</option>)}
        </select>
        <select className="form-select" aria-label="Sort tasks" value={sort} onChange={event => setSort(event.target.value)}>
          {["Soonest", "Latest", "Priority"].map(option => <option key={option}>{option}</option>)}
        </select>
      </div>
      {visible.length ? <ul className="list-unstyled task-list mb-0">
        {visible.map(task => (
          <TaskRow key={task.id} task={task} today={today} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
         ))}
      </ul> : <div className="empty-state">
        <span className="metric-icon violet mx-auto" aria-hidden="true">☷</span>
        <h3>{loading ? "Loading tasks…" : total ? "No matching tasks" : "Start your semester plan"}</h3>
        {!loading && (total ? <p>Change a filter or try another search.</p> : <>
          <p>Add your first deadline or explore with sample coursework.</p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <button className="btn btn-primary" onClick={onAdd}>Add a task</button>
            <button className="btn btn-soft" onClick={loadSamples}>Load sample tasks</button>
          </div>
        </>)}
      </div>}
    </section>
  );
}
