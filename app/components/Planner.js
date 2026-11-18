"use client";

import { useEffect, useRef, useState } from "react";
import { changeTasks } from "../actions";
import { dateKey } from "../planner-date";
import { emptyForm, priorities } from "../planner-options";
import Calendar from "./Calendar";
import DeleteTaskDialog from "./DeleteTaskDialog";
import OverviewBanner from "./OverviewBanner";
import PlannerHeader from "./PlannerHeader";
import PlannerSidebar from "./PlannerSidebar";
import PlanningSummary from "./PlanningSummary";
import TaskFormDialog from "./TaskFormDialog";
import TaskPanel from "./TaskPanel";

const storageKey = "campus-planner-tasks";

function offsetDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return dateKey(date);
}

const sampleTasks = [
  ["Build the project prototype", "Project", "Software Engineering", "High", 2, false],
  ["Revise database normalization", "Exam", "Database Systems", "High", 4, false],
  ["Submit usability findings", "Assignment", "Human–Computer Interaction", "Medium", 6, false],
  ["Review lab feedback", "Assignment", "Computer Networks", "Medium", -1, false],
  ["Outline presentation slides", "Project", "Software Engineering", "Low", 8, false],
  ["Finalize the project proposal", "Project", "Software Engineering", "Medium", -3, true],
];

export default function Planner({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [today, setToday] = useState("");
  const [view, setView] = useState("Overview");
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState("All");
  const [category, setCategory] = useState("All categories");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Soonest");
  const [selectedDate, setSelectedDate] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [legacyTasks, setLegacyTasks] = useState([]);
  const saving = useRef(false);
  const [status, setStatus] = useState("");
  const dialog = useRef(null);
  const deletionDialog = useRef(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    function refreshDate() { setToday(dateKey()); }
    refreshDate();
    const timer = window.setInterval(refreshDate, 60000);
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(saved)) setLegacyTasks(saved);
    } catch {
      // Old browser data is optional.
    }
    return () => window.clearInterval(timer);
  }, []);

  async function save(operation, input, message) {
    if (saving.current) return false;
    saving.current = true;
    setError("");
    try {
      const result = await changeTasks(operation, input);
      if (result.tasks) setTasks(result.tasks);
      if (result.error) {
        setError(result.error);
        return false;
      }
      setStatus(message);
      return true;
    } catch {
      setError("The task change could not be saved. Try again.");
      return false;
    } finally {
      saving.current = false;
    }
  }

  function openForm(task) {
    setError("");
    setEditing(task?.id ?? null);
    setForm(task ? { ...emptyForm, ...task } : { ...emptyForm, date: selectedDate || today });
    dialog.current.showModal();
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) return;
    const isEditing = editing !== null;
    if (await save(isEditing ? "edit" : "create", { ...form, id: editing }, isEditing ? "Task updated." : "Task posted.")) {
      dialog.current.close();
    }
  }

  function setField(field, value) {
    setForm(current => ({ ...current, [field]: value }));
  }

  function selectView(nextView) {
    setView(nextView);
    setSelectedDate("");
    setFilter("All");
    setCategory("All categories");
    setQuery("");
  }

  function loadSamples() {
    const entries = sampleTasks.map(([title, category, subject, priority, offset, done]) => ({
      title, category, subject, priority, date: offsetDate(offset), done, notes: "",
    }));
    save("samples", entries, "Sample tasks posted.");
  }

  function importTasks() {
    save("import", legacyTasks.map(task => ({ ...emptyForm, ...task })), "Browser tasks published.");
  }

  const records = tasks;
  const total = records.length;
  const complete = records.filter(task => task.done).length;
  const overdue = records.filter(task => !task.done && task.date < today).length;
  const progress = total ? Math.round(complete / total * 100) : 0;
  const upcoming = records.filter(task => !task.done && task.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const visible = records.filter(task => {
    const matchesStatus = filter === "All" || (filter === "Overdue"
      ? !task.done && task.date < today : task.done === (filter === "Completed"));
    return matchesStatus && (category === "All categories" || task.category === category)
      && (!selectedDate || task.date === selectedDate)
      && [task.title, task.subject, task.notes].some(value => value.toLowerCase().includes(query.trim().toLowerCase()));
  }).sort((a, b) => {
    if (sort === "Priority") {
      const rank = priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
      if (rank) return rank;
    }
    return sort === "Latest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
  });

  function selectStatus(statusFilter) {
    selectView("Tasks");
    setFilter(statusFilter);
  }

  function toggleTask(task) {
    save("complete", { id: task.id, done: !task.done }, task.done ? "Task reopened." : "Task completed.");
  }

  function requestDelete(task) {
    setError("");
    setPendingDelete(task);
    deletionDialog.current.showModal();
  }

  async function confirmDelete() {
    if (await save("delete", { id: pendingDelete.id }, "Task deleted.")) {
      deletionDialog.current.close();
    }
  }

  return (
    <div className="planner">
      <PlannerSidebar view={view} onSelectView={selectView} />

      <main className="workspace">
        <PlannerHeader view={view} onAdd={() => openForm()} />
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <div className="visually-hidden" role="status">{status}</div>
        {records.length === 0 && legacyTasks.length > 0 && (
          <section className="alert alert-info">
            <p className="mb-2">Tasks from the previous planner are saved in this browser. Publishing them makes them visible to students.</p>
            <button className="btn btn-soft" onClick={importTasks}>Publish browser tasks</button>
          </section>
        )}

        {view === "Overview" && (
          <OverviewBanner today={today} total={total} complete={complete} overdue={overdue}
            onOpenCalendar={() => selectView("Calendar")} onSelectStatus={selectStatus} />
        )}

        {view === "Calendar" && today && (
          <Calendar tasks={records} today={today} onSelect={date => {
            selectView("Tasks");
            setSelectedDate(date);
          }} />
        )}

        {view !== "Calendar" && (
          <div className="row g-3 align-items-start">
            <div className={view === "Overview" ? "col-12 col-xl-8" : "col-12"}>
              <TaskPanel visible={visible} total={total} today={today} selectedDate={selectedDate}
                query={query} filter={filter} category={category} sort={sort}
                setQuery={setQuery} setFilter={setFilter} setCategory={setCategory} setSort={setSort}
                onClearDate={() => setSelectedDate("")} onAdd={() => openForm()} onToggle={toggleTask}
                onEdit={openForm} onDelete={requestDelete} loadSamples={loadSamples} />
            </div>
            {view === "Overview" && <PlanningSummary progress={progress} complete={complete} total={total}
              upcoming={upcoming} onEdit={openForm} />}
          </div>
        )}
      </main>

      <TaskFormDialog dialogRef={dialog} form={form} isEditing={editing !== null} onSubmit={submit} setField={setField} error={error} />
      <DeleteTaskDialog dialogRef={deletionDialog} task={pendingDelete} onConfirm={confirmDelete} error={error} />
    </div>
  );
}
