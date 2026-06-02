import { describe, it, expect } from "vitest";
import { validateProjectName, parseArgs } from "../src/utils.js";

describe("validateProjectName", () => {
  it("rejects empty string", () => {
    expect(validateProjectName("")).toBeDefined();
  });

  it("rejects names with spaces", () => {
    expect(validateProjectName("my project")).toBeDefined();
  });

  it("rejects names starting with dot", () => {
    expect(validateProjectName(".hidden")).toBeDefined();
  });

  it("rejects names starting with underscore", () => {
    expect(validateProjectName("_private")).toBeDefined();
  });

  it("accepts valid names", () => {
    expect(validateProjectName("my-project")).toBeUndefined();
    expect(validateProjectName("my_project")).toBeUndefined();
    expect(validateProjectName("myProject123")).toBeUndefined();
    expect(validateProjectName("my.project")).toBeUndefined();
  });
});

describe("parseArgs", () => {
  const base = ["node", "script"];

  it("parses project name as first positional arg", () => {
    const args = parseArgs([...base, "my-app"]);
    expect(args.projectName).toBe("my-app");
  });

  it("parses --yes flag", () => {
    const args = parseArgs([...base, "--yes"]);
    expect(args.yes).toBe(true);
  });

  it("parses -y shorthand", () => {
    const args = parseArgs([...base, "-y"]);
    expect(args.yes).toBe(true);
  });

  it("parses --skip-install", () => {
    const args = parseArgs([...base, "--skip-install"]);
    expect(args.skipInstall).toBe(true);
  });

  it("parses --skip-git", () => {
    const args = parseArgs([...base, "--skip-git"]);
    expect(args.skipGit).toBe(true);
  });

  it("parses --pm with value", () => {
    const args = parseArgs([...base, "--pm", "pnpm"]);
    expect(args.packageManager).toBe("pnpm");
  });

  it("parses --template with value", () => {
    const args = parseArgs([...base, "--template", "v2"]);
    expect(args.template).toBe("v2");
  });

  it("parses combined flags", () => {
    const args = parseArgs([...base, "my-app", "-y", "--skip-git", "--pm", "bun"]);
    expect(args.projectName).toBe("my-app");
    expect(args.yes).toBe(true);
    expect(args.skipGit).toBe(true);
    expect(args.packageManager).toBe("bun");
  });
});
