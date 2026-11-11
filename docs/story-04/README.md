# Story 04 Wayfinder 参考工件

起点：story-04-start-r1。仅增加地图、决策票、资料与独立实验。app / lib / prisma 保持原样。

## 当前事实
Project.teamId 连接 Team；HomePage 仍读取第一个 Project；创建/状态动作没有可信的租户请求上下文。关系存在不等于已经实现隔离。

## 跟做
1. 独立目录启动基线并核对事实。初始化的 seed 会重置当前项目任务，请勿用于自己的数据库。
2. 使用 /wayfinder 创建 [地图](../../.scratch/multi-team/map.md) 和单独决策票，不按数据库/API/前端拆开发票。
3. 先处理无阻塞前沿。资料调查见 [调研](isolation-research.md)；只有实际需求方可以关闭 HITL 决策票。
4. 用 python3 experiments/tenant-scope.py 运行临时 SQLite 反例，比较有无租户过滤，并尝试伪造跨租户外键。
5. 把实验结果作为讨论证据：不能据此宣布业务应用安全、生产 RLS 已配置或迁移可用。
6. 仍有开放票时，停在决策地图。等关键决定确实批准后，才使用 /to-spec、/to-tickets，并单独决定实施。

## 实验记录
Python 标准库 sqlite3，内存库，PRAGMA foreign_keys=ON；固定两个租户与两条任务。实测：无过滤读取泄露对方任务；过滤读取拒绝且同租户正常；复合外键拒绝伪造归属。实验不包含身份校验、后台任务、缓存、导出、PostgreSQL 或应用迁移。

## 交接状态
资料调查：已完成。候选实验：已运行。HITL 决策：待真实交流。ADR / 实施 Spec / Tickets：未生成。Wayfinder Destination：未达到。宿主 Skill 菜单与完整安装：未实测。
