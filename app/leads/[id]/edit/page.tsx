import { notFound } from "next/navigation";

import AppShell from "@/app/components/AppShell";
import LeadForm from "@/app/leads/lead-form";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [lead, users] = await Promise.all([
    prisma.lead.findUnique({ where: { id } }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!lead) {
    notFound();
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Lead update
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">Edit lead</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <LeadForm users={users} lead={lead} />
        </div>
      </div>
    </AppShell>
  );
}
