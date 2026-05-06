import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ lead });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const data: Prisma.LeadUpdateInput = {};

  if (body.name !== undefined) data.name = String(body.name).trim();
  if (body.company !== undefined) data.company = String(body.company).trim();
  if (body.email !== undefined) data.email = String(body.email).trim();
  if (body.phone !== undefined) data.phone = String(body.phone).trim();
  if (body.source !== undefined) data.source = String(body.source).trim();
  if (body.status !== undefined) data.status = String(body.status).trim();
  if (body.dealValue !== undefined) {
    const value = Number(body.dealValue ?? 0);
    data.dealValue = Number.isFinite(value) ? value : 0;
  }
  if (body.assignedToId !== undefined) {
    data.assignedTo = {
      connect: { id: String(body.assignedToId).trim() },
    };
  }

  const lead = await prisma.lead.update({
    where: { id },
    data,
  });

  return NextResponse.json({ lead });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.lead.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
