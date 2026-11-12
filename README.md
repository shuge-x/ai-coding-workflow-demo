# Team Task Board

A small, runnable project-management app used by the **AI Coding Workflow Lab** practice courses.

The purpose of this repository is educational: each practice route starts from a known Git tag so learners can practice independently without inheriting changes from another exercise.

## Prerequisites

- Node.js 22 LTS
- npm 10+

## Getting started

```bash
npm install
cp .env.example .env
node -e "require('fs').closeSync(require('fs').openSync('prisma/dev.db','a'))"
npm run db:push
PRACTICE_BASELINE=01 npm run db:seed
npm run dev
```

Open http://localhost:3000.

## Useful commands

```bash
npm run dev          # start the local app
npm run build        # production build
npm run lint         # ESLint
npm run test         # unit and integration tests
npm run test:e2e     # Playwright browser tests
npm run test:bug-repro # intentionally failing Story 05 reproduction
npm run test:assignment # Story 06 assignment behavior checks
npm run db:push      # sync Prisma schema to local SQLite
npm run db:seed      # create demo data
npm run db:reset     # reset local database and reseed
```

## Practice story starting points

Each tag is an independent starting point. Start each exercise in a fresh clone or worktree.

| Tag | Practice route | Starting state |
|---|---|---|
| `story-01-start-r1` | Quick change | Empty board with an intentionally weak empty state |
| `story-02-start-r1` | Requirements discovery | Tasks have due dates; reminder behavior is not specified |
| `story-03-start-r1` | Feature development | Projects and members exist; task assignment is not implemented |
| `story-04-start-r1` | Large architecture | Single-team assumptions are explicit; multi-team SaaS is not implemented |
| `story-05-start-r1` | Complex bug diagnosis | Dragging a task updates the UI but does not persist the status |
| `story-06-start-r1` | Safe refactoring | TaskService owns several responsibilities and has behavior tests |

The `-r1` tags are the recommended learner starting points and contain runnable baseline browser checks. The original tags remain published as historical baselines. All annotated tags point to immutable commits listed in `docs/practice-baselines.md`. Story 02 and later use a matching seed profile, e.g. `PRACTICE_BASELINE=02 npm run db:seed`. The published baseline matrix verifies setup, tests, browser smoke checks, the Story 05 expected-red reproduction, and Story 06 behavior protection.

## Reference examples

课程网站 04 工作流实战会链接到独立的参考 Tag。参考实现不合并到 `main`，每个 Tag 都保留对应故事的独立起点和交接工件：

| Story | Reference Tag | 内容 |
|---|---|---|
| 01 | `story-01-example-r1` | 空状态快速修改与浏览器证据 |
| 02 | `story-02-example-r1` | 需求探索术语、访谈和候选基线 |
| 03 | `story-03-example-r1` | 任务指派纵向切片与权限验证 |
| 04 | `story-04-example-r1` | Wayfinder 决策地图、隔离研究与实验 |
| 05 | `story-05-example-r2` | 拖拽状态持久化 Bug 修复与根因记录 |
| 06 | `story-06-example-r3` | TaskService 指派边界重构与行为保持 |

`verify-practice-examples.yml` 会按这个矩阵检查文档链接、应用构建、浏览器旅程和参考工件实验。参考 Tag 的自动化通过不等于用户本人完成 Human Accepted。

## Tech stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Prisma + SQLite
- Vitest + Testing Library
- Playwright

This stack is chosen to keep the teaching project easy to run locally. It is not a universal recommendation for all AI coding projects.

## Learning resources

- [AI Coding Workflow Lab](https://shuge-x.github.io/ai-engineering-lab/)
- [Matt Pocock Skills](https://github.com/mattpocock/skills)
- [CodeGraph](https://github.com/colbymchenry/codegraph)

## License

MIT
