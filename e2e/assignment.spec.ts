import { expect, test } from "@playwright/test";

test("Owner can assign a member and the assignment survives reload", async ({ page }) => {
  await page.goto("/");
  const assignee = page.getByLabel("完成看板筛选交互负责人");
  await expect(assignee).toBeVisible({ timeout: 4000 });
  await assignee.selectOption("user-chen");
  await expect(page.getByRole("status")).toHaveText("负责人已保存");
  await page.reload();
  await expect(page.getByLabel("完成看板筛选交互负责人")).toHaveValue("user-chen");
});

test("member can filter own assignments without changing responsibility", async ({ page }) => {
  await page.goto("/");
  const assignee = page.getByLabel("完成看板筛选交互负责人");
  await assignee.selectOption("user-zhou");
  await expect(page.getByRole("status")).toHaveText("负责人已保存");
  await Promise.all([page.waitForEvent("load"), page.getByLabel("教学身份").selectOption("user-zhou")]);
  await expect(page.getByLabel("教学身份")).toHaveValue("user-zhou");
  await page.getByRole("button", { name: "仅看我的任务" }).click({ timeout: 4000 });
  await expect(page.getByRole("heading", { name: "完成看板筛选交互" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "更新产品帮助文档" })).toHaveCount(0);
  await expect(page.getByLabel("完成看板筛选交互负责人")).toBeDisabled();
  await page.getByRole("button", { name: "仅看我的任务" }).click();
  await expect(page.getByRole("heading", { name: "更新产品帮助文档" })).toBeVisible();
});

test("Manager can change and clear responsibility on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await Promise.all([page.waitForEvent("load"), page.getByLabel("教学身份").selectOption("user-chen")]);
  await expect(page.getByLabel("教学身份")).toHaveValue("user-chen");
  const assignee = page.getByLabel("完成看板筛选交互负责人");
  await assignee.selectOption("user-lin");
  await expect(page.getByRole("status")).toHaveText("负责人已保存");
  await assignee.selectOption("");
  await expect(page.getByRole("status")).toHaveText("负责人已保存");
  await expect(assignee).toHaveValue("");
  await page.reload();
  await expect(page.getByLabel("完成看板筛选交互负责人")).toHaveValue("");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
});
