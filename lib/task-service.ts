import { prisma } from "@/lib/prisma";
import { normalizeTaskTitle } from "@/lib/task-title";
import { canAssignTask } from "@/lib/task-rules";

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

export async function updateTaskStatus(taskId: string, status: "TODO" | "IN_PROGRESS" | "DONE") {
  return prisma.task.update({
    where: { id: taskId },
    data: { status }
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

  if (!canAssignTask(actorMembership?.role, assigneeId === null || Boolean(assigneeMembership))) {
    throw new Error("当前用户无权指派该任务，或目标用户不是项目成员");
  }

  return prisma.task.update({
    where: { id: taskId },
    data: { assigneeId },
    include: { assignee: true }
  });
}

export async function addTaskComment(taskId: string, authorId: string, body: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { projectId: true }
  });
  if (!task) throw new Error("任务不存在");

  const membership = await prisma.membership.findUnique({
    where: { projectId_userId: { projectId: task.projectId, userId: authorId } }
  });
  if (!membership) throw new Error("只有项目成员可以评论");

  return prisma.comment.create({
    data: { taskId, authorId, body: body.trim() },
    include: { author: true }
  });
}

export async function listTaskComments(taskId: string) {
  return prisma.comment.findMany({
    where: { taskId },
    include: { author: true },
    orderBy: { createdAt: "asc" }
  });
}
