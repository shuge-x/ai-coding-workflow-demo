# TaskService 架构机会摘要

## Evidence

- 起点 `lib/task-service.ts` 混合创建、状态变化、指派权限和评论。
- `assignTask` 有独立的成员资格与角色规则；这是不同于任务生命周期和评论的变化原因。
- CodeGraph 只提供静态关系，未证明所有动态入口；删除或改名之前仍需源码与测试核对。

## Decision for this reference

选择一个边界：把指派行为移到 `lib/task-assignment.ts`，由 Server Action 直接使用。保持参数、错误语义、Prisma 数据和可观察行为不变。

## Not chosen

没有同时拆评论、改数据库、重命名全仓库或加入新业务功能。后续机会留给新的证据和单独授权。
