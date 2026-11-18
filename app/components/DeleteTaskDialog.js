export default function DeleteTaskDialog({ dialogRef, task, onConfirm, error }) {
  return (
    <dialog ref={dialogRef} className="planner-dialog" aria-labelledby="delete-title">
      <h2 id="delete-title">Delete task?</h2>
      <p className="my-3">Remove “{task?.title}” from your planner.</p>
      {error && <p className="alert alert-danger" role="alert">{error}</p>}
      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-soft" onClick={() => dialogRef.current.close()}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>Delete task</button>
      </div>
    </dialog>
  );
}
