import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { TEMPLATE_URL, SDK_DOCS_URL, SDK_NPM_URL, CLI_NAME } from "./utils.js";

export function rewritePackageName(
  targetDir: string,
  projectName: string
): void {
  const pkgPath = resolve(targetDir, "package.json");
  if (!existsSync(pkgPath)) return;

  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  pkg.name = projectName;

  // Remove template-specific fields that don't belong in a user project
  delete pkg.repository;
  delete pkg.bugs;
  delete pkg.homepage;
  delete pkg.private; // Ensure it's not accidentally marked private

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

export function injectAttribution(targetDir: string): void {
  const content = `# Attribution

This project was scaffolded from the official Mappedin JS Quickstart template.

- **Template Source:** ${TEMPLATE_URL}
- **SDK:** [@mappedin/mappedin-js](${SDK_NPM_URL})
- **Documentation:** ${SDK_DOCS_URL}

Scaffolded by \`${CLI_NAME}\` — an unofficial community tool.
https://www.npmjs.com/package/${CLI_NAME}
`;

  writeFileSync(resolve(targetDir, "ATTRIBUTION.md"), content);
}
