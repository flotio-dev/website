// tests/e2e/utils/browser.mjs
import puppeteer from "puppeteer";

/** Detect if we run as root (for --no-sandbox) */
const isRoot =
  typeof process.getuid === "function" && process.getuid() === 0;

export async function launchBrowser() {
  /** @type {import('puppeteer').PuppeteerLaunchOptions} */
  const options = {
    headless: true, // set to false if you want to see the browser
  };

  // Only use these flags when running as root
  if (isRoot) {
    options.args = ["--no-sandbox", "--disable-setuid-sandbox"];
  }

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  return { browser, page };
}
