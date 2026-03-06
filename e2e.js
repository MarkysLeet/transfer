const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1080 }
  });

  await page.goto(process.argv[2] || 'http://localhost:3000/en', { waitUntil: 'networkidle' });

  await page.screenshot({ path: '/home/jules/verification/full_page_fix.png', fullPage: true });

  await browser.close();
})();
