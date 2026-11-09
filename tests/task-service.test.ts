import { describe, expect, it } from "vitest";

function normalizeTaskTitle(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

describe("task title normalization", () => {
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
