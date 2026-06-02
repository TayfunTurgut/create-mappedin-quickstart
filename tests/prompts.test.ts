import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @clack/prompts so we can drive gatherChoices without a TTY.
vi.mock("@clack/prompts", () => {
  const text = vi.fn(async (opts: any) => opts.defaultValue ?? "prompted-name");
  const select = vi.fn(async (opts: any) => opts.initialValue ?? "npm");
  const confirm = vi.fn(async (opts: any) => opts.initialValue ?? true);
  // Mimic clack's group: call each thunk in order, collecting results.
  const group = vi.fn(async (prompts: Record<string, any>) => {
    const results: Record<string, unknown> = {};
    for (const key of Object.keys(prompts)) {
      results[key] = await prompts[key]({ results });
    }
    return results;
  });
  return {
    text,
    select,
    confirm,
    group,
    cancel: vi.fn(),
    isCancel: () => false,
  };
});

import * as p from "@clack/prompts";
import { gatherChoices } from "../src/prompts.js";

describe("gatherChoices — project name from CLI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does NOT prompt for the name when a valid one is passed (interactive mode)", async () => {
    const choices = await gatherChoices({
      projectName: "my-project",
      yes: false,
      skipGit: false,
    });

    expect(p.text).not.toHaveBeenCalled();
    expect(choices.projectName).toBe("my-project");
  });

  it("prompts for the name when none is passed (interactive mode)", async () => {
    const choices = await gatherChoices({
      yes: false,
      skipGit: false,
    });

    expect(p.text).toHaveBeenCalledTimes(1);
    expect(choices.projectName).toBeTruthy();
  });

  it("prompts for the name when the passed value is invalid", async () => {
    const choices = await gatherChoices({
      projectName: "bad name with spaces",
      yes: false,
      skipGit: false,
    });

    expect(p.text).toHaveBeenCalledTimes(1);
    expect(choices.projectName).toBeTruthy();
  });
});
