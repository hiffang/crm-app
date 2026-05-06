"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ leadId }: { leadId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this lead and all attached notes? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/leads/${leadId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/leads");
      router.refresh();
    }
  };

  return (
    <button
      className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600 hover:border-rose-400 hover:text-rose-700"
      type="button"
      onClick={handleDelete}
    >
      Delete lead
    </button>
  );
}
