"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

type StatusSelectProps = {
  leadId: string;
  currentStatus: string;
};

export default function StatusSelect({ leadId, currentStatus }: StatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (value: string) => {
    setStatus(value);
    setLoading(true);

    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: value }),
    });

    setLoading(false);
    router.refresh();
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
      <span className="h-2 w-2 rounded-full bg-amber-400" />
      <select
        className="bg-transparent text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 outline-none"
        value={status}
        onChange={(event) => handleChange(event.target.value)}
        disabled={loading}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
