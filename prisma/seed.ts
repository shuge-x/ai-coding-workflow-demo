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
  const baseline = process.env.PRACTICE_BASELINE ?? "01";

  if (baseline !== "01") {
    const now = Date.now();
    const tasks = [
      { title: "梳理新用户引导流程", description: "整理第一次进入产品时需要完成的关键步骤。", status: "TODO", priority: "HIGH", dueDate: new Date(now + 24 * 60 * 60 * 1000) },
      { title: "完成看板筛选交互", description: "支持按负责人和任务状态筛选。", status: "IN_PROGRESS", priority: "MEDIUM", dueDate: new Date(now + 3 * 24 * 60 * 60 * 1000) },
      { title: "更新产品帮助文档", description: "补充任务创建和状态流转说明。", status: "TODO", priority: "LOW", dueDate: new Date(now + 6 * 24 * 60 * 60 * 1000) },
      { title: "检查移动端布局", description: "确认窄屏下看板操作正常。", status: "DONE", priority: "MEDIUM", dueDate: new Date(now - 24 * 60 * 60 * 1000) }
    ];
    await prisma.task.createMany({ data: tasks.map((task) => ({ ...task, projectId: project.id })) });
  }

  console.log("Seeded project:", project.name, "baseline:", baseline);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
