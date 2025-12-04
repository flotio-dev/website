// tests/e2e/run-tests.mjs
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// List of E2E test files (executed in order)
const TEST_FILES = [
  "env-variables.test.mjs",
  "login.test.mjs",
  "add-project.test.mjs",
];

/**
 * Run a single test file in a child process.
 * Resolves if the test exits with code 0, rejects otherwise.
 */
async function runTest(file, index, total) {
  return new Promise((resolvePromise, rejectPromise) => {
    const testPath = resolve(__dirname, file);
    const label = `[${index}/${total}]`;

    console.log(`\n[RUN] ${label} ${file}\n`);

    const start = Date.now();

    const child = spawn("node", [testPath], {
      stdio: "inherit",
    });

    child.on("close", (code) => {
      const durationMs = Date.now() - start;
      const duration = `${(durationMs / 1000).toFixed(2)}s`;

      if (code === 0) {
        console.log(`\n[OK]  ${label} ${file} (duration: ${duration})\n`);
        resolvePromise();
      } else {
        console.error(`\n[FAIL] ${label} ${file} (exit code ${code}, duration: ${duration})\n`);
        rejectPromise(new Error(`Test failed: ${file}`));
      }
    });
  });
}

(async () => {
  try {
    const total = TEST_FILES.length;

    for (let i = 0; i < total; i++) {
      const file = TEST_FILES[i];
      await runTest(file, i + 1, total);
    }

    console.log("\n[SUMMARY] All E2E tests finished successfully.\n");
    process.exit(0);
  } catch (err) {
    console.error("\n[SUMMARY] E2E test suite failed.\n");
    console.error(err);
    process.exit(1);
  }
})();
