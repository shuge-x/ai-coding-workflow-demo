import { prisma } from "@/lib/prisma";

export type CreateTaskInput = {
  projectId: string;
  title: string;
  description?: string;
};

export async function createTask(input: CreateTaskInput) {
  return prisma.task.create({
    data: {
      projectId: input.projectId,
      title: input.title,
      description: input.description ?? "",
      status: "TODO",
      priority: "MEDIUM"
    }
  });
}
