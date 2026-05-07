import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

async function main() {
  const hashed = await bcrypt.hash("password123", 10);
  
  // Verify the hash works before inserting
  const valid = await bcrypt.compare("password123", hashed);
  console.log("Hash valid:", valid);
  console.log("Hash value:", hashed);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { password: hashed }, // also update if user already exists
    create: {
      email: "admin@example.com",
      password: hashed,
      name: "Admin User",
    },
  });

  console.log("Admin user:", admin.email, admin.id);
}

main().then(() => prisma.$disconnect());