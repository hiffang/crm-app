import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
      select: { email: true, password: true }
    });
    return NextResponse.json({ found: !!user, email: user?.email });
  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}