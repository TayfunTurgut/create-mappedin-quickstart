import { describe, it, expect, afterEach } from "vitest";
import { mkdtempSync, existsSync, rmSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { scaffoldProject } from "../src/scaffold.js";

describe("scaffoldProject", () => {
  const tempDirs: string[] = [];

  function makeTempDir(): string {
    const dir = mkdtempSync(join(tmpdir(), "test-scaffold-"));
    tempDirs.push(dir);
    return dir;
  }

  afterEach(() => {
    for (const dir of tempDirs) {
      rmSync(dir, { recursive: true, force: true });
    }
    tempDirs.length = 0;
  });

  it("throws if target directory is non-empty", async () => {
    const dir = makeTempDir();
    const target = join(dir, "my-app");
    mkdirSync(target);
    writeFileSync(join(target, "file.txt"), "existing");

    await expect(scaffoldProject(target, "master")).rejects.toThrow(
      "already exists and is not empty"
    );
  });

  it("throws a clear network error when the template cannot be fetched", async () => {
    const dir = makeTempDir();
    const target = join(dir, "my-app");

    await expect(
      scaffoldProject(target, "this-branch-does-not-exist-xyz")
    ).rejects.toThrow("Unable to download the project template from GitHub");
  }, 30000);

  // NOTE: This test requires network access. Mark as .skip for offline CI.
  it.skip("downloads template from GitHub", async () => {
    const dir = makeTempDir();
    const target = join(dir, "my-app");

    await scaffoldProject(target, "master");

    expect(existsSync(join(target, "package.json"))).toBe(true);

    const pkg = JSON.parse(readFileSync(join(target, "package.json"), "utf-8"));
    expect(pkg.dependencies["@mappedin/mappedin-js"]).toBeDefined();
  }, 30000);
});
