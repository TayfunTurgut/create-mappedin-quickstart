import * as p from "@clack/prompts";
import { validateProjectName, detectPackageManager } from "./utils.js";
import type { PackageManager } from "./utils.js";

export interface UserChoices {
  projectName: string;
  packageManager: PackageManager;
  initGit: boolean;
}

export async function gatherChoices(defaults: {
  projectName?: string;
  packageManager?: PackageManager;
  yes: boolean;
  skipGit: boolean;
}): Promise<UserChoices> {
  const detectedPM = defaults.packageManager ?? detectPackageManager();

  // Non-interactive mode: use defaults for everything
  if (defaults.yes) {
    const name = defaults.projectName ?? "mappedin-quickstart";
    const error = validateProjectName(name);
    if (error) {
      p.cancel(error);
      process.exit(1);
    }
    return {
      projectName: name,
      packageManager: detectedPM,
      initGit: !defaults.skipGit,
    };
  }

  // Interactive mode
  const result = await p.group(
    {
      projectName: () =>
        // A valid name passed on the command line is used as-is — don't prompt.
        defaults.projectName && !validateProjectName(defaults.projectName)
          ? Promise.resolve(defaults.projectName)
          : p.text({
              message: "What is your project name?",
              placeholder: "my-mappedin-app",
              defaultValue: defaults.projectName ?? "my-mappedin-app",
              validate: (value) => validateProjectName(value ?? ""),
            }),

      packageManager: () =>
        p.select({
          message: "Which package manager?",
          initialValue: detectedPM,
          options: [
            { value: "npm" as const, label: "npm" },
            { value: "yarn" as const, label: "yarn" },
            { value: "pnpm" as const, label: "pnpm" },
            { value: "bun" as const, label: "bun" },
          ],
        }),

      initGit: () =>
        defaults.skipGit
          ? Promise.resolve(false)
          : p.confirm({
              message: "Initialize a git repository?",
              initialValue: true,
            }),
    },
    {
      onCancel: () => {
        p.cancel("Setup cancelled.");
        process.exit(0);
      },
    }
  );

  return {
    projectName: result.projectName as string,
    packageManager: result.packageManager as PackageManager,
    initGit: result.initGit as boolean,
  };
}
