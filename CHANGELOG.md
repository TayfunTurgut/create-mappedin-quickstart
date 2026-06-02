# Changelog

All notable changes to this project are documented here.

## 0.1.1

- Fix: a project name passed on the command line
  (`npm create mappedin-quickstart my-project`) is now used directly instead of
  re-prompting in interactive mode. An invalid name still prompts.

## 0.1.0

Initial release.

- Scaffold a Mappedin JS project via `npm create mappedin-quickstart <name>`.
- Downloads the latest template from the official
  [MappedIn/mappedin-js-quickstart](https://github.com/MappedIn/mappedin-js-quickstart)
  repo (`master`) using `giget`.
- Interactive prompts (project name, package manager, git) with a `--yes`
  non-interactive mode.
- Flags: `--skip-install`, `--skip-git`, `--pm`, `--template`, `--help`,
  `--version`.
- Rewrites `package.json` name and injects `ATTRIBUTION.md`.
- Optional dependency install and git initialization.
- Exits with a clear, actionable error if GitHub is unreachable (no partial
  project is created).
