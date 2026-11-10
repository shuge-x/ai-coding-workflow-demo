import { expect, test } from "@playwright/test";

test("learner can create the first task from the empty board", async ({ page }) => {
  await page.goto("/");
  const emptyBoard = page.getByRole("region", { name: "空任务看板" });
  const createFirstTask = emptyBoard.getByRole("button", { name: "创建第一个任务" });

  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await expect(emptyBoard.getByRole("heading", { name: "从第一个任务开始" })).toBeVisible();
    await expect(emptyBoard.getByText("这个看板还没有任务。先写下要做的事，让团队知道下一步。")).toBeVisible();
    await expect(emptyBoard.getByText("点击后填写任务名称和说明，保存后会出现在「待处理」中。")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);

    await createFirstTask.click();
    await expect(page.getByRole("dialog", { name: "创建任务" })).toBeVisible();
    await expect(page.getByLabel("任务名称")).toBeFocused();
    await page.getByRole("button", { name: "取消", exact: true }).click();
    await expect(emptyBoard).toBeVisible();
  }

  await createFirstTask.focus();
  await page.keyboard.press("Enter");
  await page.getByLabel("任务名称").fill("整理首页需求");
  await page.getByRole("button", { name: "创建任务" }).click();
  await expect(page.getByRole("heading", { name: "整理首页需求" })).toBeVisible();
  await expect(page.getByText("1 项任务")).toBeVisible();
  await expect(emptyBoard).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole("region", { name: "待处理", exact: true }).getByRole("heading", { name: "整理首页需求" })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const status of ["待处理", "进行中", "已完成"]) {
    await expect(page.getByRole("region", { name: status, exact: true })).toBeVisible();
  }
});
