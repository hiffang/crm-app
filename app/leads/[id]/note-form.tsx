"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NoteForm({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch(`/api/leads/${leadId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    setLoading(false);

    if (!response.ok) {
      setError("Unable to add note. Try again.");
      return;
    }

    setContent("");
    router.refresh();
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        New note
      </label>
      <textarea
        className="min-h-[140px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Log the latest call, email, or meeting outcome."
        required
      />
      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
      <button
        className="rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900"
        type="submit"
        disabled={loading}
      >
        {loading ? "Saving..." : "Add note"}
      </button>
    </form>
  );
}
