import React from "react";
import {
  LoaderCircle,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="header-action">{action}</div>}
    </div>
  );
}
export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  tone = "green",
  note,
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className={`stat-icon ${tone}`}>
          {Icon && <Icon size={18} />}
        </span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-foot">
        {change !== undefined && (
          <span className={Number(change) >= 0 ? "positive" : "negative"}>
            {Number(change) >= 0 ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}{" "}
            {change}%
          </span>
        )}
        <span>{note || "vs. previous period"}</span>
      </div>
    </div>
  );
}
export function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-head">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
export function Loading() {
  return (
    <div className="loading">
      <LoaderCircle className="spin" size={24} /> Loading your café data…
    </div>
  );
}
export function ErrorNotice({ message, onRetry }) {
  return (
    <div className="notice error">
      <AlertCircle size={18} />
      <span>{message}</span>
      {onRetry && (
        <button className="text-button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
export function Empty({
  title = "Nothing here yet",
  text = "Add your first item to get started.",
}) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <CheckCircle2 size={22} />
      </span>
      <b>{title}</b>
      <p>{text}</p>
    </div>
  );
}
export function SearchBox({ value, onChange, placeholder = "Search…" }) {
  return (
    <label className="search-box">
      <Search size={16} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
export function Pill({ children, tone = "neutral" }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}
export function Button({ children, variant = "primary", ...props }) {
  return (
    <button className={`button ${variant}`} {...props}>
      {children}
    </button>
  );
}
