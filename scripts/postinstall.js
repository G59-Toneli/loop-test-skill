#!/usr/bin/env node

"use strict";

const path = require("path");
const { spawnSync } = require("child_process");

function isGlobalInstall() {
  return process.env.npm_config_global === "true";
}

function shouldSkip() {
  return process.env.LOOP_TEST_SKIP_POSTINSTALL === "1";
}

function runInstaller() {
  const installer = path.resolve(__dirname, "..", "bin", "install-loop-test.js");
  const args = [installer, "--agent", "codex", "--force"];
  const result = spawnSync(process.execPath, args, { stdio: "inherit" });

  if (result.error) {
    process.stderr.write(`[loop-test-skill] postinstall error: ${result.error.message}\n`);
    process.exitCode = 0;
    return;
  }

  if (typeof result.status === "number" && result.status !== 0) {
    process.stderr.write(
      `[loop-test-skill] postinstall installer exited with status ${result.status}\n`
    );
    process.exitCode = 0;
  }
}

function main() {
  if (!isGlobalInstall()) {
    return;
  }
  if (shouldSkip()) {
    process.stdout.write("[loop-test-skill] postinstall skipped by LOOP_TEST_SKIP_POSTINSTALL=1\n");
    return;
  }
  runInstaller();
}

main();
