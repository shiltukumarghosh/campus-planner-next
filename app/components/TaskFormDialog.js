import { categories, priorities } from "../planner-options";

export default function TaskFormDialog({ dialogRef, form, isEditing, onSubmit, setField, error }) {
  return (
    <dialog ref={dialogRef} className="planner-dialog" aria-labelledby="task-form-title">
      <form onSubmit={onSubmit} className="row g-3">
        <div className="col-12 d-flex align-items-center justify-content-between">
          <h2 id="task-form-title">{isEditing ? "Edit task" : "New task"}</h2>
          <button type="button" className="btn-close" aria-label="Close" onClick={() => dialogRef.current.close()} />
        </div>
        {error && <div className="col-12"><p className="alert alert-danger" role="alert">{error}</p></div>}
        <label className="col-12">Task name<input autoFocus className="form-control" required maxLength={100} value={form.title} onChange={event => setField("title", event.target.value)} /></label>
        <label className="col-12 col-sm-6">Category<select className="form-select" value={form.category} onChange={event => setField("category", event.target.value)}>
          {categories.map(option => <option key={option}>{option}</option>)}
        </select></label>
        <label className="col-12 col-sm-6">Due date<input type="date" className="form-control" required value={form.date} onChange={event => setField("date", event.target.value)} /></label>
        <label className="col-12 col-sm-6">Subject<input className="form-control" maxLength={80} value={form.subject} onChange={event => setField("subject", event.target.value)} /></label>
        <label className="col-12 col-sm-6">Priority<select className="form-select" value={form.priority} onChange={event => setField("priority", event.target.value)}>
          {priorities.map(option => <option key={option}>{option}</option>)}
        </select></label>
        <label className="col-12">Notes<textarea rows={3} className="form-control" maxLength={500} value={form.notes} onChange={event => setField("notes", event.target.value)} /></label>
        <div className="col-12 d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-soft" onClick={() => dialogRef.current.close()}>Cancel</button>
          <button className="btn btn-primary" disabled={!form.title.trim()}>{isEditing ? "Save changes" : "Add task"}</button>
        </div>
      </form>
    </dialog>
  );
}
