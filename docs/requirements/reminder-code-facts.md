# Story 02 起始代码事实与未知

核对对象为不可变起点 `story-02-start-r1`，提交 `46d98d66aa90c0a65b85f14ccb0c26a3841583d8`。本记录基于源码读取，不是提醒功能的运行验收报告。

## 代码事实

| 事实 | 证据 |
|---|---|
| 数据模型只定义 Project 与 Task；没有用户、负责人或收件人关系 | prisma/schema.prisma |
| Task 的截止日期可为空，持久化类型包含日期和时间 | prisma/schema.prisma 中 dueDate |
| 界面使用日期输入，创建时附加 T12:00:00 再构造日期值 | app/components/task-board.tsx；app/actions.ts |
| PRACTICE_BASELINE=02 的 seed 创建 4 个带截止日期的任务，其中一个是已完成且截止日期在过去 | prisma/seed.ts |
| 当前任务服务只提供任务创建；所读链路没有提醒排程或投递行为 | app/actions.ts；lib/task-service.ts |
| 现有浏览器 smoke 只检查看板可打开 | e2e/board.spec.ts |

## 推断与边界

- 不能从 T12:00:00 推导出“用户希望中午提醒”或“业务时区已经确定”。
- 任务卡片、示例头像或通知图标，不能作为真实账户、任务负责人或邮箱已经实现的证据。
- 提醒订阅、收件地址和偏好是本轮要讨论的概念，不能当作已存在的数据关系。

## 可以复核的命令

```bash
git show story-02-start-r1:prisma/schema.prisma
git show story-02-start-r1:app/actions.ts
git show story-02-start-r1:prisma/seed.ts
git show story-02-start-r1:e2e/board.spec.ts
```

所有提醒对象、时间、渠道、频率和关闭规则，在真实用户回答前都属于未知。
