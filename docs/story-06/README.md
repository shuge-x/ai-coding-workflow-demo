# Story 06 安全重构参考工件

起点：`story-06-start-r1`。目标是保持外部行为，先用 CodeGraph 找到一个高价值边界，再做单一重构。

## 架构机会

CodeGraph 1.6.2 的起点探索显示：`TaskService` 同时包含任务生命周期、指派权限、评论持久化；`assignTask` 的调用来自 Server Action，且起点没有对应行为测试。源码核对后选择把“指派任务”作为一个深模块接口移动到 `lib/task-assignment.ts`：调用方只需要知道指派行为和错误语义，不需要和任务创建、状态、评论实现放在同一模块。

这不是按文件机械拆分，也没有改变 Schema、权限规则或用户可见行为。`app/actions.ts` 改为从新模块调用 `assignTask`；其余 TaskService 行为保持原位置。

## 行为保护

`npm run test:behavior` 使用独立 `behavior-test.db`，通过公共服务接口验证：

- 任务标题规范化与初始状态；
- 状态更新；
- 成员评论创建、读取与非成员拒绝；
- Owner 指派、Manager 更换/清空；
- Member、非成员、非项目成员目标和不存在任务的错误。

`npm test`、`npm run typecheck`、`npm run lint` 和 `npm run build` 也必须执行。测试通过不等于用户完成 Human Accepted。

## 交接

重构前后的行为证据使用同一 `test:behavior` seam。CodeGraph 结果仍需和源码核对；动态入口、配置、生产数据库和宿主 Skill 菜单未实测。Retro 建议保持在本文件，不追加全局规范。
