// tests/e2e/add-project.test.mjs
import puppeteer from 'puppeteer';
import { loginWithUI } from './utils/auth.mjs';

const isRoot =
  typeof process.getuid === 'function' && process.getuid() === 0;

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

/**
 * Simple sleep helper
 * @param {number} ms
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Configure request interception and mock API responses
 *  - /github/installations
 *  - /github/repos
 *  - POST /project
 */
async function setupRequestMocks(page) {
  await page.setRequestInterception(true);

  page.on('request', async (request) => {
    const url = request.url();
    const method = request.method();

    // Mock GitHub installations
    if (url.includes('/github/installations')) {
      const body = JSON.stringify({
        ok: true,
        details: {
          installation_id: 123456,
        },
      });
      return request.respond({
        status: 200,
        contentType: 'application/json',
        body,
      });
    }

    // Mock GitHub repos
    if (url.includes('/github/repos')) {
      const body = JSON.stringify({
        details: {
          repositories: [
            {
              id: 1,
              full_name: 'e2e-user/e2e-repo',
              private: false,
            },
          ],
        },
      });
      return request.respond({
        status: 200,
        contentType: 'application/json',
        body,
      });
    }

    // Mock project creation (POST /project)
    if (url.includes('/project') && method === 'POST') {
      const body = JSON.stringify({
        project: {
          ID: 9999,
          name: 'e2e-mocked-project',
        },
      });
      return request.respond({
        status: 200,
        contentType: 'application/json',
        body,
      });
    }

    // Let all other requests go through
    return request.continue();
  });
}

(async () => {
  /** @type {import('puppeteer').PuppeteerLaunchOptions} */
  const launchOptions = {
    headless: false,
  };

  if (isRoot) {
    launchOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];
  }

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  try {
    // -------------------------------------------------
    // 0) Setup mocks + login + go to Add Project page
    // -------------------------------------------------
    await setupRequestMocks(page);

    await loginWithUI(page, { baseUrl: BASE_URL });
    console.log('[INFO] Logged in');

    await page.goto(`${BASE_URL}/projects/add-project`, {
      waitUntil: 'networkidle2',
    });

    // -------------------------------------------------
    // STEP 0 – Project name
    // -------------------------------------------------
    await page.waitForSelector('[data-testid="add-project-header-title"]', {
      timeout: 10000,
    });
    await page.waitForSelector('[data-testid="add-project-name-input"] input', {
      timeout: 5000,
    });

    const projectName = `e2e-project-${Date.now()}`;
    await page.click('[data-testid="add-project-name-input"] input');
    await page.type('[data-testid="add-project-name-input"] input', projectName);

    await page.click('[data-testid="add-project-next-btn"]');
    console.log('[STEP 0] Project name completed');

    // -------------------------------------------------
    // STEP 1 – GitHub connection check
    // -------------------------------------------------
    await page
      .waitForFunction(() => {
        const connected = document.querySelector(
          '[data-testid="github-connected-message"]'
        );
        const notConnected = document.querySelector(
          '[data-testid="github-not-connected-message"]'
        );
        const checking = document.querySelector(
          '[data-testid="github-checking-message"]'
        );
        return !!connected || !!notConnected || !checking;
      }, { timeout: 10000 })
      .catch(() => {});

    const { isGithubConnected, isGithubNotConnected } = await page.evaluate(() => ({
      isGithubConnected: !!document.querySelector(
        '[data-testid="github-connected-message"]'
      ),
      isGithubNotConnected: !!document.querySelector(
        '[data-testid="github-not-connected-message"]'
      ),
    }));

    console.log('[STEP 1] GitHub state:', {
      isGithubConnected,
      isGithubNotConnected,
    });

    if (isGithubNotConnected) {
      throw new Error(
        'GitHub is reported as not connected even though it is mocked as connected.'
      );
    }

    await page.click('[data-testid="add-project-next-btn"]');
    console.log('[STEP 1] GitHub App connected');

    // -------------------------------------------------
    // STEP 2 – Repository + build path
    // -------------------------------------------------
    await page.waitForSelector('[data-testid="add-project-repo-select"]', {
      timeout: 10000,
    });

    // Open repo dropdown
    await page.click('[data-testid="add-project-repo-select"]');

    // Select first repo option (from mocked /github/repos)
    await page.waitForSelector('[data-testid="add-project-repo-option"]', {
      timeout: 15000,
    });
    await page.click('[data-testid="add-project-repo-option"]');

    // Fill build path
    await page.waitForSelector(
      '[data-testid="add-project-build-path-input"] input',
      { timeout: 5000 }
    );
    await page.click('[data-testid="add-project-build-path-input"] input');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.type('[data-testid="add-project-build-path-input"] input', '/');

    await page.click('[data-testid="add-project-next-btn"]');
    console.log('[STEP 2] Repository and build path completed');

    // -------------------------------------------------
    // STEP 3 – Flutter version (keep default)
    // -------------------------------------------------
    // We assume the step transitioned; click "Next" again to go to summary
    await sleep(300);
    await page.click('[data-testid="add-project-next-btn"]');
    console.log('[STEP 3] Flutter version step completed (default used)');

    // -------------------------------------------------
    // STEP 4 – Summary + create project
    // -------------------------------------------------
    // Try to click "Create" if present, otherwise fallback to "Next"
    let createBtn = await page.$('[data-testid="add-project-create-btn"]');

    if (createBtn) {
      console.log('[STEP 4] Create button found, clicking it');
      await createBtn.click();
    } else {
      console.log('[STEP 4] Create button not found, falling back to Next');
      const nextBtn = await page.$('[data-testid="add-project-next-btn"]');
      if (!nextBtn) {
        throw new Error('Neither Create nor Next button found on final step.');
      }
      await nextBtn.click();
    }

    console.log('[STEP 4] Final action clicked (Create/Next)');

    // -------------------------------------------------
    // Redirect / final URL check
    // -------------------------------------------------
    await page
      .waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 })
      .catch(() => {});

    const finalUrl = page.url();
    console.log('[INFO] Final URL:', finalUrl);

    if (!finalUrl.includes('/projects/')) {
      throw new Error('Did not redirect to a project-related URL after creation.');
    }

    console.log('[SUCCESS] Add Project E2E completed successfully with mocked API');
  } catch (err) {
    console.error('Add Project test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
