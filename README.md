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
