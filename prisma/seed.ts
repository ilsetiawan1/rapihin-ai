import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1. Create or update an admin user
  const adminEmail = "admin@rapihin.ai";
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "ADMIN",
      tokens: 9999,
    },
    create: {
      email: adminEmail,
      name: "Super Admin RapihinAI",
      role: "ADMIN",
      tokens: 9999,
    },
  });

  console.log(`Admin user created/updated: ${adminUser.email}`);

  // 2. Create some dummy activities for telemetry / dashboard testing
  const dummyUsers = [
    { email: "budi@student.univ.ac.id", name: "Budi Santoso", tokens: 5 },
    { email: "ani@student.univ.ac.id", name: "Ani Wijaya", tokens: 2 },
    { email: "cici@student.univ.ac.id", name: "Cici Lestari", tokens: 10 },
  ];

  for (const dummy of dummyUsers) {
    const user = await prisma.user.upsert({
      where: { email: dummy.email },
      update: {},
      create: {
        email: dummy.email,
        name: dummy.name,
        role: "USER",
        tokens: dummy.tokens,
      },
    });

    // Add some random activities for this user
    await prisma.activity.createMany({
      data: [
        {
          userId: user.id,
          actionType: "LAYOUT_FIX",
          tokenCost: 0,
          fileSize: 1048576, // 1MB
          durationMs: 450,
          status: "SUCCESS",
        },
        {
          userId: user.id,
          actionType: "AI_REVIEW",
          tokenCost: 1,
          fileSize: 1572864, // 1.5MB
          durationMs: 1200,
          status: "SUCCESS",
        },
      ],
    });
  }

  // Add some guest activities (no userId)
  await prisma.activity.createMany({
    data: [
      {
        actionType: "LAYOUT_FIX",
        tokenCost: 0,
        fileSize: 524288, // 512KB
        durationMs: 310,
        status: "SUCCESS",
      },
      {
        actionType: "COMPLIANCE_CHECK",
        tokenCost: 0,
        fileSize: 819200, // 800KB
        durationMs: 180,
        status: "SUCCESS",
      },
    ],
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
