# Practice baseline status

This file records the verified start points for the six learning routes.

A start tag is not published merely because the application builds. It must have:
1. A clean clone / checkout path.
2. A deterministic database seed.
3. The intended scenario state.
4. A successful local setup and CI run.
5. A short verification checklist.

| Tag | Route | Required baseline | Status |
|---|---|---|---|
| `story-01-start` | Quick change | Empty task board; intentionally basic empty state | In preparation |
| `story-02-start` | Requirements discovery | Existing due-date field and tasks; reminder rules deliberately undefined | Planned |
| `story-03-start` | Feature development | Projects and memberships exist; assignment workflow is absent | Planned |
| `story-04-start` | Large architecture | Single-team / single-project assumptions documented | Planned |
| `story-05-start` | Complex bug diagnosis | Drag-and-drop UI changes optimistically; persisted status remains unchanged | Planned |
| `story-06-start` | Safe refactoring | TaskService contains multiple responsibilities; behavior tests pass | Planned |

## Fresh start

Once the tags are published, use a fresh clone or a separate worktree for each route:

```bash
git fetch --tags
git checkout story-01-start
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Do not use one modified working directory for multiple stories. The browser database is local to the checked-out version.
