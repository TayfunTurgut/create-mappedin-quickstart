import pc from "picocolors";

// ─── Constants ───────────────────────────────────────────────────────
export const TEMPLATE_REPO = "MappedIn/mappedin-js-quickstart";
export const TEMPLATE_BRANCH = "master";
export const TEMPLATE_SOURCE = `gh:${TEMPLATE_REPO}#${TEMPLATE_BRANCH}`;
export const TEMPLATE_URL = `https://github.com/${TEMPLATE_REPO}`;
export const SDK_DOCS_URL = "https://developer.mappedin.com/web-sdk/getting-started";
export const SDK_NPM_URL = "https://www.npmjs.com/package/@mappedin/mappedin-js";
export const CLI_NAME = "create-mappedin-quickstart";

// ─── Validation ──────────────────────────────────────────────────────
export function validateProjectName(name: string): string | undefined {
  if (!name || name.trim().length === 0) {
    return "Project name is required.";
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
    return "Project name can only contain letters, numbers, hyphens, dots, and underscores.";
  }
  if (name.startsWith(".") || name.startsWith("_")) {
    return "Project name cannot start with a dot or underscore.";
  }
  return undefined; // valid
}

// ─── Argument Parsing ────────────────────────────────────────────────
export interface CliArgs {
  projectName?: string;
  yes: boolean;
  skipInstall: boolean;
  skipGit: boolean;
  packageManager?: "npm" | "yarn" | "pnpm" | "bun";
  template: string;
  help: boolean;
  version: boolean;
}

export function parseArgs(argv: string[]): CliArgs {
  const args = argv.slice(2); // remove node + script path
  const result: CliArgs = {
    yes: false,
    skipInstall: false,
    skipGit: false,
    template: TEMPLATE_BRANCH,
    help: false,
    version: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--yes":
      case "-y":
        result.yes = true;
        break;
      case "--skip-install":
        result.skipInstall = true;
        break;
      case "--skip-git":
        result.skipGit = true;
        break;
      case "--pm":
      case "--package-manager":
        result.packageManager = args[++i] as CliArgs["packageManager"];
        break;
      case "--template":
        result.template = args[++i];
        break;
      case "--help":
      case "-h":
        result.help = true;
        break;
      case "--version":
      case "-v":
        result.version = true;
        break;
      default:
        if (!arg.startsWith("-") && !result.projectName) {
          result.projectName = arg;
        }
        break;
    }
  }

  return result;
}

// ─── Help Text ───────────────────────────────────────────────────────
export function printHelp(): void {
  console.log(`
  ${pc.bold(CLI_NAME)} — Scaffold a Mappedin JS project in one command.
  ${pc.dim("Unofficial community tool. Template from:")} ${pc.underline(TEMPLATE_URL)}

  ${pc.bold("Usage:")}
    npm create mappedin-quickstart [project-name] [options]

  ${pc.bold("Options:")}
    -y, --yes              Skip prompts, use defaults
    --skip-install         Don't install dependencies
    --skip-git             Don't initialize git
    --pm <manager>         Package manager: npm | yarn | pnpm | bun
    --template <ref>       Git branch or tag (default: ${TEMPLATE_BRANCH})
    -v, --version          Print version
    -h, --help             Print this help

  ${pc.bold("Examples:")}
    npm create mappedin-quickstart my-map
    npm create mappedin-quickstart my-map --pm yarn --skip-git
    npm create mappedin-quickstart my-map -y
`);
}

// ─── Package Manager Detection ───────────────────────────────────────
export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export function detectPackageManager(): PackageManager {
  const agent = process.env.npm_config_user_agent;
  if (!agent) return "npm";

  if (agent.startsWith("yarn")) return "yarn";
  if (agent.startsWith("pnpm")) return "pnpm";
  if (agent.startsWith("bun")) return "bun";
  return "npm";
}

export function getInstallCommand(pm: PackageManager): string {
  return pm === "yarn" ? "yarn" : `${pm} install`;
}

export function getRunCommand(pm: PackageManager): string {
  return pm === "npm" ? "npm run dev" : `${pm} dev`;
}
