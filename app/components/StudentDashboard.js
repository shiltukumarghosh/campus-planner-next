"use client";

import { useState } from "react";
import { categories } from "../planner-options";
import SignOutButton from "./SignOutButton";
import TaskRow from "./TaskRow";
import UniversityBrand from "./UniversityBrand";

export default function StudentDashboard({ tasks }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const search = query.trim().toLowerCase();
  const visible = tasks.filter(task => (!category || task.category === category)
    && [task.title, task.subject, task.notes].some(value => value.toLowerCase().includes(search)));

  return (
    <div className="student-shell">
      <header className="student-masthead">
        <div className="student-masthead-inner">
          <UniversityBrand subtitle="Student workspace" />
          <SignOutButton />
        </div>
      </header>
      <main className="workspace student-workspace">
        <section className="hero student-hero mb-3">
          <div>
            <h1>Student dashboard</h1>
            <p>See tasks posted by your teacher, with due dates, priorities, and instructions.</p>
          </div>
        </section>
        <section className="surface task-panel">
          <div className="panel-heading"><div><h2>Assigned tasks</h2><p>{visible.length} of {tasks.length} tasks</p></div></div>
          <div className="task-controls student-controls">
            <input className="form-control" type="search" aria-label="Search assigned tasks" placeholder="Search tasks…" value={query} onChange={event => setQuery(event.target.value)} />
            <select className="form-select" aria-label="Filter by category" value={category} onChange={event => setCategory(event.target.value)}>
              <option value="">All categories</option>
              {categories.map(option => <option key={option}>{option}</option>)}
            </select>
          </div>
          {visible.length ? <ul className="list-unstyled task-list mb-0">
            {visible.map(task => <TaskRow key={task.id} task={task} readOnly />)}
          </ul> : <div className="empty-state"><p>{tasks.length ? "No tasks match your search." : "Your teacher hasn’t posted any tasks yet."}</p></div>}
        </section>
      </main>
    </div>
  );
}
