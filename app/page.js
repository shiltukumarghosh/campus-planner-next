"use client";

import { useEffect, useState } from "react";

const storageKey = "campus-planner-tasks";
const categories = ["Assignment", "Exam", "Project", "Other"];
const emptyForm = { title: "", category: "Assignment", date: "" };
const filters = ["All", "Open", "Completed"];

function formatDate(date) {
  return new Date(date + "T00:00:00").toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function Planner() {
  const [tasks, setTasks] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setTasks(Array.isArray(saved) ? saved : []);
    } catch {
      setTasks([]);
    }
  }, []);

  function save(nextTasks) {
    setTasks(nextTasks);
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextTasks));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
  }

  function submit(event) {
    event.preventDefault();
    const title = form.title.trim();
    if (!title || !tasks) return;
    const details = { ...form, title };

    if (editing) {
      save(tasks.map(task => task.id === editing ? { ...task, ...details } : task));
    } else {
      save([...tasks, { ...details, id: crypto.randomUUID(), done: false }]);
    }
    resetForm();
  }

  const total = tasks?.length ?? 0;
  const completed = tasks?.filter(task => task.done).length ?? 0;
  const visible = (tasks ?? [])
    .filter(task => filter === "All" || task.done === (filter === "Completed"))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <main className="shell">
      <header className="masthead"><span className="mark" aria-hidden="true">CP</span> Campus Planner</header>
      <section className="hero">
        <div>
          <h1>Make a plan for<br />college.</h1>
          <p>Keep assignments, exams, and projects in one place.</p>
        </div>
        <div className="progress">
          <strong>{completed} / {total}</strong>
          <span>Tasks completed</span>
          <progress aria-label="Tasks completed" max={total || 1} value={completed} />
        </div>
      </section>
      <div className="workspace">
        <section className="panel">
          <h2>{editing ? "Edit task" : "New task"}</h2>
          <form onSubmit={submit}>
            <label>Task name
              <input required maxLength={100} placeholder="e.g. Submit lab report" value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} />
            </label>
            <label>Category
              <select value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>
                {categories.map(category => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>Due date
              <input type="date" required value={form.date} onChange={event => setForm({ ...form, date: event.target.value })} />
            </label>
            <button className="primary" disabled={!tasks || !form.title.trim()}>{editing ? "Save changes" : "Add task"}</button>
            {editing && <button type="button" onClick={resetForm}>Cancel</button>}
          </form>
        </section>
        <section className="panel task-panel">
          <div className="task-header">
            <h2>My tasks</h2>
            <div className="filters" role="group" aria-label="Filter tasks">
              {filters.map(option => <button key={option} aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>)}
            </div>
          </div>
          {storageError && <p role="alert">Browser storage is unavailable. Changes may be lost when you reload.</p>}
          {!visible.length ? (
            <p className="empty">{!tasks ? "Loading tasks…" : total ? "No tasks in this view." : "Add a task to start planning your week."}</p>
          ) : (
            <ul className="task-list">
              {visible.map(task => (
                <li key={task.id}>
                  <input type="checkbox" checked={task.done} aria-label={`Mark ${task.title} as ${task.done ? "open" : "completed"}`} onChange={() => save(tasks.map(item => item.id === task.id ? { ...item, done: !item.done } : item))} />
                  <div className="task-details">
                    <strong className={task.done ? "done" : ""}>{task.title}</strong>
                    <span><span className="category">{task.category}</span> <time dateTime={task.date}>{formatDate(task.date)}</time></span>
                  </div>
                  <div className="actions">
                    <button aria-label={`Edit ${task.title}`} onClick={() => { setEditing(task.id); setForm({ title: task.title, category: task.category, date: task.date }); }}>Edit</button>
                    <button aria-label={`Delete ${task.title}`} onClick={() => { save(tasks.filter(item => item.id !== task.id)); if (editing === task.id) resetForm(); }}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <footer>Tasks are saved in this browser.</footer>
    </main>
  );
}
