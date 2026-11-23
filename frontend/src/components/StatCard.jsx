import { ArrowUpRight } from "lucide-react";

export default function StatCard({ label, value, detail, icon: Icon, tone }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={19} /></div>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
      <ArrowUpRight className="stat-arrow" size={17} />
    </article>
  );
}
