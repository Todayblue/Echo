import prisma from "@/lib/prisma";


async function seed() {

  console.log("Seeding completed");
}

seed()
  .catch((error) => {
    console.error("Error seeding the database:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
