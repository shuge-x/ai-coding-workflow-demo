# Story 03 跟做与交接

起点：story-03-start-r1。参考在独立分支实施，不依赖 Story 01 / 02。

1. 新 clone 后切换起点并建分支，执行课程准备命令。seed 会清空当前项目任务，只在独立练习目录操作。
2. 先核对模型已有 User / Membership / role，但没有 Task.assignee。
3. 主动运行 /to-spec，使用课程 Prompt；核对 [Spec](../../.scratch/task-assignment/spec.md) 的规则与测试入口。参考只是作者工件，实际练习需要自己的认可记录。
4. /to-tickets 后先检查粒度与依赖，再批准实施。[Ticket 01](../../.scratch/task-assignment/issues/01-assign-member.md) 是完整指派旅程，[Ticket 02](../../.scratch/task-assignment/issues/02-my-tasks.md) 才增加筛选；逐票 /implement。
5. 浏览器测试必须先在缺少行为时失败，再实现；只出现控件不等于刷新后持久化正确。
6. 用教学身份切换 Owner / Manager / Member，实际操作后单独确认 Human Accepted。

## 已执行证据与限制
- Ticket 01 的 Playwright 在旧版本因负责人控件不存在失败；新增持久化链路后通过。
- Ticket 02 在没有筛选按钮时失败。后续发现身份切换会重载页面，测试需等待重载，不能将旧页面的临时选择当成新身份已生效。
- 权限集成检查使用独立 assignment-test.db；不使用 mock，也不清空学习者的 dev.db。
- 原生 /to-spec、/to-tickets、/implement 的宿主菜单及完整安装流程未实测。本次是按上游规则手工实现并归档证据。
- Human Accepted：待用户本人操作；不与浏览器自动化混为一谈。

## 复测

先完成 Prisma 初始化，再运行 npm run test:assignment-service、npm test、npm run typecheck、npm run lint、npm run build。关闭 build 后的旧 dev 进程，再用 PRACTICE_BASELINE=03 npm run db:seed 还原练习数据并运行 npm run test:e2e；seed 会清空该项目已有任务。
