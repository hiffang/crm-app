import AppShell from "@/app/components/AppShell";
import prisma from "@/lib/prisma";

const STATUSES = [
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

const statusTone = (status: string) => {
  switch (status) {
    case "New":
      return "bg-blue-100 text-blue-700";
    case "Contacted":
      return "bg-amber-100 text-amber-700";
    case "Qualified":
      return "bg-purple-100 text-purple-700";
    case "Proposal Sent":
      return "bg-orange-100 text-orange-700";
    case "Won":
      return "bg-emerald-100 text-emerald-700";
    case "Lost":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(value);

export default async function DashboardPage() {
  const totalLeads = await prisma.lead.count();
  const statusCounts = await Promise.all(
    STATUSES.map(async (status) => ({
      status,
      count: await prisma.lead.count({ where: { status } }),
    }))
  );
  const totalValue = await prisma.lead.aggregate({
    _sum: { dealValue: true },
  });
  const wonValue = await prisma.lead.aggregate({
    _sum: { dealValue: true },
    where: { status: "Won" },
  });
  const sources = await prisma.lead.groupBy({
    by: ["source"],
    _sum: { dealValue: true },
    orderBy: { _sum: { dealValue: "desc" } },
  });
  const recentLeads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const statusMap = statusCounts.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = item.count;
    return acc;
  }, {});

  const maxStatusCount = Math.max(1, ...statusCounts.map((item) => item.count));
  const maxSourceValue = Math.max(
    1,
    ...sources.map((item) => item._sum.dealValue ?? 0)
  );

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Dashboard
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Pipeline overview
            </h2>
          </div>
          <div className="text-sm text-slate-500">
            Updated in real time
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Total leads
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {totalLeads}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              New leads
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {statusMap.New ?? 0}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Qualified
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {statusMap.Qualified ?? 0}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Won leads
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {statusMap.Won ?? 0}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Lost leads
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {statusMap.Lost ?? 0}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Total value
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {currency.format(totalValue._sum.dealValue ?? 0)}
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Leads by status
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  Stage distribution
                </h3>
              </div>
              <span className="text-xs text-slate-500">Count</span>
            </div>
            <div className="mt-6 space-y-4">
              {statusCounts.map((item) => (
                <div key={item.status}>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{item.status}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-slate-900"
                      style={{ width: `${(item.count / maxStatusCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Deal value by source
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  Revenue mix
                </h3>
              </div>
              <span className="text-xs text-slate-500">Value</span>
            </div>
            <div className="mt-6 space-y-4">
              {sources.map((item) => (
                <div key={item.source}>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{item.source}</span>
                    <span>{currency.format(item._sum.dealValue ?? 0)}</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-amber-400"
                      style={{
                        width: `${
                          ((item._sum.dealValue ?? 0) / maxSourceValue) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Recent leads
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Latest activity
              </h3>
            </div>
            <span className="text-xs text-slate-500">Last 5 created</span>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {lead.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {lead.company}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {currency.format(lead.dealValue)}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
