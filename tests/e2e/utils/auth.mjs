// tests/e2e/utils/auth.mjs

/**
 * Perform a full login flow in the UI.
 */
export async function loginWithUI(page, {
  baseUrl = process.env.E2E_BASE_URL || 'http://localhost:3000',
  username = process.env.E2E_USER || 'testuser',
  password = process.env.E2E_PASSWORD || 'testpassword',
} = {}) {
  // Go to login page
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle0' });

  // Fill form
  await page.waitForSelector('input[name="username"]', { timeout: 5000 });
  await page.waitForSelector('input[name="password"]', { timeout: 5000 });

  await page.type('input[name="username"]', username);
  await page.type('input[name="password"]', password);

  // Click Sign In button
  const buttonHandle = await page.evaluateHandle((text) => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find((b) => b.textContent.trim() === text) || null;
  }, 'Sign In');

  const el = buttonHandle.asElement();
  if (!el) throw new Error('Sign In button not found');
  await el.click();

  // Wait for redirect / dashboard (adjust selector to your UI)
  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
  await new Promise((resolve) => setTimeout(resolve, 1000)); // let UI settle
}
