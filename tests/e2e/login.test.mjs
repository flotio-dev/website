// tests/e2e/login.test.mjs
import { launchBrowser } from "./utils/browser.mjs";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3000";
const LOGIN_PATH = process.env.E2E_LOGIN_PATH || "/login";

/**
 * Simple sleep helper.
 * @param {number} ms
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Find a <button> by its exact visible text content.
 * Throws if no button is found.
 */
async function findButtonByText(page, text) {
  const handle = await page.evaluateHandle((btnText) => {
    const buttons = Array.from(document.querySelectorAll("button"));
    return buttons.find((b) => (b.textContent || "").trim() === btnText) || null;
  }, text);

  const el = handle.asElement();
  if (!el) {
    throw new Error(`Button with text "${text}" not found`);
  }
  return el;
}

async function run() {
  console.log("Running test: login.test.mjs");

  const { browser, page } = await launchBrowser();

  try {
    // --------------------------------------
    // 1) Navigate to login page
    // --------------------------------------
    await page.goto(`${BASE_URL}${LOGIN_PATH}`, {
      waitUntil: "networkidle0",
    });

    // --------------------------------------
    // 2) Find and fill login form
    // --------------------------------------
    await page.waitForSelector('input[name="username"]', { timeout: 5000 });
    await page.waitForSelector('input[name="password"]', { timeout: 5000 });
    console.log("[LOGIN] Inputs found");

    await page.type('input[name="username"]', "testuser");
    await page.type('input[name="password"]', "testpassword");
    console.log("[LOGIN] Filled credentials");

    // --------------------------------------
    // 3) Click "Sign In" button
    // --------------------------------------
    const signInButton = await findButtonByText(page, "Sign In");
    await signInButton.click();
    console.log("[LOGIN] Clicked Sign In button");

    // --------------------------------------
    // 4) Let the UI react (no assertion here yet)
    // --------------------------------------
    await sleep(1500);

    console.log("Test passed: login.test.mjs");
  } catch (err) {
    console.error("Test failed: login.test.mjs");
    console.error(err);
    process.exit(1);
  } finally {
    // Always close the browser
    await browser.close();
  }
}

run().catch((err) => {
  console.error("Test failed: login.test.mjs (unhandled error)");
  console.error(err);
  process.exit(1);
});
