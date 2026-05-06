import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

async function main() {
  const hashed = await bcrypt.hash("password123", 10);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashed,
      name: "Admin User",
    },
  })

  // Create a few sample leads
  await prisma.lead.createMany({
    data: [
      {
        name: "Alice Johnson",
        company: "Acme Corp",
        email: "alice@acme.com",
        phone: "555-1234",
        source: "LinkedIn",
        status: "New",
        dealValue: 5000,
        userId: admin.id,
      },
      {
        name: "Bob Smith",
        company: "TechFlow",
        email: "bob@techflow.com",
        phone: "555-5678",
        source: "Referral",
        status: "Qualified",
        dealValue: 12000,
        userId: admin.id,
      },
      {
        name: "Carol White",
        company: "BizPro",
        email: "carol@bizpro.com",
        phone: "555-9012",
        source: "Website",
        status: "Won",
        dealValue: 8500,
        userId: admin.id,
      },
    ],
  });
}
main().then(() => prisma.$disconnect());