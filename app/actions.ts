"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { cookies } from "next/headers";
import { demoActors, getDemoActor } from "@/lib/demo-identity";
import { assignTask, createTask } from "@/lib/task-service";

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
      assigneeId: null,
      assigneeName: null,
      createdAt: task.createdAt.toISOString()
    }
  };
}

// Deliberately selectable identities for a local teaching app; this is not authentication.
export async function selectDemoActorAction(actorId: string) {
  const parsed = z.enum(demoActors).safeParse(actorId);
  if (!parsed.success) return { ok: false as const, error: "无效的教学身份" };
  (await cookies()).set("demo-actor", parsed.data, { httpOnly: true, sameSite: "lax", path: "/" });
  return { ok: true as const };
}

export async function assignTaskAction(input: { taskId: string; assigneeId: string | null }) {
  const parsed = z.object({ taskId: z.string().min(1), assigneeId: z.string().min(1).nullable() }).safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "无效的指派请求" };
  try {
    const task = await assignTask(parsed.data.taskId, await getDemoActor(), parsed.data.assigneeId);
    revalidatePath("/");
    return { ok: true as const, assigneeId: task.assigneeId, assigneeName: task.assignee?.name ?? null };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "指派失败" };
  }
}
