"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const INITIAL_FORM: SignalFormState = {
  title: "",
  symbol: "",
  type: "",
  entry: "",
  sl: "",
  tp1: "",
  tp2: "",
  risk: "",
  audience: "",
  sendNow: false,
};

type Audience = "basic" | "pro" | "vip";
type TradeType = "LONG" | "SHORT";
type RiskLevel = "low" | "med" | "high";

type SignalRow = {
  id: string;
  title: string | null;
  symbol: string | null;
  type: string | null;
  entry: string | null;
  sl: string | null;
  tp1: string | null;
  tp2: string | null;
  risk: string | null;
  audience: Audience | null;
  status: string | null;
  scheduled_at: string | null;
  created_at?: string | null;
};

type SignalFormState = {
  title: string;
  symbol: string;
  type: TradeType | "";
  entry: string;
  sl: string;
  tp1: string;
  tp2: string;
  risk: RiskLevel | "";
  audience: Audience | "";
  sendNow: boolean;
};

const ZAPIER_SECRET = process.env.NEXT_PUBLIC_ZAPIER_SECRET;

export function AdminPanel() {
  const supabase = useMemo(() => createClientComponentClient(), []);
  const [signals, setSignals] = useState<SignalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SignalFormState>(INITIAL_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSignals = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("signals")
      .select("id,title,symbol,type,entry,sl,tp1,tp2,risk,audience,status,scheduled_at,created_at")
      .order("scheduled_at", { ascending: false })
      .limit(20);

    if (error) {
      setError(error.message);
      setSignals([]);
    } else {
      setSignals(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadSignals();
  }, [loadSignals]);

  const handleChange = (evt: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = evt.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (signal: SignalRow) => {
    setForm({
      title: signal.title ?? "",
      symbol: signal.symbol ?? "",
      type: (signal.type as TradeType) ?? "",
      entry: signal.entry ?? "",
      sl: signal.sl ?? "",
      tp1: signal.tp1 ?? "",
      tp2: signal.tp2 ?? "",
      risk: (signal.risk as RiskLevel) ?? "",
      audience: ((signal.audience as Audience | null) ?? "") as Audience | "",
      sendNow: false,
    });
    setEditingId(signal.id);
    setShowModal(true);
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.symbol.trim()) return "Symbol is required";
    if (!form.type) return "Type is required";
    if (!form.entry.trim()) return "Entry is required";
    if (!form.sl.trim()) return "Stop loss is required";
    if (!form.tp1.trim()) return "Take profit 1 is required";
    if (!form.risk) return "Risk level is required";
    if (!form.audience) return "Audience is required";
    return null;
  };

  const persistSignal = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    const audience = form.audience as Audience;

    const payload = {
      title: form.title.trim(),
      symbol: form.symbol.trim(),
      type: form.type,
      entry: form.entry.trim(),
      sl: form.sl.trim(),
      tp1: form.tp1.trim(),
      tp2: form.tp2?.trim() || null,
      risk: form.risk,
      audience,
    };

    const scheduledAt = new Date().toISOString();

    let supabaseError: string | null = null;

    if (editingId) {
      const { error } = await supabase
        .from("signals")
        .update({ ...payload, scheduled_at: scheduledAt })
        .eq("id", editingId);
      supabaseError = error?.message ?? null;
    } else {
      const { error } = await supabase
        .from("signals")
        .insert([{ ...payload, scheduled_at: scheduledAt, status: "queued" }]);
      supabaseError = error?.message ?? null;
    }

    if (supabaseError) {
      setError(supabaseError);
      setSaving(false);
      return;
    }

    if (form.sendNow) {
      await triggerImmediateSend(audience, form.symbol);
    }

    setShowModal(false);
    resetForm();
    await loadSignals();
    setSaving(false);
  };

  const deleteSignal = async (id: string) => {
    if (!confirm("Delete this signal?")) return;
    const { error } = await supabase.from("signals").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    await loadSignals();
  };

  const triggerImmediateSend = async (audience: Audience, symbol: string | null) => {
    if (!ZAPIER_SECRET) {
      console.warn("NEXT_PUBLIC_ZAPIER_SECRET not configured; cannot trigger Zapier re-broadcast.");
      setError("Zapier secret missing on client. Configure NEXT_PUBLIC_ZAPIER_SECRET to enable Send Now.");
      return;
    }

    try {
      const response = await fetch(`/api/zapier/ai-signal?auth=${encodeURIComponent(ZAPIER_SECRET)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience,
          count: 1,
          markets: symbol ? [symbol] : [],
          sendNow: true,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to trigger immediate send");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to trigger send";
      setError(message);
    }
  };

  const handleSendNowClick = async (signal: SignalRow) => {
    if (!signal.audience) {
      setError("Signal is missing an audience tier.");
      return;
    }
    await triggerImmediateSend(signal.audience as Audience, signal.symbol ?? null);
    await loadSignals();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-neutral-900 text-gold flex items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-6xl rounded-3xl border border-gold/30 bg-black/80 p-8 shadow-[0_0_45px_rgba(212,175,55,0.18)] backdrop-blur">
        <header className="flex flex-col gap-4 text-center sm:text-left sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gold">Growfinitys Admin Panel</h1>
            <p className="text-sm text-gold/70">Compose AI-driven signals, manage tiers, and deliver instant broadcasts.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-2xl border border-transparent bg-gold px-5 py-2 text-sm font-semibold text-black transition hover:border-gold hover:bg-transparent hover:text-gold"
          >
            ➕ New Signal
          </button>
        </header>

        <section className="mt-8 rounded-2xl border border-gold/20 bg-black/60 p-6 shadow-inner shadow-gold/10">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <p className="py-10 text-center text-gold/60">Loading latest signals…</p>
          ) : signals.length === 0 ? (
            <p className="py-10 text-center text-gold/60">No signals found. Create your first one with the button above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gold/90">
                <thead className="text-xs uppercase tracking-wide text-gold/60">
                  <tr className="border-b border-gold/20">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Symbol</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Audience</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Scheduled</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {signals.map((signal) => (
                    <tr key={signal.id} className="border-b border-gold/10 last:border-none hover:bg-gold/5">
                      <td className="px-4 py-3 font-medium text-gold">{signal.title || "—"}</td>
                      <td className="px-4 py-3 text-gold/80">{signal.symbol || "—"}</td>
                      <td className="px-4 py-3 text-gold/80">{signal.type || "—"}</td>
                      <td className="px-4 py-3 uppercase text-gold/80">{signal.audience}</td>
                      <td className="px-4 py-3 text-gold/70">{signal.status || "—"}</td>
                      <td className="px-4 py-3 text-xs text-gold/60">
                        {signal.scheduled_at ? new Date(signal.scheduled_at).toLocaleString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleSendNowClick(signal)}
                            className="rounded-xl border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-gold transition hover:bg-gold hover:text-black"
                          >
                            Send Now
                          </button>
                          <button
                            onClick={() => openEditModal(signal)}
                            className="rounded-xl border border-gold/30 bg-transparent px-3 py-1 text-xs text-gold/80 transition hover:border-gold hover:text-gold"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => void deleteSignal(signal.id)}
                            className="rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-1 text-xs text-red-200 transition hover:bg-red-500/30"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-gold/40 bg-black/90 p-8 shadow-[0_0_35px_rgba(212,175,55,0.25)]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gold">{editingId ? "Edit Signal" : "New Signal"}</h2>
                <p className="mt-1 text-sm text-gold/70">Craft premium alerts tailored for your membership tiers.</p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gold/60 transition hover:text-gold"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <InputField label="Title" name="title" value={form.title} onChange={handleChange} required />
              <InputField label="Symbol" name="symbol" value={form.symbol} onChange={handleChange} placeholder="EURUSD / BTCUSDT" required />

              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField label="Type" name="type" value={form.type} onChange={handleChange} options={["LONG", "SHORT"]} required />
                <SelectField label="Risk" name="risk" value={form.risk} onChange={handleChange} options={["low", "med", "high"]} required />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Entry" name="entry" value={form.entry} onChange={handleChange} placeholder="1.0820" required />
                <InputField label="Stop Loss" name="sl" value={form.sl} onChange={handleChange} placeholder="1.0760" required />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Take Profit 1" name="tp1" value={form.tp1} onChange={handleChange} placeholder="1.0950" required />
                <InputField label="Take Profit 2" name="tp2" value={form.tp2} onChange={handleChange} placeholder="Optional" />
              </div>

              <SelectField label="Audience" name="audience" value={form.audience} onChange={handleChange} options={["basic", "pro", "vip"]} required />

              <label className="flex items-center gap-3 text-sm text-gold/80">
                <input
                  type="checkbox"
                  name="sendNow"
                  checked={form.sendNow}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gold/50 bg-transparent text-gold focus:ring-gold"
                />
                Send immediately via Zapier AI broadcast
              </label>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="inline-flex items-center justify-center rounded-2xl border border-gold/30 px-5 py-2 text-sm font-medium text-gold/80 transition hover:border-gold hover:text-gold"
              >
                Cancel
              </button>
              <button
                onClick={() => void persistSignal()}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl border border-transparent bg-gold px-5 py-2 text-sm font-semibold text-black transition hover:border-gold hover:bg-transparent hover:text-gold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving…" : editingId ? "Save Changes" : "Create Signal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
};

function InputField({ label, name, value, onChange, placeholder, required }: InputFieldProps) {
  return (
    <label className="block text-sm text-gold/70">
      <span className="mb-1 block uppercase tracking-wide text-xs text-gold/60">{label}{required ? " *" : ""}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border-b border-gold/40 bg-transparent px-0 pb-2 pt-1 text-base text-gold placeholder:text-gold/30 focus:border-gold focus:outline-none"
      />
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
};

function SelectField({ label, name, value, options, onChange, required }: SelectFieldProps) {
  return (
    <label className="block text-sm text-gold/70">
      <span className="mb-1 block uppercase tracking-wide text-xs text-gold/60">{label}{required ? " *" : ""}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border-b border-gold/40 bg-black/60 px-0 pb-2 pt-1 text-base text-gold focus:border-gold focus:outline-none"
      >
        <option value="" className="bg-black text-gold/50">
          Select {label}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-black text-gold">
            {option.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}

export default AdminPanel;
