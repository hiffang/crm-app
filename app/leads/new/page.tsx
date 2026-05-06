import AppShell from "@/app/components/AppShell";
import LeadForm from "@/app/leads/lead-form";
import prisma from "@/lib/prisma";

export default async function NewLeadPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Create lead
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">New lead</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <LeadForm users={users} />
        </div>
      </div>
    </AppShell>
  );
}
