const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = path.resolve('output/playwright');
  fs.mkdirSync(outDir, { recursive: true });
  const url = 'https://easytrack.jd.com/track-market/track-market';
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1024, height: 640 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.setDefaultTimeout(45000);
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(5000);

  const viewportPath = path.join(outDir, 'easytrack_1024x640.png');
  const fullPath = path.join(outDir, 'easytrack_full.png');
  await page.screenshot({ path: viewportPath, fullPage: false });
  await page.screenshot({ path: fullPath, fullPage: true });

  const summary = await page.evaluate(() => {
    const pick = (el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || '').slice(0, 160),
        id: el.id || '',
        text: (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 180),
        x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
        display: s.display, position: s.position,
        fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight,
        color: s.color, background: s.backgroundColor,
        border: s.border, radius: s.borderRadius,
        padding: s.padding, margin: s.margin,
      };
    };
    const candidates = Array.from(document.querySelectorAll('body, header, nav, main, section, aside, div, button, input, table, th, td, canvas, svg, [class*=chart], [class*=card], [class*=tab], [class*=btn], [class*=button]'))
      .filter(el => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 20 && r.height > 10 && s.visibility !== 'hidden' && s.display !== 'none';
      })
      .slice(0, 500)
      .map(pick);
    const textNodes = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,p,span,a,button,th,td,label'))
      .filter(el => {
        const txt = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
        const r = el.getBoundingClientRect();
        return txt && r.width > 5 && r.height > 5;
      })
      .slice(0, 260)
      .map(pick);
    return {
      title: document.title,
      url: location.href,
      viewport: { width: innerWidth, height: innerHeight },
      scroll: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
      bodyText: document.body.innerText.replace(/\s+/g, ' ').trim().slice(0, 4000),
      candidates,
      textNodes,
      errors: []
    };
  });
  summary.consoleErrors = errors;
  fs.writeFileSync(path.join(outDir, 'easytrack_summary.json'), JSON.stringify(summary, null, 2));
  await browser.close();
})().catch(err => { console.error(err); process.exit(1); });
