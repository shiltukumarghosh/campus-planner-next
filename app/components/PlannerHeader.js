import SignOutButton from "./SignOutButton";

export default function PlannerHeader({ view, onAdd }) {
  return (
    <header className="topbar">
      <div><span className="kicker">TEACHER WORKSPACE</span><h1>{view === "Tasks" ? "Manage tasks" : view === "Overview" ? "Teacher dashboard" : view}</h1></div>
      <div className="d-flex flex-wrap gap-2 justify-content-end">
        <button className="btn btn-primary add-button" onClick={onAdd}><span aria-hidden="true">＋</span> New task</button>
        <SignOutButton />
      </div>
    </header>
  );
}
