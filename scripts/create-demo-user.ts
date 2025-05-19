import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Create or update the demo user
    const demoUser = await prisma.user.upsert({
      where: { id: "demo-user" },
      update: {
        name: "Demo User",
        email: "demo@example.com",
        onboarded: true,
      },
      create: {
        id: "demo-user",
        name: "Demo User",
        email: "demo@example.com",
        onboarded: true,
      },
    });

    console.log("Demo user created or updated:", demoUser);

    // Create or update the demo user's profile
    const demoProfile = await prisma.userProfile.upsert({
      where: { userId: "demo-user" },
      update: {
        nickname: "Demo",
        age: 25,
        gender: "Prefer not to say",
        weight: 70,
      },
      create: {
        userId: "demo-user",
        nickname: "Demo",
        age: 25,
        gender: "Prefer not to say",
        weight: 70,
      },
    });

    console.log("Demo profile created or updated:", demoProfile);

    console.log("Demo user setup complete!");
  } catch (error) {
    console.error("Error creating demo user:", error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });