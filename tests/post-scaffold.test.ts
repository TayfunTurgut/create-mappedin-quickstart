import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { rewritePackageName, injectAttribution } from "../src/post-scaffold.js";

describe("rewritePackageName", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "test-scaffold-"));
    writeFileSync(
      join(tempDir, "package.json"),
      JSON.stringify({
        name: "mappedin-quickstart",
        version: "0.0.0",
        private: true,
        repository: "https://github.com/MappedIn/mappedin-js-quickstart",
        dependencies: { "@mappedin/mappedin-js": "^6.11.0" },
      })
    );
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("rewrites the name field", () => {
    rewritePackageName(tempDir, "my-custom-project");
    const pkg = JSON.parse(readFileSync(join(tempDir, "package.json"), "utf-8"));
    expect(pkg.name).toBe("my-custom-project");
  });

  it("preserves other fields", () => {
    rewritePackageName(tempDir, "renamed");
    const pkg = JSON.parse(readFileSync(join(tempDir, "package.json"), "utf-8"));
    expect(pkg.version).toBe("0.0.0");
  });

  it("removes private and repository fields", () => {
    rewritePackageName(tempDir, "renamed");
    const pkg = JSON.parse(readFileSync(join(tempDir, "package.json"), "utf-8"));
    expect(pkg.private).toBeUndefined();
    expect(pkg.repository).toBeUndefined();
  });

  it("keeps @mappedin/mappedin-js as a dependency (canary)", () => {
    rewritePackageName(tempDir, "renamed");
    const pkg = JSON.parse(readFileSync(join(tempDir, "package.json"), "utf-8"));
    expect(pkg.dependencies["@mappedin/mappedin-js"]).toBeDefined();
  });
});

describe("injectAttribution", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "test-attr-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("creates ATTRIBUTION.md", () => {
    injectAttribution(tempDir);
    expect(existsSync(join(tempDir, "ATTRIBUTION.md"))).toBe(true);
  });

  it("contains official repo URL", () => {
    injectAttribution(tempDir);
    const content = readFileSync(join(tempDir, "ATTRIBUTION.md"), "utf-8");
    expect(content).toContain("MappedIn/mappedin-js-quickstart");
  });

  it("contains SDK docs URL", () => {
    injectAttribution(tempDir);
    const content = readFileSync(join(tempDir, "ATTRIBUTION.md"), "utf-8");
    expect(content).toContain("developer.mappedin.com");
  });
});
