import { describe, expect, it } from "vitest";
import { normalizeTaskTitle } from "../lib/task-title";

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

import { canAssignTask } from "../lib/task-rules";

describe("task assignment permissions", () => {
  it("allows an owner to assign a project member", () => {
    expect(canAssignTask("OWNER", true)).toBe(true);
  });

  it("allows a manager to assign a project member", () => {
    expect(canAssignTask("MANAGER", true)).toBe(true);
  });

  it("does not allow a regular member to assign tasks", () => {
    expect(canAssignTask("MEMBER", true)).toBe(false);
  });

  it("does not allow assigning someone outside the project", () => {
    expect(canAssignTask("OWNER", false)).toBe(false);
  });

  it("does not allow an unknown role to assign tasks", () => {
    expect(canAssignTask(undefined, true)).toBe(false);
  });
});
