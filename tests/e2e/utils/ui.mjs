// tests/e2e/utils/ui.mjs

/**
 * Click a <button> whose visible text contains one of the candidates.
 * Works for FR/EN labels, etc.
 */
export async function clickButtonByText(page, textCandidates) {
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const label = await page.evaluate(el => el.textContent || '', btn);
    if (!label) continue;
    if (textCandidates.some(txt => label.includes(txt))) {
      await btn.click();
      return;
    }
  }
  throw new Error(
    `Button not found for any text: ${textCandidates.join(' / ')}`
  );
}

/**
 * Type into a MUI TextField using its label text (supports multiple languages).
 */
export async function typeIntoTextField(page, labelCandidates, value) {
  const handle = await page.evaluateHandle(texts => {
    const labels = Array.from(document.querySelectorAll('label'));
    for (const label of labels) {
      const text = label.textContent || '';
      if (texts.some(t => text.includes(t))) {
        const forId = label.getAttribute('for');
        if (!forId) continue;
        const input = document.getElementById(forId);
        if (input) return input;
      }
    }
    return null;
  }, labelCandidates);

  const element = handle.asElement();
  if (!element) {
    await handle.dispose();
    throw new Error(
      `Input not found for labels: ${labelCandidates.join(' / ')}`
    );
  }

  // Clear existing value then type
  await element.click({ clickCount: 3 });
  await element.type(value);
  await handle.dispose();
}

/**
 * Select the first available option in a MUI <Select> using its label text.
 */
export async function selectFirstOptionByLabel(page, labelCandidates) {
  // Open the select by clicking the element associated to the label
  const triggerHandle = await page.evaluateHandle(texts => {
    const labels = Array.from(document.querySelectorAll('label'));
    for (const label of labels) {
      const text = label.textContent || '';
      if (texts.some(t => text.includes(t))) {
        const forId = label.getAttribute('for');
        if (!forId) continue;
        const el = document.getElementById(forId);
        if (el) return el;
      }
    }
    return null;
  }, labelCandidates);

  const trigger = triggerHandle.asElement();
  if (!trigger) {
    await triggerHandle.dispose();
    throw new Error(
      `MUI Select trigger not found for labels: ${labelCandidates.join(' / ')}`
    );
  }

  await trigger.click();
  await triggerHandle.dispose();

  // Wait for the options list
  await page.waitForSelector('ul[role="listbox"] li', { timeout: 5000 });

  // Click the first non-disabled option
  await page.evaluate(() => {
    const options = Array.from(
      document.querySelectorAll('ul[role="listbox"] li[role="option"]')
    );
    const target = options.find(li => !li.getAttribute('aria-disabled'));
    if (target) {
      target.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      );
    }
  });
}