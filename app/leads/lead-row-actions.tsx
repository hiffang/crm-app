"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LeadRowActions({ leadId }: { leadId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this lead?");
    if (!confirmed) return;

    const response = await fetch(`/api/leads/${leadId}`, { method: "DELETE" });
    if (response.ok) {
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
      <Link className="text-slate-600 hover:text-slate-900" href={`/leads/${leadId}`}>
        View
      </Link>
      <Link
        className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
        href={`/leads/${leadId}/edit`}
      >
        <span>Edit</span>
        
      </Link>
      <button
        className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700"
        type="button"
        onClick={handleDelete}
      >
        <span>Delete</span>
      </button>
    </div>
  );
}
