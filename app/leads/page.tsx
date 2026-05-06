import Link from "next/link";
import { Prisma } from "@prisma/client";

import AppShell from "@/app/components/AppShell";
import LeadRowActions from "@/app/leads/lead-row-actions";
import FiltersForm from "@/app/leads/filters-form";
import prisma from "@/lib/prisma";

const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

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

const statusTone = (status: string) => {
  switch (status) {
    case "New":
      return "bg-blue-100 text-blue-700";
    case "Won":
      return "bg-emerald-100 text-emerald-700";
    case "Lost":
      return "bg-rose-100 text-rose-700";
    case "Qualified":
      return "bg-purple-100 text-purple-700";
    case "Proposal Sent":
      return "bg-orange-100 text-orange-700";
    case "Contacted":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const status =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : "";
  const source =
    typeof resolvedSearchParams.source === "string"
      ? resolvedSearchParams.source
      : "";
  const assignedTo =
    typeof resolvedSearchParams.assignedTo === "string"
      ? resolvedSearchParams.assignedTo
      : "";
  const search =
    typeof resolvedSearchParams.search === "string"
      ? resolvedSearchParams.search
      : "";

  const where: Prisma.LeadWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (source) {
    where.source = source;
  }

  if (assignedTo) {
    where.userId = assignedTo;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { company: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [leads, users, sources] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
    prisma.lead.findMany({
      select: { source: true },
      distinct: ["source"],
      orderBy: { source: "asc" },
    }),
  ]);

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Pipeline
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">Leads</h2>
          </div>
          <Link
            className="rounded-full bg-amber-400 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-sm hover:bg-amber-300"
            href="/leads/new"
          >
            Add lead
          </Link>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <FiltersForm>
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              placeholder="Search name, company, email"
              type="search"
              name="search"
              defaultValue={search}
            />
            <select
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              name="status"
              defaultValue={status}
            >
              <option value="">Status</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              name="source"
              defaultValue={source}
            >
              <option value="">Lead source</option>
              {sources.map((item) => (
                <option key={item.source} value={item.source}>
                  {item.source}
                </option>
              ))}
            </select>
            <select
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              name="assignedTo"
              defaultValue={assignedTo}
            >
              <option value="">Assigned salesperson</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name ?? "Unnamed"}
                </option>
              ))}
            </select>
          </FiltersForm>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Deal value</th>
                  <th className="px-6 py-4">Assigned</th>
                  <th className="px-6 py-4">Last updated</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="bg-white hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{lead.company}</td>
                    <td className="px-6 py-4 text-slate-600">{lead.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {currency.format(lead.dealValue)}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {lead.assignedTo?.name ?? "Unassigned"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(lead.updatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <LeadRowActions leadId={lead.id} />
                    </td>
                  </tr>
                ))}
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-10 text-center text-sm text-slate-500"
                    >
                      No leads match the current filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
