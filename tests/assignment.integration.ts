import assert from "node:assert/strict";
import { prisma } from "../lib/prisma";
import { assignTask } from "../lib/task-service";

async function main() {
  assert.equal(process.env.DATABASE_URL, "file:./assignment-test.db", "Use npm run test:assignment-service with its isolated database");
  const projectId = "assignment-test-project";
  const ids = ["assignment-test-owner", "assignment-test-manager", "assignment-test-member", "assignment-test-outsider"];
  // This command uses a dedicated assignment-test.db; only these fixtures are removed.
  await prisma.project.deleteMany({ where: { id: projectId } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  try {
    await prisma.project.create({ data: { id: projectId, name: "权限测试" } });
    for (const [index, id] of ids.entries()) {
      await prisma.user.create({ data: { id, name: id, email: id + "@example.test" } });
      if (index < 3) await prisma.membership.create({ data: { projectId, userId: id, role: ["OWNER", "MANAGER", "MEMBER"][index] } });
    }
    const task = await prisma.task.create({ data: { projectId, title: "测试指派" } });
    assert.equal((await assignTask(task.id, ids[0], ids[2])).assigneeId, ids[2]);
    assert.equal((await assignTask(task.id, ids[1], ids[0])).assigneeId, ids[0]);
    await assert.rejects(assignTask(task.id, ids[2], ids[1]), /无权/);
    await assert.rejects(assignTask(task.id, ids[0], ids[3]), /不是项目成员/);
    await assert.rejects(assignTask(task.id, ids[3], null), /无权/);
    await assert.rejects(assignTask("missing-task", ids[0], ids[1]), /任务不存在/);
    assert.equal((await assignTask(task.id, ids[1], null)).assigneeId, null);
    console.log("PASS: Owner assign, Manager replace/clear, Member and outsider denied, nonmember target and missing task rejected.");
  } finally {
    await prisma.project.deleteMany({ where: { id: projectId } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await prisma.$disconnect();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
