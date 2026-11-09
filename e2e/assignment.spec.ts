import { expect, test } from "@playwright/test";

test.skip(!process.env.PRACTICE_ASSIGNMENT_TEST, "Run with npm run test:assignment to verify the Story 06 behavior baseline.");

test("project owner can assign a task to a project member", async ({ page }) => {
  await page.goto("/");
  const taskTitle = "完成看板筛选交互";
  const assignee = page.getByLabel(taskTitle + "负责人");

  await expect(assignee).toBeVisible();
  await assignee.selectOption("user-chen");
  await expect(assignee).toHaveValue("user-chen");

  await page.reload();
  await expect(page.getByLabel(taskTitle + "负责人")).toHaveValue("user-chen");
});
