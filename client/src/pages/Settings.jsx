import React, { useEffect, useState } from "react";
import {
  Save,
  Store,
  ReceiptText,
  Bell,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { api, getError } from "../shared/utils/api.js";
import {
  PageHeader,
  Panel,
  Loading,
  ErrorNotice,
  Button,
} from "../shared/components/Primitives.jsx";
export default function Settings() {
  const [form, setForm] = useState(null),
    [original, setOriginal] = useState(null),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [saved, setSaved] = useState(false);
  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await api.get("/settings");
      setForm(r.data);
      setOriginal(r.data);
    } catch (e) {
      setError(getError(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  function change(k, v) {
    setSaved(false);
    setForm((f) => ({ ...f, [k]: v }));
  }
  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const payload = {
        ...form,
        taxRate: Number(form.taxRate),
        serviceCharge: Number(form.serviceCharge),
        lowStockThreshold: Number(form.lowStockThreshold),
      };
      const r = await api.put("/settings", payload);
      setForm(r.data);
      setOriginal(r.data);
      try {
        localStorage.setItem("cafeos-currency", r.data.currency || "INR");
      } catch {}
      setSaved(true);
    } catch (e) {
      setError(getError(e));
    } finally {
      setSaving(false);
    }
  }
  if (loading) return <Loading />;
  if (!form)
    return (
      <>
        <PageHeader
          eyebrow="MAKE IT YOURS"
          title="Settings"
          description="Personalise your café and how bills are calculated."
        />
        {error && <ErrorNotice message={error} onRetry={load} />}
      </>
    );
  const dirty =
    original &&
    Object.keys(form).some(
      (k) => String(form[k] ?? "") !== String(original[k] ?? ""),
    );
  return (
    <>
      <PageHeader
        eyebrow="MAKE IT YOURS"
        title="Settings"
        description="Personalise your café and how bills are calculated."
        action={
          <Button onClick={save} disabled={saving || !dirty}>
            <Save size={16} />
            {saving ? "Saving…" : "Save changes"}
          </Button>
        }
      />
      {error && <ErrorNotice message={error} onRetry={load} />}
      {saved && (
        <div className="notice success">
          <CheckCircle2 size={18} /> Settings saved successfully. Billing and
          inventory will use these values.
        </div>
      )}
      <form onSubmit={save} className="settings-layout">
        <div className="settings-main">
          <Panel
            title="Café profile"
            subtitle="The details your team and customers see"
          >
            <div className="settings-section-icon">
              <Store size={18} />
            </div>
            <div className="form-grid">
              <label className="field-label span-2">
                Café name
                <input
                  required
                  value={form.cafeName || ""}
                  onChange={(e) => change("cafeName", e.target.value)}
                  placeholder="Your café name"
                />
              </label>
              <label className="field-label span-2">
                Address
                <input
                  value={form.address || ""}
                  onChange={(e) => change("address", e.target.value)}
                  placeholder="Street, city"
                />
              </label>
              <label className="field-label">
                Contact phone
                <input
                  value={form.phone || ""}
                  onChange={(e) => change("phone", e.target.value)}
                  placeholder="+91 …"
                />
              </label>
              <label className="field-label">
                Contact email
                <input
                  type="email"
                  value={form.email || ""}
                  onChange={(e) => change("email", e.target.value)}
                  placeholder="hello@yourcafe.in"
                />
              </label>
            </div>
          </Panel>
          <Panel
            title="Billing & tax"
            subtitle="Control the totals generated at checkout"
          >
            <div className="settings-section-icon">
              <ReceiptText size={18} />
            </div>
            <div className="form-grid">
              <label className="field-label">
                Currency
                <select
                  value={form.currency || "INR"}
                  onChange={(e) => change("currency", e.target.value)}
                >
                  <option value="INR">INR — Indian Rupee (₹)</option>
                  <option value="USD">USD — US Dollar ($)</option>
                  <option value="GBP">GBP — British Pound (£)</option>
                  <option value="EUR">EUR — Euro (€)</option>
                </select>
              </label>
              <label className="field-label">
                Tax rate (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={form.taxRate ?? 5}
                  onChange={(e) => change("taxRate", e.target.value)}
                />
                <small>Applied to subtotal after discounts.</small>
              </label>
              <label className="field-label">
                Service charge (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={form.serviceCharge ?? 0}
                  onChange={(e) => change("serviceCharge", e.target.value)}
                />
                <small>Stored for future bill breakdown support.</small>
              </label>
              <label className="field-label">
                Default low-stock threshold
                <input
                  type="number"
                  min="0"
                  value={form.lowStockThreshold ?? 8}
                  onChange={(e) => change("lowStockThreshold", e.target.value)}
                />
                <small>Used as a default when adding menu items.</small>
              </label>
              <label className="field-label span-2">
                Receipt footer
                <textarea
                  rows="2"
                  value={form.receiptFooter || ""}
                  onChange={(e) => change("receiptFooter", e.target.value)}
                  placeholder="Thanks for stopping by!"
                />
              </label>
            </div>
            <div className="receipt-preview">
              <div className="receipt-preview-head">
                <Store size={17} />
                <b>{form.cafeName || "Your Café"}</b>
              </div>
              <p>{form.address || "Café address"}</p>
              <div className="receipt-dashes" />
              <div className="receipt-preview-line">
                <span>Sample order</span>
                <span>₹100.00</span>
              </div>
              <div className="receipt-preview-line">
                <span>Service charge ({form.serviceCharge || 0}%)</span>
                <span>
                  ₹{((100 * Number(form.serviceCharge || 0)) / 100).toFixed(2)}
                </span>
              </div>
              <div className="receipt-preview-line">
                <span>Tax ({form.taxRate || 0}%)</span>
                <span>
                  ₹
                  {(
                    ((100 + (100 * Number(form.serviceCharge || 0)) / 100) *
                      Number(form.taxRate || 0)) /
                    100
                  ).toFixed(2)}
                </span>
              </div>
              <div className="receipt-preview-line total">
                <b>Total</b>
                <b>
                  ₹
                  {(
                    100 +
                    (100 * Number(form.serviceCharge || 0)) / 100 +
                    ((100 + (100 * Number(form.serviceCharge || 0)) / 100) *
                      Number(form.taxRate || 0)) /
                      100
                  ).toFixed(2)}
                </b>
              </div>
              <div className="receipt-dashes" />
              <p>{form.receiptFooter || "Thank you!"}</p>
            </div>
          </Panel>
          <Panel
            title="Opening hours"
            subtitle="Set the usual opening and closing times"
          >
            <div className="form-grid">
              <label className="field-label">
                Opens at
                <input
                  type="time"
                  value={form.openTime || "08:00"}
                  onChange={(e) => change("openTime", e.target.value)}
                />
              </label>
              <label className="field-label">
                Closes at
                <input
                  type="time"
                  value={form.closeTime || "22:00"}
                  onChange={(e) => change("closeTime", e.target.value)}
                />
              </label>
            </div>
          </Panel>
        </div>
        <div className="settings-aside">
          <Panel title="Preferences" subtitle="Workspace defaults">
            <div className="preference-row">
              <span className="preference-icon">
                <Bell size={17} />
              </span>
              <div>
                <b>Low-stock monitoring</b>
                <p>
                  Alerts appear on the store manager dashboard whenever a
                  product is at or below its own threshold.
                </p>
              </div>
            </div>
            <div className="preference-row">
              <span className="preference-icon">
                <ShieldCheck size={17} />
              </span>
              <div>
                <b>Checkout validation</b>
                <p>
                  Orders are checked against available inventory before being
                  saved.
                </p>
              </div>
            </div>
          </Panel>
          <Panel title="Unsaved changes">
            <div className="save-status">
              <span className={`save-dot ${dirty ? "dirty" : ""}`} />
              <div>
                <b>{dirty ? "You have unsaved edits" : "All changes saved"}</b>
                <p>
                  {dirty
                    ? "Save your changes to apply them to the workspace."
                    : "Your café settings are up to date."}
                </p>
              </div>
            </div>
            <Button block disabled={!dirty || saving} onClick={save}>
              <Save size={16} /> Save settings
            </Button>
            <button
              type="button"
              className="reset-button"
              disabled={!dirty}
              onClick={() => {
                setForm(original);
                setSaved(false);
                setError("");
              }}
            >
              <RotateCcw size={14} /> Discard changes
            </button>
          </Panel>
          <div className="settings-tip">
            <span>✦</span>
            <b>A little heads-up</b>
            <p>
              Tax settings affect new bills only. Previously completed orders
              keep their original totals.
            </p>
          </div>
        </div>
      </form>
    </>
  );
}
