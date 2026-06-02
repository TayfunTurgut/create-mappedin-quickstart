import { resolve, dirname } from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";
import pc from "picocolors";
import {
  parseArgs,
  printHelp,
  getRunCommand,
  TEMPLATE_URL,
  SDK_DOCS_URL,
  CLI_NAME,
} from "./utils.js";
import { gatherChoices } from "./prompts.js";
import { scaffoldProject } from "./scaffold.js";
import { rewritePackageName, injectAttribution } from "./post-scaffold.js";
import { runInstall } from "./install.js";
import { initGit } from "./git.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getVersion(): string {
  try {
    const pkgPath = resolve(__dirname, "..", "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return pkg.version;
  } catch {
    return "0.0.0";
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);

  // Handle --help
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  // Handle --version
  if (args.version) {
    console.log(getVersion());
    process.exit(0);
  }

  // ─── Welcome Banner ─────────────────────────────────────────────
  p.intro(`${pc.bold(CLI_NAME)} ${pc.dim(`v${getVersion()}`)}`);

  // ─── Gather User Input ──────────────────────────────────────────
  const choices = await gatherChoices({
    projectName: args.projectName,
    packageManager: args.packageManager,
    yes: args.yes,
    skipGit: args.skipGit,
  });

  const targetDir = resolve(process.cwd(), choices.projectName);

  // ─── Download Template ──────────────────────────────────────────
  const s = p.spinner();
  s.start("Downloading template from MappedIn/mappedin-js-quickstart...");

  try {
    await scaffoldProject(targetDir, args.template);
    s.stop("Template downloaded.");
  } catch (err) {
    s.stop("Download failed.");
    p.cancel(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  // ─── Post-scaffold ──────────────────────────────────────────────
  rewritePackageName(targetDir, choices.projectName);
  injectAttribution(targetDir);

  // ─── Install Dependencies ───────────────────────────────────────
  if (!args.skipInstall) {
    s.start(`Installing dependencies with ${choices.packageManager}...`);
    try {
      runInstall(targetDir, choices.packageManager);
      s.stop("Dependencies installed.");
    } catch {
      s.stop("Install failed — you can run it manually.");
    }
  }

  // ─── Initialize Git ─────────────────────────────────────────────
  if (choices.initGit) {
    const gitOk = initGit(targetDir);
    if (gitOk) {
      p.log.success("Git repository initialized.");
    }
  }

  // ─── Success Message ────────────────────────────────────────────
  const runCmd = getRunCommand(choices.packageManager);

  let nextSteps = `cd ${choices.projectName}\n`;
  if (args.skipInstall) {
    nextSteps += `${
      choices.packageManager === "yarn"
        ? "yarn"
        : `${choices.packageManager} install`
    }\n`;
  }
  nextSteps += runCmd;

  p.note(nextSteps, "Next steps");

  p.log.info(`${pc.dim("Template source:")} ${pc.underline(TEMPLATE_URL)}`);
  p.log.info(`${pc.dim("SDK docs:")}        ${pc.underline(SDK_DOCS_URL)}`);

  p.outro(`${pc.green("You're all set!")} ${pc.dim("Happy mapping 🗺️")}`);
}

main().catch((err) => {
  console.error(pc.red("Unexpected error:"), err);
  process.exit(1);
});
