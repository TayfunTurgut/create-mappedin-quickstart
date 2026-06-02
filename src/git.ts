import { execSync } from "node:child_process";

function isGitInstalled(): boolean {
  try {
    execSync("git --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function initGit(targetDir: string): boolean {
  if (!isGitInstalled()) return false;

  try {
    execSync("git init", { cwd: targetDir, stdio: "ignore" });
    execSync("git add -A", { cwd: targetDir, stdio: "ignore" });
    execSync('git commit -m "Initial commit from create-mappedin-quickstart"', {
      cwd: targetDir,
      stdio: "ignore",
    });
    return true;
  } catch {
    // git init can fail in nested repos, CI environments, etc. Non-fatal.
    return false;
  }
}
