"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

type LeadFormUser = {
  id: string;
  name: string | null;
  email: string;
};

type LeadFormLead = {
  id?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
  dealValue?: number;
  userId?: string;
};

export default function LeadForm({
  users,
  lead,
}: {
  users: LeadFormUser[];
  lead?: LeadFormLead;
}) {
  const router = useRouter();
  const [name, setName] = useState(lead?.name ?? "");
  const [company, setCompany] = useState(lead?.company ?? "");
  const [email, setEmail] = useState(lead?.email ?? "");
  const [phone, setPhone] = useState(lead?.phone ?? "");
  const [source, setSource] = useState(lead?.source ?? "");
  const [status, setStatus] = useState(lead?.status ?? "New");
  const [dealValue, setDealValue] = useState(String(lead?.dealValue ?? 0));
  const [assignedToId, setAssignedToId] = useState(
    lead?.userId ?? users[0]?.id ?? "",
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitLabel = lead?.id ? "Update lead" : "Create lead";
  const cancelHref = lead?.id ? `/leads/${lead.id}` : "/leads";

  const payload = useMemo(
    () => ({
      name,
      company,
      email,
      phone,
      source,
      status,
      dealValue: Number(dealValue || 0),
      assignedToId,
    }),
    [name, company, email, phone, source, status, dealValue, assignedToId],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = lead?.id ? `/api/leads/${lead.id}` : "/api/leads";
    const method = lead?.id ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!response.ok) {
      setError("Something went wrong. Please check the form and try again.");
      return;
    }

    const data = await response.json();
    const leadId = lead?.id ?? data.lead?.id;

    if (leadId) {
      router.push(`/leads/${leadId}`);
      router.refresh();
    } else {
      router.push("/leads");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Lead name
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Jane Doe"
            required
          />
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Company name
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder="Northwind Ventures"
            required
          />
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Email address
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="lead@company.com"
            required
          />
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Phone number
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="(555) 555-5555"
            required
          />
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Lead source
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            required
          >
            <option value="">Select a source</option>
            <option value="Website">Website</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Referral">Referral</option>
            <option value="Cold Email">Cold Email</option>
            <option value="Event">Event</option>
          </select>
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Estimated deal value
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
            value={dealValue}
            onChange={(event) => setDealValue(event.target.value)}
            type="number"
            min="0"
            placeholder="50000"
          />
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Status
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {STATUS_OPTIONS.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Assigned salesperson
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
            value={assignedToId}
            onChange={(event) => setAssignedToId(event.target.value)}
            required
          >
            {users.map((user: LeadFormUser) => (
              <option key={user.id} value={user.id}>
                {user.name ?? "Unnamed"} ({user.email})
              </option>
            ))}
          </select>
        </label>
      </div>
      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-full bg-amber-400 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-300"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : submitLabel}
        </button>
        <Link
          className="rounded-full border border-slate-200 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700"
          href={cancelHref}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
