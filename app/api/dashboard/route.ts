import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  return NextResponse.json({
    totalLeads,
    statusCounts,
    totalValue: totalValue._sum.dealValue ?? 0,
    wonValue: wonValue._sum.dealValue ?? 0,
  });
}
