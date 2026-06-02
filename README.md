# create-mappedin-quickstart

> **Unofficial community tool** — scaffolds a [Mappedin JS](https://developer.mappedin.com/web-sdk/getting-started) indoor mapping project in one command.

Template source: [MappedIn/mappedin-js-quickstart](https://github.com/MappedIn/mappedin-js-quickstart)

## Quick Start

```bash
# npm
npm create mappedin-quickstart my-project

# yarn
yarn create mappedin-quickstart my-project

# pnpm
pnpm create mappedin-quickstart my-project

# bun
bun create mappedin-quickstart my-project
```

Then:

```bash
cd my-project
npm run dev
```

A 3D rendered indoor map opens at `http://localhost:5173`. Zoom, pan, and rotate to explore.

## What You Get

A ready-to-run Vite + TypeScript project with:

- `index.html` — page shell with the map container
- `src/main.ts` — loads a demo Mappedin map via `@mappedin/mappedin-js`
- `package.json` — all dependencies pre-installed
- `ATTRIBUTION.md` — credits to the official Mappedin repo

## Options

| Flag | Description | Default |
|---|---|---|
| `-y, --yes` | Skip all prompts | `false` |
| `--skip-install` | Don't install dependencies | `false` |
| `--skip-git` | Don't initialize git | `false` |
| `--pm <manager>` | npm, yarn, pnpm, or bun | Auto-detect |
| `--template <ref>` | Git branch or tag | `master` |

## How It Works

This CLI downloads the latest template from the official [MappedIn/mappedin-js-quickstart](https://github.com/MappedIn/mappedin-js-quickstart) GitHub repository using [giget](https://github.com/unjs/giget). No template files are bundled — every scaffold pulls the freshest version directly from the source. Network access to GitHub is required; if the download fails (e.g. behind a corporate proxy or firewall), the CLI exits with a clear error and does not create a partial project.

## Attribution

This is an **unofficial community tool** and is not affiliated with, endorsed by, or maintained by Mappedin Inc.

- **SDK:** [@mappedin/mappedin-js](https://www.npmjs.com/package/@mappedin/mappedin-js)
- **Docs:** [developer.mappedin.com](https://developer.mappedin.com/web-sdk/getting-started)
- **Template:** [MappedIn/mappedin-js-quickstart](https://github.com/MappedIn/mappedin-js-quickstart)

## License

MIT — see [LICENSE](./LICENSE)
