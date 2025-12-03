import puppeteer from 'puppeteer';
import { loginWithUI } from './utils/auth.mjs';
import {
  clickButtonByText,
  typeIntoTextField,
} from './utils/ui.mjs';

const isRoot =
  typeof process.getuid === 'function' && process.getuid() === 0;
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

(async () => {
  /** @type {import('puppeteer').PuppeteerLaunchOptions} */
  const launchOptions = {
    headless: false, // set to false locally if you need to see the browser
  };

  if (isRoot) {
    launchOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];
  }

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  try {
    // 1) Login through UI
    await loginWithUI(page);
    console.log('Logged in');

    // 2) Navigate to the environment variables page
    await page.goto(`${BASE_URL}/environment-variables`, {
      waitUntil: 'networkidle2',
    });

    console.log('Current URL after navigation:', page.url());

    // 3) Try to wait for the header test id, but do not fail if it is missing
    try {
      await page.waitForSelector('[data-testid="env-header-title"]', {
        timeout: 5000,
      });
      console.log('Found env header title');
    } catch {
      console.warn(
        'env-header-title not found within 5s, continuing with table checks only'
      );
    }

    // 4) Ensure the table body is present
    await page.waitForSelector('table tbody', { timeout: 10000 });

    // Count rows before adding
    const initialRowCount = await page.$$eval('table tbody tr', els => els.length);
    console.log('Initial rows:', initialRowCount);

    // 5) Open the "Add variable" dialog using a stable selector
    // If this selector is not present, this will fail as expected.
    await page.waitForSelector('[data-testid="env-add-variable-btn"]', {
      timeout: 10000,
    });
    await page.click('[data-testid="env-add-variable-btn"]');

    // 6) Wait for the dialog to appear
    await page.waitForSelector('[data-testid="env-dialog"]', {
      timeout: 10000,
    });

    const VAR_NAME = 'TEST_VAR';
    const VAR_VALUE = '12345';

    // 7) Fill the form fields (Name/Value), supporting FR or EN labels
    await typeIntoTextField(page, ['Name', 'Nom'], VAR_NAME);
    await typeIntoTextField(page, ['Value', 'Valeur'], VAR_VALUE);

    // 8) Save the new variable
    await clickButtonByText(page, ['Save', 'Enregistrer']);

    // 9) Wait for the dialog to close
    await page.waitForSelector('[data-testid="env-dialog"]', {
      hidden: true,
      timeout: 10000,
    });

    // 10) Verify that the number of rows increased by one
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    const finalRowCount = await page.$$eval('table tbody tr', els => els.length);
    console.log('Final rows:', finalRowCount);

    if (finalRowCount !== initialRowCount + 1) {
      throw new Error(
        `Expected row count to increase by 1 (from ${initialRowCount} to ${initialRowCount + 1}) but got ${finalRowCount}`
      );
    }

    // 11) Ensure the new variable is present in the table
    const hasNewVar = await page.$$eval(
      'table tbody tr',
      (rows, expectedName) =>
        rows.some(row =>
          row.textContent && row.textContent.includes(expectedName)
        ),
      VAR_NAME
    );

    if (!hasNewVar) {
      throw new Error(`New variable "${VAR_NAME}" not found in table`);
    }

    console.log('Variable creation flow passed');
  } catch (err) {
    console.error('Test failed:', err);

    // Capture screenshot to help debugging
    try {
      await page.screenshot({ path: 'env-page-failure.png', fullPage: true });
      console.log('Saved screenshot: env-page-failure.png');
    } catch (screenshotErr) {
      console.error('Failed to take screenshot:', screenshotErr);
    }

    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
