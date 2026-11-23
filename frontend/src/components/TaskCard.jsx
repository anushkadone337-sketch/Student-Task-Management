import { CalendarDays, Check, Circle, Clock3, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

function formatDate(date) {
  if (!date) return "No due date";
  return new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export default function TaskCard({ task, onStatus, onEdit, onDelete }) {
  const done = task.status === "Completed";
  const nextStatus = task.status === "Pending" ? "In Progress" : task.status === "In Progress" ? "Completed" : "Pending";

  return (
    <article className={`task-card ${done ? "is-complete" : ""}`}>
      <button
        className={`complete-toggle ${done ? "checked" : ""}`}
        onClick={() => onStatus(task._id, done ? "Pending" : "Completed")}
        title={done ? "Mark as pending" : "Mark as completed"}
        aria-label={done ? "Mark as pending" : "Mark as completed"}
      >
        {done ? <Check size={15} /> : <Circle size={19} />}
      </button>
      <div className="task-main">
        <div className="task-title-row">
          <h3>{task.title}</h3>
          <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
        </div>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta">
          <span><CalendarDays size={14} />{formatDate(task.dueDate)}</span>
          <span className={`status status-${task.status.toLowerCase().replace(" ", "-")}`}>
            <i />{task.status}
          </span>
        </div>
      </div>
      <div className="task-actions">
        <button className="icon-button small" title={`Move to ${nextStatus}`} onClick={() => onStatus(task._id, nextStatus)}><Clock3 size={16} /></button>
        <button className="icon-button small" title="Edit task" onClick={() => onEdit(task)}><Pencil size={16} /></button>
        <button className="icon-button small danger-hover" title="Delete task" onClick={() => onDelete(task._id)}><Trash2 size={16} /></button>
      </div>
    </article>
  );
}
