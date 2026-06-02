import { downloadTemplate } from "giget";
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { TEMPLATE_REPO, TEMPLATE_URL } from "./utils.js";

export async function scaffoldProject(
  targetDir: string,
  templateRef: string
): Promise<void> {
  const source = `gh:${TEMPLATE_REPO}#${templateRef}`;

  // Check if target directory already exists and is non-empty
  if (existsSync(targetDir)) {
    const entries = await readdir(targetDir);
    if (entries.length > 0) {
      throw new Error(
        `Directory "${targetDir}" already exists and is not empty.`
      );
    }
  }

  try {
    await downloadTemplate(source, {
      dir: targetDir,
      force: false,
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(
      [
        "Unable to download the project template from GitHub.",
        "",
        `This tool requires network access to ${TEMPLATE_URL}.`,
        "On a corporate network, a proxy, VPN, or firewall may be blocking the request.",
        "If your environment uses a proxy, set HTTP_PROXY / HTTPS_PROXY and try again.",
        "",
        `Details: ${detail}`,
      ].join("\n")
    );
  }
}
