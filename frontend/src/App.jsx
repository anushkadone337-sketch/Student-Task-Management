import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownUp, BookOpen, CheckCheck, ChevronDown, CircleHelp,
  ClipboardList, Clock3, Command, GraduationCap, LayoutDashboard, ListTodo,
  Plus, Search, Sparkles, Target, TrendingUp
} from "lucide-react";
import StatCard from "./components/StatCard";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import { taskApi } from "./lib/api";

const filters = ["All tasks", "Pending", "In Progress", "Completed"];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All tasks");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadTasks = async () => {
    try {
      setError("");
      const result = await taskApi.getAll();
      setTasks(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const counts = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "Pending").length,
    progress: tasks.filter((task) => task.status === "In Progress").length,
    completed: tasks.filter((task) => task.status === "Completed").length
  }), [tasks]);

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesFilter = filter === "All tasks" || task.status === filter;
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || `${task.title} ${task.description}`.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  }), [tasks, filter, search]);

  const completion = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const saveTask = async (form) => {
    setSaving(true);
    try {
      if (editingTask) {
        const result = await taskApi.update(editingTask._id, form);
        setTasks((current) => current.map((task) => task._id === editingTask._id ? result.data : task));
        showNotice("Your task has been updated.");
      } else {
        const result = await taskApi.create(form);
        setTasks((current) => [result.data, ...current]);
        showNotice("New task added. Nice work!");
      }
      setModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      const result = await taskApi.update(id, { status });
      setTasks((current) => current.map((task) => task._id === id ? result.data : task));
      showNotice(status === "Completed" ? "Task completed. Great job!" : `Task moved to ${status}.`);
    } catch (err) { setError(err.message); }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task? This action cannot be undone.")) return;
    try {
      await taskApi.remove(id);
      setTasks((current) => current.filter((task) => task._id !== id));
      showNotice("Task deleted.");
    } catch (err) { setError(err.message); }
  };

  const openCreate = () => { setEditingTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditingTask(task); setModalOpen(true); };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="FocusFlow home">
          <span className="brand-mark"><Command size={21} /></span>
          <span>focus<span className="brand-light">flow</span><small>STUDENT WORKSPACE</small></span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          <a className="nav-link active" href="#dashboard"><LayoutDashboard size={18} />Dashboard</a>
          <a className="nav-link" href="#tasks"><ListTodo size={18} />My tasks<span className="nav-count">{counts.total}</span></a>
        </nav>
        <div className="sidebar-bottom">
          <div className="focus-card">
            <div className="focus-orb"><Target size={18} /></div>
            <strong>Small steps.</strong>
            <strong>Big progress.</strong>
            <p>Stay focused on what matters today.</p>
            <div className="focus-line"><span /></div>
            <small>{completion}% tasks completed</small>
          </div>
          <div className="profile">
            <div className="avatar">S</div>
            <div><strong>Student</strong><small>Personal workspace</small></div>
            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><b>/</b> Dashboard</div>
          <div className="topbar-right"><span className="today-pill"><span /> Your productivity space</span><div className="avatar mini">S</div></div>
        </header>

        <section className="welcome-row">
          <div>
            <div className="eyebrow"><Sparkles size={14} /> YOUR PERSONAL STUDY SPACE</div>
            <h1>Make today <span>count.</span></h1>
            <p>A little progress each day adds up to big results.</p>
          </div>
          <button className="button button-primary add-main" onClick={openCreate}><Plus size={18} /> Add new task</button>
        </section>

        {error && <div className="alert-error"><CircleHelp size={17} /><span>{error}</span><button onClick={() => setError("")}>Dismiss</button></div>}

        <section className="stats-grid" aria-label="Task summary">
          <StatCard label="Total tasks" value={counts.total} detail="Everything on your list" icon={ClipboardList} tone="violet" />
          <StatCard label="To do" value={counts.pending} detail="Ready when you are" icon={Clock3} tone="amber" />
          <StatCard label="In progress" value={counts.progress} detail="Keep the momentum" icon={Activity} tone="blue" />
          <StatCard label="Completed" value={counts.completed} detail="Look how far you've come" icon={CheckCheck} tone="green" />
        </section>

        <section className="content-grid">
          <div className="tasks-panel" id="tasks">
            <div className="panel-heading">
              <div><span className="eyebrow">YOUR WORKLOAD</span><h2>Tasks <span className="muted-count">{counts.total}</span></h2></div>
              <button className="button button-outline" onClick={openCreate}><Plus size={16} /> New task</button>
            </div>
            <div className="toolbar">
              <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
                {filters.map((item) => <button key={item} className={filter === item ? "filter-tab selected" : "filter-tab"} onClick={() => setFilter(item)}>{item}</button>)}
              </div>
              <label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." /></label>
            </div>

            {loading ? <div className="empty-state"><div className="empty-icon"><BookOpen size={24} /></div><h3>Loading your workspace...</h3><p>Getting your tasks ready.</p></div> :
              visibleTasks.length ? <div className="task-list">{visibleTasks.map((task) => <TaskCard key={task._id} task={task} onStatus={changeStatus} onEdit={openEdit} onDelete={deleteTask} />)}</div> :
              <div className="empty-state"><div className="empty-icon"><BookOpen size={24} /></div><h3>{search || filter !== "All tasks" ? "No matching tasks" : "Your space is clear"}</h3><p>{search || filter !== "All tasks" ? "Try another search or filter." : "Add your first task and start building momentum."}</p>{!search && filter === "All tasks" && <button className="button button-primary" onClick={openCreate}><Plus size={17} /> Create your first task</button>}</div>}
          </div>

          <aside className="right-column">
            <section className="progress-panel">
              <div className="panel-heading compact"><div><span className="eyebrow">YOUR MOMENTUM</span><h2>Progress</h2></div><TrendingUp size={19} /></div>
              <div className="progress-ring-wrap">
                <div className="progress-ring" style={{ "--progress": `${completion}%` }}><div><strong>{completion}%</strong><small>completed</small></div></div>
              </div>
              <p className="progress-caption">{counts.completed === counts.total && counts.total > 0 ? "Everything is complete. Amazing!" : "Every completed task is a step forward."}</p>
              <div className="progress-breakdown">
                <div><span><i className="dot dot-pending" />Pending</span><strong>{counts.pending}</strong></div>
                <div><span><i className="dot dot-progress" />In progress</span><strong>{counts.progress}</strong></div>
                <div><span><i className="dot dot-completed" />Completed</span><strong>{counts.completed}</strong></div>
              </div>
            </section>
            <section className="tip-panel">
              <div className="tip-icon"><Sparkles size={17} /></div>
              <span className="eyebrow">A GENTLE REMINDER</span>
              <h3>Focus on one thing at a time.</h3>
              <p>You don't have to do it all at once. Just take the next small step.</p>
            </section>
          </aside>
        </section>
        <footer className="footer"><span>FOCUSFLOW <b>·</b> STUDENT TASK MANAGER</span><span>Built for focused minds <GraduationCap size={14} /></span></footer>
      </main>

      {notice && <div className="toast"><CheckCheck size={17} />{notice}</div>}
      <TaskModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingTask(null); }} onSave={saveTask} task={editingTask} saving={saving} />
    </div>
  );
}
