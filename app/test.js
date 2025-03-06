const { chromium } = require('playwright');

(async () => {
    // Launch browser
    const browser = await chromium.launch({ headless: false }); // Set true to run in background
    const page = await browser.newPage();

    // Navigate to a website
    await page.goto('http://localhost:3001');

    // Take a screenshot
    await page.screenshot({ path: 'example.png' });

    // Close browser
    await browser.close();
})();
