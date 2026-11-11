# 多团队 SaaS 决策地图

Label: wayfinder:map

## Destination
在租户语义、可信身份、隔离和迁移回滚都有经真实需求方确认的结论后，交付可实施架构规格。当前尚未到达。

## Notes
本地图是课程作者提供的本地 Markdown 参考，不是已发布的线上 Issue。先问问题再实施；HITL 票必须经过真实交流，不由作者示例答案代替。基线 story-04-start-r1 只具备 Team 外键，不具备请求隔离。

## Decisions so far
- [数据库隔离能力调研](issues/02-database-capabilities.md)：资料与源码事实已归档；没有选择最终方案。

## Not yet specified
- 决策推进后再细化成员退出、附件、后台任务和导出数据的所有权。
- 跨租户审计粒度与迁移演练资源，依赖前沿决策。

## Out of scope
计费、商业套餐、一次性生产上线；本参考不修改业务 Schema 或实现多租户系统。

前沿：开放、未阻塞、未领取的子票。当前是 [租户到底是什么](issues/01-tenant-meaning.md)。开放票从子票状态/依赖查找，不塞进 Decisions so far。
