import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

// ──────────────────────────────────────────────────────────────
// Run with: npm run db:seed
// Creates one admin account (to test /admin) and one regular FREE
// account (to test the normal signup/import/billing flow) so you
// don't have to manually flip a role in the database.
// ──────────────────────────────────────────────────────────────

async function main() {
  const passwordHash = await bcrypt.hash("orbital-demo-123", 12);

  await db.user.upsert({
    where: { email: "admin@orbital.app" },
    update: {},
    create: {
      email: "admin@orbital.app",
      name: "Orbital Admin",
      role: "ADMIN",
      passwordHash,
      subscription: { create: { plan: "PRO", status: "ACTIVE", freeProductUsed: true } },
    },
  });

  await db.user.upsert({
    where: { email: "demo@orbital.app" },
    update: {},
    create: {
      email: "demo@orbital.app",
      name: "Demo User",
      role: "USER",
      passwordHash,
      subscription: { create: { plan: "FREE", status: "NONE", freeProductUsed: false } },
    },
  });

  console.log("Seeded: admin@orbital.app / demo@orbital.app (password: orbital-demo-123)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
