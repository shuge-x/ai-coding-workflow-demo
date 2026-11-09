import { expect, test } from "@playwright/test";

test.skip(!process.env.PRACTICE_BUG_REPRO, "Run with npm run test:bug-repro to reproduce the seeded Story 05 defect.");

test("dragging a task persists its new status after refresh", async ({ page }) => {
  await page.goto("/");
  const taskTitle = "完成看板筛选交互";
  const card = page.locator(".task-card").filter({ hasText: taskTitle });
  const doneColumn = page.locator('.kanban-column[aria-label="已完成"] .task-list');

  await expect(card).toBeVisible();
  await card.dragTo(doneColumn);
  await expect(doneColumn.getByRole("heading", { name: taskTitle })).toBeVisible();

  await page.reload();
  const reloadedDoneColumn = page.locator('.kanban-column[aria-label="已完成"] .task-list');
  await expect(reloadedDoneColumn.getByRole("heading", { name: taskTitle })).toBeVisible();
});
