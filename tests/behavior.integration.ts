import assert from "node:assert/strict";
import { prisma } from "../lib/prisma";
import { assignTask, createTask, updateTaskStatus, addTaskComment, listTaskComments } from "../lib/task-service";


async function main() {
  assert.equal(process.env.DATABASE_URL, "file:./behavior-test.db", "Use npm run test:behavior with its isolated database");
  const projectId = "behavior-test-project";
  const ids = ["behavior-test-owner", "behavior-test-manager", "behavior-test-member", "behavior-test-outsider"];
  // This command uses a dedicated behavior-test.db; only these fixtures are removed.
  await prisma.project.deleteMany({ where: { id: projectId } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  try {
    await prisma.project.create({ data: { id: projectId, name: "权限测试", team: { connectOrCreate: { where: { id: "behavior-test-team" }, create: { id: "behavior-test-team", name: "行为保护", slug: "behavior-test-team" } } } } });
    for (const [index, id] of ids.entries()) {
      await prisma.user.create({ data: { id, name: id, email: id + "@example.test" } });
      if (index < 3) await prisma.membership.create({ data: { projectId, userId: id, role: ["OWNER", "MANAGER", "MEMBER"][index] } });
    }
    const task = await createTask({ projectId, title: "  行为   保护  " });
    assert.equal(task.title, "行为 保护");
    assert.equal(task.status, "TODO");
    assert.equal((await updateTaskStatus(task.id, "DONE")).status, "DONE");
    const comment = await addTaskComment(task.id, ids[2], "  需要保留的评论  ");
    assert.equal(comment.body, "需要保留的评论");
    assert.equal((await listTaskComments(task.id))[0].body, "需要保留的评论");
    await assert.rejects(addTaskComment(task.id, ids[3], "越权评论"), /只有项目成员/);
    await assert.rejects(addTaskComment("missing-task", ids[0], "无任务"), /任务不存在/);
    assert.equal((await assignTask(task.id, ids[0], ids[2])).assigneeId, ids[2]);
    assert.equal((await assignTask(task.id, ids[1], ids[0])).assigneeId, ids[0]);
    await assert.rejects(assignTask(task.id, ids[2], ids[1]), /无权/);
    await assert.rejects(assignTask(task.id, ids[0], ids[3]), /不是项目成员/);
    await assert.rejects(assignTask(task.id, ids[3], null), /无权/);
    await assert.rejects(assignTask("missing-task", ids[0], ids[1]), /任务不存在/);
    assert.equal((await assignTask(task.id, ids[1], null)).assigneeId, null);
    console.log("PASS: create normalization, status update, comment create/read/deny, assignment/replace/clear and permission failures preserved.");
  } finally {
    await prisma.project.deleteMany({ where: { id: projectId } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await prisma.team.deleteMany({ where: { id: "behavior-test-team" } });
    await prisma.$disconnect();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
