import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const status = params.get("status") ?? "";
  const source = params.get("source") ?? "";
  const assignedTo = params.get("assignedTo") ?? "";
  const search = params.get("search")?.trim() ?? "";

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

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json({ leads });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const name = String(body.name ?? "").trim();
  const company = String(body.company ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const source = String(body.source ?? "").trim();
  const status = String(body.status ?? "New").trim();
  const dealValue = Number(body.dealValue ?? 0);
  const assignedToId = String(body.assignedToId ?? session.user.id).trim();

  if (!name || !company || !email || !phone || !source) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const lead = await prisma.lead.create({
    data: {
      name,
      company,
      email,
      phone,
      source,
      status,
      dealValue: Number.isFinite(dealValue) ? dealValue : 0,
      userId: assignedToId,
    },
  });

  return NextResponse.json({ lead }, { status: 201 });
}
