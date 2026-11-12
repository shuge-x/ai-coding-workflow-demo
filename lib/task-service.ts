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

export async function updateTaskStatus(taskId: string, status: "TODO" | "IN_PROGRESS" | "DONE") {
  return prisma.task.update({
    where: { id: taskId },
    data: { status }
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

// Keep the public task-service seam stable while the assignment implementation moves behind it.
export { assignTask } from "@/lib/task-assignment";
