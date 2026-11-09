import { prisma } from "@/lib/prisma";
import { TaskBoard } from "@/app/components/task-board";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const project = await prisma.project.findFirst({
    orderBy: { createdAt: "asc" },
    include: {
      team: true,
      tasks: {
        orderBy: { createdAt: "desc" },
        include: { assignee: true }
      },
      members: {
        include: { user: true },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!project) {
    return (
      <main className="setup-screen">
        <div className="setup-card">
          <span className="eyebrow">TEAM TASK BOARD</span>
          <h1>还没有教学项目数据</h1>
          <p>请先复制环境变量并初始化本地数据库。</p>
          <code>cp .env.example .env && npm run db:push && npm run db:seed</code>
        </div>
      </main>
    );
  }

  const tasks = project.tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as "TODO" | "IN_PROGRESS" | "DONE",
    priority: task.priority as "LOW" | "MEDIUM" | "HIGH",
    dueDate: task.dueDate?.toISOString() ?? null,
    assigneeId: task.assigneeId,
    assigneeName: task.assignee?.name ?? null,
    createdAt: task.createdAt.toISOString()
  }));

  const members = project.members.map((membership) => ({
    id: membership.user.id,
    name: membership.user.name,
    role: membership.role
  }));

  return <TaskBoard project={{ id: project.id, name: project.name, description: project.description, teamName: project.team.name }} initialTasks={tasks} members={members} />;
}
