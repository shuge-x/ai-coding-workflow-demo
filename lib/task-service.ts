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
  // Story 05 intentionally contains a persistence defect: the UI changes optimistically,
  // but this update does not write the requested status to the database.
  return prisma.task.update({
    where: { id: taskId },
    data: { updatedAt: new Date() }
  });
}
