const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

    page.on('console', msg => {
        console.log(`${msg.type().toUpperCase()}: ${msg.text()}`);
    });
    page.on('pageerror', err => console.log('PAGE_ERR:', err.message));

    await page.goto('http://localhost:5501', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);

    const hasCanvas = await page.evaluate(() => {
        const c = document.getElementById('threeContainer');
        const canvas = c?.querySelector('canvas');
        return { hasContainer: !!c, hasCanvas: !!canvas, w: canvas?.width, h: canvas?.height };
    });
    console.log('3D state:', JSON.stringify(hasCanvas));

    await page.screenshot({ path: 'screenshot-3d.png', fullPage: false });
    console.log('Screenshot saved');

    await browser.close();
})();
