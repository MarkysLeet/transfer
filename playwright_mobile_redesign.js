const { chromium, devices } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  // Emulate an iPhone 13 Pro (approx 390x844)
  const iPhone = devices['iPhone 13 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });

  const page = await context.newPage();

  console.log("Navigating to http://localhost:3000/en");
  await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle' });

  // Find the mobile combobox input trigger
  console.log("Looking for 'From' input...");
  const fromInput = await page.getByPlaceholder('Pick-up location').first();
  await fromInput.waitFor({ state: 'visible' });

  console.log("Clicking 'From' input to open overlay...");
  await fromInput.click();

  // Wait for the overlay to animate in
  await page.waitForTimeout(1000);

  // Take screenshot of the initial overlay state
  await page.screenshot({ path: 'overlay_initial.png' });
  console.log("Captured initial overlay state: overlay_initial.png");

  // Focus the input inside the overlay to trigger virtual keyboard simulation
  console.log("Focusing overlay input...");
  const overlayInput = page.getByRole('textbox', { name: /search/i }).first();
  if (await overlayInput.isVisible()) {
      await overlayInput.focus();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'overlay_focused.png' });
      console.log("Captured focused overlay state: overlay_focused.png");
  } else {
      // Fallback selector if accessibility name isn't quite right
      const inputs = await page.locator('input[placeholder="Search..."], input.bg-transparent').all();
      for (const input of inputs) {
          if (await input.isVisible()) {
              await input.focus();
              await page.waitForTimeout(500);
              await page.screenshot({ path: 'overlay_focused.png' });
              console.log("Captured focused overlay state: overlay_focused.png (fallback selector)");
              break;
          }
      }
  }

  await browser.close();
})();
