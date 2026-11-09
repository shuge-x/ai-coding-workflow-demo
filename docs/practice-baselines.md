# Practice baseline status

Each practice route starts from an immutable Git tag. Use a fresh clone or separate worktree for each story so one exercise cannot contaminate another.

## Published start points

| Tag | Route | Starting state | Commit |
|---|---|---|---|
| `story-01-start` | Quick change | Empty task board with a deliberately basic empty state | `b05ed957` |
| `story-02-start` | Requirements discovery | Tasks have due dates; no reminder rules or reminder behavior exist | `0e74e909` |
| `story-03-start` | Feature development | Project members and roles exist; task assignment is not implemented | `234d9b57` |
| `story-04-start` | Large architecture | One Team / one Project; no tenant-aware request or data isolation | `ea966dcf` |
| `story-05-start` | Complex bug diagnosis | Drag-and-drop looks successful, but the status is not persisted | `25e30219` |
| `story-06-start` | Safe refactoring | TaskService handles task lifecycle, assignment, permissions and comments | `3f62257b` |

The tags are annotated and point to exact immutable commits. The [manual baseline matrix workflow](https://github.com/shuge-x/ai-coding-workflow-demo/actions/workflows/manual-practice-baselines.yml) verifies all six baselines. Story 05 additionally proves that its reproduction test fails for the expected persistence symptom; Story 06 proves that existing assignment behavior is protected.

## Fresh start

Use a fresh clone or a separate worktree for each route:

```bash
git clone https://github.com/shuge-x/ai-coding-workflow-demo.git
cd ai-coding-workflow-demo
git fetch --tags
git checkout story-01-start
npm install
cp .env.example .env
npm run db:push
PRACTICE_BASELINE=01 npm run db:seed
npm run dev
```

For another story, change both the tag and seed profile. For example, Story 05:

```bash
git checkout story-05-start
PRACTICE_BASELINE=05 npm run db:reset
npm run dev
```

In a second terminal, run the deliberately failing reproduction test:

```bash
npm run test:bug-repro
```

Story 06 uses:

```bash
git checkout story-06-start
PRACTICE_BASELINE=06 npm run db:reset
npm run dev
```

Then run `npm run test:assignment` to confirm the existing behavior before attempting the refactor.

Do not use one modified working directory for multiple stories. The SQLite database is local to the checked-out version.
