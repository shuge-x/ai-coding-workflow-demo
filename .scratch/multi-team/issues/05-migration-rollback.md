# 旧数据迁移与失败回滚

Label: wayfinder:grilling
Parent: [多团队 SaaS 决策地图](../map.md)
Status: open；未领取
Blocked by: 03：选择隔离策略；04：请求如何得到可信租户身份

## Question
旧数据归属如何回填、如何查漏和在写入切换后回滚？

## Exit criteria
明确清点、备份、双读/写边界、校验与回滚判定；在副本演练，不改生产。

当前没有真实需求方的批准记录，保持开放；不可进入实施。
