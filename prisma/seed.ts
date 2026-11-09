import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const project = await prisma.project.upsert({
    where: { id: "team-task-board" },
    update: {
      name: "产品研发看板",
      description: "把目标拆成清晰的下一步，让团队协作有序推进。"
    },
    create: {
      id: "team-task-board",
      name: "产品研发看板",
      description: "把目标拆成清晰的下一步，让团队协作有序推进。"
    }
  });

  await prisma.task.deleteMany({ where: { projectId: project.id } });
  console.log("Seeded project:", project.name, "(empty task board)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
