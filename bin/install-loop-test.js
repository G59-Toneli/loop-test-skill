#!/usr/bin/env node

"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const SKILL_NAME = "loop-test";
const SOURCE_ROOT = path.resolve(__dirname, "..");
const REQUIRED_FILES = [
  "SKILL.md",
  "README.md",
  "testing-playbook.md",
  "loop-templates.md",
  "loop-memory.md",
  "cso-rules.md",
  "SKILL_VALIDATION.md"
];

function printHelp() {
  process.stdout.write(
    [
      "Usage:",
      "  npx loop-test-skill [options]",
      "",
      "Options:",
      "  --agent <codex|claude|both>   Install target (default: codex)",
      "  --skills-root <path>          Custom skills root (applies to selected agent(s))",
      "  --force                       Overwrite existing files",
      "  --dry-run                     Print actions without writing files",
      "  --help                        Show this help message",
      "",
      "Examples:",
      "  npx loop-test-skill",
      "  npx loop-test-skill --agent both",
      "  npx loop-test-skill --agent claude --force",
      "  npx loop-test-skill --skills-root C:\\\\Users\\\\me\\\\.agents\\\\skills"
    ].join("\n")
  );
}

function parseArgs(argv) {
  const opts = {
    agent: "codex",
    skillsRoot: null,
    force: false,
    dryRun: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      opts.help = true;
      continue;
    }
    if (arg === "--force") {
      opts.force = true;
      continue;
    }
    if (arg === "--dry-run") {
      opts.dryRun = true;
      continue;
    }
    if (arg === "--agent") {
      const next = argv[i + 1];
      if (!next) {
        throw new Error("Missing value for --agent");
      }
      opts.agent = next;
      i += 1;
      continue;
    }
    if (arg === "--skills-root") {
      const next = argv[i + 1];
      if (!next) {
        throw new Error("Missing value for --skills-root");
      }
      opts.skillsRoot = next;
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!["codex", "claude", "both"].includes(opts.agent)) {
    throw new Error("Invalid --agent value. Use codex, claude, or both.");
  }
  return opts;
}

function resolveTargets(opts) {
  const home = os.homedir();
  const codexRoot = opts.skillsRoot || path.join(home, ".agents", "skills");
  const claudeRoot = opts.skillsRoot || path.join(home, ".claude", "skills");

  if (opts.agent === "codex") {
    return [{ agent: "codex", skillDir: path.join(codexRoot, SKILL_NAME) }];
  }
  if (opts.agent === "claude") {
    return [{ agent: "claude", skillDir: path.join(claudeRoot, SKILL_NAME) }];
  }
  return [
    { agent: "codex", skillDir: path.join(codexRoot, SKILL_NAME) },
    { agent: "claude", skillDir: path.join(claudeRoot, SKILL_NAME) }
  ];
}

function ensureSourceFiles() {
  const missing = REQUIRED_FILES.filter(
    (rel) => !fs.existsSync(path.join(SOURCE_ROOT, rel))
  );
  if (missing.length > 0) {
    throw new Error(`Missing required packaged files: ${missing.join(", ")}`);
  }
}

function installToTarget(target, opts) {
  const actions = [];
  actions.push(`[${target.agent}] target: ${target.skillDir}`);

  if (!opts.dryRun) {
    fs.mkdirSync(target.skillDir, { recursive: true });
  }

  for (const rel of REQUIRED_FILES) {
    const src = path.join(SOURCE_ROOT, rel);
    const dst = path.join(target.skillDir, rel);
    const exists = fs.existsSync(dst);

    if (exists && !opts.force) {
      if (opts.dryRun) {
        actions.push(`  - exists ${rel} (would require --force)`);
        continue;
      }
      throw new Error(
        `[${target.agent}] Refusing to overwrite existing file without --force: ${dst}`
      );
    }

    actions.push(`  - ${exists ? "overwrite" : "copy"} ${rel}`);
    if (!opts.dryRun) {
      fs.copyFileSync(src, dst);
    }
  }
  return actions;
}

function main() {
  try {
    const opts = parseArgs(process.argv.slice(2));
    if (opts.help) {
      printHelp();
      return;
    }

    ensureSourceFiles();
    const targets = resolveTargets(opts);
    const report = [];

    for (const target of targets) {
      report.push(...installToTarget(target, opts));
    }

    process.stdout.write(report.join("\n") + "\n");
    if (opts.dryRun) {
      process.stdout.write("\nDry run complete. No files were written.\n");
      return;
    }
    process.stdout.write("\nInstall complete.\n");
  } catch (err) {
    process.stderr.write(`Error: ${err.message}\n`);
    process.exitCode = 1;
  }
}

main();
