import { useEffect, useState } from "react";
import { X } from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Pending",
  dueDate: ""
};

export default function TaskModal({ open, onClose, onSave, task, saving }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      setForm(task ? {
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Medium",
        status: task.status || "Pending",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""
      } : emptyForm);
    }
  }, [open, task]);

  if (!open) return null;

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    onSave({ ...form, dueDate: form.dueDate || null });
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading">
          <div>
            <span className="eyebrow">{task ? "MAKE AN UPDATE" : "PLAN SOMETHING GREAT"}</span>
            <h2 id="modal-title">{task ? "Edit task" : "Create a task"}</h2>
            <p>Keep your next step clear and achievable.</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <form onSubmit={submit} className="task-form">
          <label>Task title<input name="title" value={form.title} onChange={change} placeholder="e.g. Finish DBMS assignment" maxLength="100" required autoFocus /></label>
          <label>Description <span className="optional">· optional</span><textarea name="description" value={form.description} onChange={change} placeholder="Add a few details..." rows="3" maxLength="500" /></label>
          <div className="form-grid">
            <label>Priority<select name="priority" value={form.priority} onChange={change}><option>Low</option><option>Medium</option><option>High</option></select></label>
            <label>Status<select name="status" value={form.status} onChange={change}><option>Pending</option><option>In Progress</option><option>Completed</option></select></label>
          </div>
          <label>Due date <span className="optional">· optional</span><input type="date" name="dueDate" value={form.dueDate} onChange={change} /></label>
          <div className="modal-actions">
            <button className="button button-quiet" type="button" onClick={onClose}>Cancel</button>
            <button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving..." : task ? "Save changes" : "Add task"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
