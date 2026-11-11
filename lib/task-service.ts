import { prisma } from "@/lib/prisma";
import { normalizeTaskTitle } from "@/lib/task-title";

export type CreateTaskInput = {
  projectId: string;
  title: string;
  description?: string;
  dueDate?: Date | null;
};

export async function createTask(input: CreateTaskInput) {
  return prisma.task.create({
    data: {
      projectId: input.projectId,
      title: normalizeTaskTitle(input.title),
      description: input.description ?? "",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: input.dueDate ?? null
    }
  });
}

export async function assignTask(taskId: string, actorId: string, assigneeId: string | null) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true, projectId: true }
  });
  if (!task) throw new Error("任务不存在");

  const actorMembership = await prisma.membership.findUnique({
    where: { projectId_userId: { projectId: task.projectId, userId: actorId } }
  });
  const assigneeMembership = assigneeId
    ? await prisma.membership.findUnique({
        where: { projectId_userId: { projectId: task.projectId, userId: assigneeId } }
      })
    : null;

  if (!(actorMembership?.role === "OWNER" || actorMembership?.role === "MANAGER") || (assigneeId !== null && !assigneeMembership)) {
    throw new Error("当前用户无权指派该任务，或目标用户不是项目成员");
  }

  return prisma.task.update({
    where: { id: taskId },
    data: { assigneeId },
    include: { assignee: true }
  });
}
