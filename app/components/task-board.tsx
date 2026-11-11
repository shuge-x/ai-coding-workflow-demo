"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Command,
  Filter,
  LayoutGrid,
  ListTodo,
  Plus,
  Search,
  Settings2,
  X
} from "lucide-react";
import { assignTaskAction, selectDemoActorAction, createTaskAction } from "@/app/actions";
import type { BoardTask, TaskStatus } from "@/lib/task-types";

type Props = {
  actorId: string;
  project: { id: string; name: string; description: string };
  initialTasks: BoardTask[];
  members: { id: string; name: string; role: string }[];
};

const columns: { id: TaskStatus; title: string; tone: string }[] = [
  { id: "TODO", title: "待处理", tone: "slate" },
  { id: "IN_PROGRESS", title: "进行中", tone: "blue" },
  { id: "DONE", title: "已完成", tone: "green" }
];

export function TaskBoard({ project, initialTasks, members, actorId }: Props) {
  const [tasks, setTasks] = useState(initialTasks);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignmentError, setAssignmentError] = useState("");
  const [saved, setSaved] = useState("");
  const canManage = members.some((member) => member.id === actorId && ["OWNER", "MANAGER"].includes(member.role));
  const [error, setError] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const visibleTasks = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return tasks.filter((task) => (!onlyMine || task.assigneeId === actorId) &&
      (task.title + " " + task.description).toLocaleLowerCase().includes(normalized)
    );
  }, [query, tasks, onlyMine, actorId]);

  const openCreate = () => {
    setError("");
    setShowCreate(true);
  };

  const closeCreate = () => {
    if (isPending) return;
    setShowCreate(false);
    setTitle("");
    setDescription("");
    setDueDate("");
    setError("");
  };

  const submitTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await createTaskAction({ projectId: project.id, title, description, dueDate: dueDate || undefined });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setTasks((current) => [result.task, ...current]);
      setShowCreate(false);
      setTitle("");
      setDescription("");
      setDueDate("");
    });
  };

  const changeAssignee = (taskId: string, assigneeId: string) => {
    setAssignmentError("");
    setSaved("");
    startTransition(async () => {
      const result = await assignTaskAction({ taskId, assigneeId: assigneeId || null });
      if (!result.ok) { setAssignmentError(result.error); return; }
      setTasks((current) => current.map((task) => task.id === taskId ? { ...task, assigneeId: result.assigneeId, assigneeName: result.assigneeName } : task));
      setSaved("负责人已保存");
    });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><LayoutGrid size={19} strokeWidth={2.3} /></div>
          <div><strong>taskflow</strong><span>TEAM WORKSPACE</span></div>
        </div>

        <div className="workspace-switcher">
          <div className="workspace-avatar">P</div>
          <div className="workspace-copy"><strong>Product Studio</strong><span>个人工作空间</span></div>
          <ChevronDown size={15} />
        </div>

        <div className="sidebar-label">工作区</div>
        <nav className="side-nav" aria-label="主导航">
          <a className="side-link active" href="#board" onClick={() => setOnlyMine(false)}><LayoutGrid size={17} /><span>任务看板</span><span className="nav-shortcut">⌘ 1</span></a>
          <a className="side-link" href="#my-tasks" onClick={(event) => { event.preventDefault(); setOnlyMine(true); }}><ListTodo size={17} /><span>我的任务</span></a>
          <a className="side-link" href="#calendar"><CalendarDays size={17} /><span>日历</span></a>
        </nav>

        <div className="sidebar-label projects-label">项目</div>
        <button className="project-link selected"><span className="project-dot purple" />产品研发看板<span className="project-more">···</span></button>
        <button className="project-link"><span className="project-dot amber" />市场活动<span className="project-more">···</span></button>
        <button className="project-link"><span className="project-dot teal" />网站改版<span className="project-more">···</span></button>

        <div className="sidebar-bottom">
          <a className="side-link" href="#help"><CircleHelp size={17} /><span>帮助中心</span></a>
          <a className="side-link" href="#settings"><Settings2 size={17} /><span>设置</span></a>
          <div className="profile">
            <div className="profile-avatar">林</div>
            <div><strong>林晓</strong><span>项目 Owner</span></div>
            <ChevronDown size={14} />
          </div>
        </div>
      </aside>

      <main className="main-area" id="board">
        <header className="topbar">
          <div className="breadcrumbs"><span>工作区</span><span className="crumb-sep">/</span><strong>{project.name}</strong></div>
          <div className="top-actions">
            <div className="search-box"><Search size={16} /><input aria-label="搜索任务" placeholder="搜索任务..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></div>
            <button className="icon-button" aria-label="通知"><Bell size={18} /><i /></button>
            <button className="avatar-button" aria-label="当前用户">林</button>
          </div>
        </header>

        <section className="board-content">
          <div className="demo-identity"><label>教学身份 <select aria-label="教学身份" value={actorId} disabled={isPending} onChange={(event) => startTransition(async () => { const result = await selectDemoActorAction(event.target.value); if (result.ok) window.location.reload(); else setAssignmentError(result.error); })}>{members.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.role}</option>)}</select></label><small>仅供本地练习，可主动切换身份；不提供生产认证。</small></div>
          {assignmentError && <p role="alert" className="form-error">{assignmentError}</p>}
          {saved && <p role="status">{saved}</p>}
          <div className="board-heading">
            <div>
              <div className="eyebrow">PROJECT OVERVIEW <span>·</span> 本周工作</div>
              <h1>{project.name}</h1>
              <p>{project.description || "整理目标，明确下一步，让每一项工作都有进展。"}</p>
            </div>
            <div className="heading-actions">
              <div className="member-stack" aria-label="项目成员">{members.map((member, index) => <span key={member.id} className={"member-avatar member-" + (index % 4)} title={member.name}>{member.name.slice(0,1)}</span>)}<span className="member-count">{members.length} 位成员</span></div>
              <button className="secondary-button"><Filter size={15} />筛选<span className="button-caret">⌄</span></button>
              <button className="secondary-button"><Command size={15} />视图<span className="button-caret">⌄</span></button>
              <button className="primary-button" onClick={openCreate}><Plus size={17} />新建任务</button>
            </div>
          </div>

          <div className="board-toolbar">
            <div className="view-tabs"><button className="view-tab active"><LayoutGrid size={15} />看板</button><button className="view-tab"><ListTodo size={15} />列表</button></div>
            <button className="secondary-button" aria-pressed={onlyMine} onClick={() => setOnlyMine((value) => !value)}>仅看我的任务</button><div className="board-summary"><span className="summary-dot" />{tasks.length} 项任务<span className="summary-divider">·</span><span>最近更新</span><span>刚刚</span></div>
          </div>

          {tasks.length > 0 && visibleTasks.length === 0 && <p role="status">当前筛选没有匹配任务</p>}
          {tasks.length === 0 ? (
            <section className="empty-state-basic" aria-label="空任务看板">
              <h2>暂无任务</h2>
              <p>这个看板还没有任务。</p>
              <button className="primary-button" onClick={openCreate}>新建任务</button>
            </section>
          ) : (
            <div className="kanban-grid">
              {columns.map((column) => {
                const columnTasks = visibleTasks.filter((task) => task.status === column.id);
                return (
                  <section className="kanban-column" key={column.id} aria-label={column.title}>
                    <div className="column-heading"><div className="column-title"><span className={"column-indicator " + column.tone} /><strong>{column.title}</strong><span className="column-count">{columnTasks.length}</span></div><button className="column-menu" aria-label={column.title + "更多操作"}>···</button></div>
                    <div className="task-list">
                      {columnTasks.map((task) => (
                        <article className="task-card" key={task.id}>
                          <div className="task-card-top"><span className={"priority-tag " + task.priority.toLowerCase()}>{task.priority === "HIGH" ? "高优先级" : task.priority === "LOW" ? "低优先级" : "普通"}</span><button className="task-menu" aria-label={task.title + "更多操作"}>···</button></div>
                          <h3>{task.title}</h3>
                          {task.description && <p>{task.description}</p>}
                          <label className="assignment-field">负责人<select aria-label={task.title + "负责人"} value={task.assigneeId ?? ""} disabled={isPending || !canManage} onChange={(event) => changeAssignee(task.id, event.target.value)}><option value="">未指派</option>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label>
                          {!canManage && <small>仅 Owner / Manager 可修改指派</small>}
                          <div className="task-card-footer"><span className="task-id">TASK-{task.id.slice(-4).toUpperCase()}</span>{task.dueDate && <span className="task-due-date"><CalendarDays size={12} />{new Date(task.dueDate).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}</span>}<span className="task-avatar" title={task.assigneeName ?? "未指派"}>{task.assigneeName?.slice(0, 1) ?? "—"}</span></div>
                        </article>
                      ))}
                      <button className="add-task-inline" onClick={openCreate}><Plus size={15} />添加任务</button>
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>

        {showCreate && (
          <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCreate(); }}>
            <section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="create-task-title">
              <div className="modal-heading"><div><span className="eyebrow">NEW TASK</span><h2 id="create-task-title">创建任务</h2></div><button className="modal-close" aria-label="关闭" onClick={closeCreate}><X size={18} /></button></div>
              <form onSubmit={submitTask}>
                <label htmlFor="task-title">任务名称</label>
                <input id="task-title" autoFocus maxLength={80} placeholder="例如：整理本周产品需求" value={title} onChange={(event) => setTitle(event.target.value)} />
                <label htmlFor="task-due-date">截止日期 <span>选填</span></label>
                <input id="task-due-date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
                <label htmlFor="task-description">补充说明 <span>选填</span></label>
                <textarea id="task-description" rows={3} maxLength={500} placeholder="描述任务背景或预期结果..." value={description} onChange={(event) => setDescription(event.target.value)} />
                {error && <p className="form-error" role="alert">{error}</p>}
                <div className="modal-actions"><button type="button" className="secondary-button" onClick={closeCreate} disabled={isPending}>取消</button><button type="submit" className="primary-button" disabled={isPending || title.trim().length < 2}>{isPending ? "正在创建..." : <><Plus size={16} />创建任务</>}</button></div>
              </form>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
