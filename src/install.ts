import { execSync } from "node:child_process";
import type { PackageManager } from "./utils.js";
import { getInstallCommand } from "./utils.js";

export function runInstall(
  targetDir: string,
  packageManager: PackageManager
): void {
  const command = getInstallCommand(packageManager);

  execSync(command, {
    cwd: targetDir,
    stdio: "inherit", // Show install output in the user's terminal
  });
}
