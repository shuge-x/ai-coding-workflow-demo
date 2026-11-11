# Story 04：多租户隔离候选方案研究

核对日期：2026-11-11。适用对象：`story-04-start-r1`、Prisma ORM 6、SQLite；RLS 比较依据 PostgreSQL 18 文档。状态：研究工件，尚无用户批准的隔离方案；不代表 HITL 决策票已完成。

## 当前代码事实

- `prisma/schema.prisma` 已有 Team → Project → Task 关系；Membership 属于 Project，尚无 Team 成员关系。
- `app/page.tsx` 直接读取最早创建的 Project，没有请求身份或租户条件。
- `app/actions.ts` 接收客户端 projectId；所读创建链路没有认证或跨团队访问校验。

因此，存在 Team 关联不能证明应用已隔离；这是对上述入口的源码核对，不是全系统安全审计。

## 文档事实与候选方案

| 候选方案 | 可提供的保护 | 不能据此保证的事情 |
|---|---|---|
| 应用层租户范围 | 本案例可把经认证、授权得到的租户条件加入每次读取和写入；这是设计建议 | 漏加条件、后台作业、原始 SQL、缓存或其他入口仍可能绕过；只信客户端 tenantId 不构成授权 |
| 含租户键的复合外键 | 在约束启用且键非空时，可拒绝“租户 A 的任务引用租户 B 项目”的不一致数据 | 外键约束不决定谁能读取合法行，不能替代请求授权 |
| PostgreSQL RLS | 可对普通查询及行级写操作施加策略；启用后无策略则默认拒绝 | 表所有者通常绕过，超级用户及 BYPASSRLS 角色绕过；不能把管理员连接的成功测试当成隔离证明 |

SQLite 支持复合外键，父键须满足对应的唯一约束；需逐连接启用外键，且子键包含 NULL 时可能不要求匹配。实验应显式启用约束并使用非空租户键。[SQLite 官方外键说明](https://www.sqlite.org/foreignkeys.html)

Prisma 6 支持组合标识/唯一约束及对应的唯一查询条件；这些能力提供建模与定位手段，不会自动建立业务授权。[Prisma 6 组合标识](https://www.prisma.io/docs/orm/v6/prisma-client/special-fields-and-types/working-with-composite-ids-and-constraints)

RLS 需要同时检查可见行和新值约束，并使用预期应用角色验证；以上绕过边界来自官方规则。[PostgreSQL 18 RLS](https://www.postgresql.org/docs/18/ddl-rowsecurity.html)

## 推断、建议与下一步证据

建议先明确 Tenant 与 Team 是否同义、用户能否跨团队、当前租户从何处可信取得，再比较隔离方案。若选 RLS，应在实际连接池与事务方式下测试 A/B 租户交替请求、缺失上下文、失败重试、后台任务及管理员例外；本次未运行 PostgreSQL 或连接池实验。

SQLite → PostgreSQL 不能视为只改 provider：Prisma Migrate 的 SQL 按数据库生成，不能共用两种 provider 的迁移历史。[Prisma 6 迁移限制](https://www.prisma.io/docs/orm/v6/prisma-migrate/understanding-prisma-migrate/limitations-and-known-issues)

迁移方案仍需在复制数据上验证字段/时间语义、现有行的租户归属、空值与孤儿行、行数及关联完整性、并发写入窗口、备份恢复和回滚后的数据收敛。这里只列待验证问题，未执行迁移或生产恢复，也未批准采用 PostgreSQL。SQLite 隔离小实验只能支持其测试条件下的结论，不能证明本应用或生产租户安全。
