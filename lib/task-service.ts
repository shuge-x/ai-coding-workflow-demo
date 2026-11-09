import { prisma } from "@/lib/prisma";
import { normalizeTaskTitle } from "@/lib/task-title";

export type CreateTaskInput = {
  projectId: string;
  title: string;
  description?: string;
};

export async function createTask(input: CreateTaskInput) {
  return prisma.task.create({
    data: {
      projectId: input.projectId,
      title: normalizeTaskTitle(input.title),
      description: input.description ?? "",
      status: "TODO",
      priority: "MEDIUM"
    }
  });
}
