# Story 05 复杂 Bug 诊断参考工件

起点：`story-05-start-r1`。本参考在独立分支修复拖动后刷新丢失状态的问题；不把“页面暂时移动”当成持久化成功。

## 诊断证据

- 起点 `e2e/bug-repro.spec.ts` 在旧代码上失败：拖动到“已完成”后，刷新仍显示“进行中”。
- 反馈循环先观察到拖动请求 HTTP 200，说明浏览器确实触发了 Server Action。
- CodeGraph 探索 `updateTaskStatus` 到 Prisma 写入，源码核对发现服务只写 `updatedAt`，没有写入参数 `status`。
- 这支持根因：UI 乐观状态和请求成功掩盖了服务端没有持久化新状态；没有证据证明缓存是根因。

## 红到绿

```text
旧代码：PRACTICE_BUG_REPRO=1 npx playwright test e2e/bug-repro.spec.ts
结果：拖动后可见，刷新后的“已完成”断言失败

修复：updateTaskStatus 写入 data: { status }

新代码：npm run test:bug-repro
结果：1 passed；日志同时记录状态更新响应为 HTTP 200
```

修复保持最小，没有放宽断言、延长等待或只改前端显示。回归仍穿过拖拽、Server Action、Prisma 写入和刷新读取。

## 交接与限制

自动化复现和回归已验证；用户本人重新拖动并确认产品语义仍需人工验收。CodeGraph 是结构索引，关键结论已核对源码；它不证明运行时所有入口正确。宿主 `diagnosing-bugs` 菜单与完整安装流程未实测。
