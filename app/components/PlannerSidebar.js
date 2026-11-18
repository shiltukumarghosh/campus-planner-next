import UniversityBrand from "./UniversityBrand";

const views = [["◫", "Overview"], ["☷", "Tasks"], ["▦", "Calendar"]];

export default function PlannerSidebar({ view, onSelectView }) {
  return (
    <aside className="sidebar">
      <UniversityBrand subtitle="Teacher workspace" />
      <nav className="nav flex-md-column" aria-label="Planner views">
        {views.map(([icon, label]) => (
          <button type="button" className={"nav-link" + (view === label ? " active" : "")}
            aria-current={view === label ? "page" : undefined} key={label} onClick={() => onSelectView(label)}>
            <span aria-hidden="true">{icon}</span>{label}
          </button>
        ))}
      </nav>
      <div className="sidebar-foot"><span aria-hidden="true">●</span> Shared class planner</div>
    </aside>
  );
}
