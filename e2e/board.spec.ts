import { expect, test } from "@playwright/test";

test("learner can create the first task from the empty board", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "让第一个好点子落地" })).toBeVisible();
  await page.getByRole("button", { name: "创建第一个任务" }).click();
  await page.getByLabel("任务名称").fill("整理首页需求");
  await page.getByRole("button", { name: "创建任务" }).click();
  await expect(page.getByRole("heading", { name: "整理首页需求" })).toBeVisible();
  await expect(page.getByText("1 项任务")).toBeVisible();
});
