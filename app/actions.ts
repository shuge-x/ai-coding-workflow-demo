"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assignTask, createTask, updateTaskStatus } from "@/lib/task-service";

const createTaskSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().trim().min(2, "任务名称至少需要 2 个字符").max(80, "任务名称不能超过 80 个字符"),
  description: z.string().trim().max(500, "描述不能超过 500 个字符").optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

export async function createTaskAction(input: {
  projectId: string;
  title: string;
  description?: string;
  dueDate?: string;
}) {
  const parsed = createTaskSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "请检查输入内容"
    };
  }

  const task = await createTask({ ...parsed.data, dueDate: parsed.data.dueDate ? new Date(`${parsed.data.dueDate}T12:00:00`) : null });
  revalidatePath("/");

  return {
    ok: true as const,
    task: {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status as "TODO" | "IN_PROGRESS" | "DONE",
      priority: task.priority as "LOW" | "MEDIUM" | "HIGH",
      dueDate: task.dueDate?.toISOString() ?? null,
      assigneeId: task.assigneeId,
      assigneeName: null,
      createdAt: task.createdAt.toISOString()
    }
  };
}

const updateTaskStatusSchema = z.object({
  taskId: z.string().min(1),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"])
});

export async function updateTaskStatusAction(input: { taskId: string; status: "TODO" | "IN_PROGRESS" | "DONE" }) {
  const parsed = updateTaskStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "无效的任务状态" };
  }
  await updateTaskStatus(parsed.data.taskId, parsed.data.status);
  revalidatePath("/");
  return { ok: true as const };
}

const assignTaskSchema = z.object({
  taskId: z.string().min(1),
  assigneeId: z.string().nullable()
});

export async function assignTaskAction(input: { taskId: string; assigneeId: string | null }) {
  const parsed = assignTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "无效的指派请求" };
  }

  try {
    // Demo identity: the seeded project owner. A real application must use its authenticated session.
    const task = await assignTask(parsed.data.taskId, "user-lin", parsed.data.assigneeId);
    revalidatePath("/");
    return {
      ok: true as const,
      assigneeId: task.assigneeId,
      assigneeName: task.assignee?.name ?? null
    };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "指派失败" };
  }
}
