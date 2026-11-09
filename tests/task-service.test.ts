import { describe, expect, it } from "vitest";
import { normalizeTaskTitle } from "@/lib/task-title";

describe("normalizeTaskTitle", () => {
  it("trims leading and trailing whitespace", () => {
    expect(normalizeTaskTitle("  Prepare release  ")).toBe("Prepare release");
  });

  it("collapses repeated spaces", () => {
    expect(normalizeTaskTitle("Prepare   release notes")).toBe("Prepare release notes");
  });

  it("keeps Chinese task titles readable", () => {
    expect(normalizeTaskTitle("  完成   首页设计  ")).toBe("完成 首页设计");
  });
});
