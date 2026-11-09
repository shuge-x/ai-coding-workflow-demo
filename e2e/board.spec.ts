import { expect, test } from "@playwright/test";

test("learner can open the seeded task board baseline", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "产品研发看板" })).toBeVisible();
  await expect(page.locator(".board-content")).toBeVisible();
});
