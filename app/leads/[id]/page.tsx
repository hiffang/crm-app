import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/app/components/AppShell";
import DeleteButton from "@/app/leads/[id]/delete-button";
import NoteForm from "@/app/leads/[id]/note-form";
import StatusSelect from "@/app/leads/[id]/status-select";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      notes: {
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!lead) {
    notFound();
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Lead detail
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">{lead.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{lead.company}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatusSelect leadId={lead.id} currentStatus={lead.status} />
            <Link
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700"
              href={`/leads/${lead.id}/edit`}
            >
              Edit lead
            </Link>
            <DeleteButton leadId={lead.id} />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Email
                </p>
                <p className="mt-2 text-sm text-slate-700">{lead.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Phone
                </p>
                <p className="mt-2 text-sm text-slate-700">{lead.phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Lead source
                </p>
                <p className="mt-2 text-sm text-slate-700">{lead.source}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Deal value
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {currency.format(lead.dealValue)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Assigned to
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {lead.assignedTo?.name ?? "Unassigned"}
              </p>
              <p className="text-sm text-slate-500">
                {lead.assignedTo?.email ?? ""}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Timeline
              </p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p>Created {formatDate(lead.createdAt)}</p>
                <p>Updated {formatDate(lead.updatedAt)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">Notes</h3>
            <div className="mt-4 space-y-4">
              {lead.notes.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No notes yet. Add the first touchpoint.
                </p>
              ) : (
                lead.notes.map((note: (typeof lead.notes)[number]) => (
                  <div
                    key={note.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <p className="text-sm text-slate-800">{note.content}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                      {note.author?.name ?? "Unknown"} · {formatDate(note.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <NoteForm leadId={lead.id} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
