"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createTask } from "@/lib/task-service";

const createTaskSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().trim().min(2, "任务名称至少需要 2 个字符").max(80, "任务名称不能超过 80 个字符"),
  description: z.string().trim().max(500, "描述不能超过 500 个字符").optional()
});

export async function createTaskAction(input: {
  projectId: string;
  title: string;
  description?: string;
}) {
  const parsed = createTaskSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "请检查输入内容"
    };
  }

  const task = await createTask(parsed.data);
  revalidatePath("/");

  return {
    ok: true as const,
    task: {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status as "TODO" | "IN_PROGRESS" | "DONE",
      priority: task.priority as "LOW" | "MEDIUM" | "HIGH",
      createdAt: task.createdAt.toISOString()
    }
  };
}
