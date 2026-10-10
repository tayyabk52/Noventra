const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chromium' });
  const samples = [];
  for (const [name, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 375, height: 812 }]]) {
    for (let trial = 1; trial <= 3; trial++) {
      const context = await browser.newContext({ viewport, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
      const page = await context.newPage();
      await page.addInitScript(() => {
        window.__noventraVitals = { lcp: 0, cls: 0, totalShift: 0, longTasks: 0, session: { start: 0, last: 0, value: 0 } };
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) window.__noventraVitals.lcp = entry.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(list => {
          const data = window.__noventraVitals;
          for (const entry of list.getEntries()) {
            if (entry.hadRecentInput) continue;
            data.totalShift += entry.value;
            if (entry.startTime - data.session.last > 1000 || entry.startTime - data.session.start > 5000) {
              data.session = { start: entry.startTime, last: entry.startTime, value: entry.value };
            } else {
              data.session.value += entry.value;
              data.session.last = entry.startTime;
            }
            data.cls = Math.max(data.cls, data.session.value);
          }
        }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) window.__noventraVitals.longTasks += Math.max(0, entry.duration - 50);
        }).observe({ type: 'longtask', buffered: true });
      });
      await page.goto('http://127.0.0.1:3010', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2000);
      const sample = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const hero = document.querySelector('h1');
        const styles = getComputedStyle(hero);
        const containerElement = document.querySelector('.hero-inner');
        const container = containerElement.getBoundingClientRect();
        const containerStyles = getComputedStyle(containerElement);
        const leftPadding = parseFloat(containerStyles.paddingLeft);
        const rightPadding = parseFloat(containerStyles.paddingRight);
        return {
          lcpMs: Math.round(window.__noventraVitals.lcp),
          cls: Number(window.__noventraVitals.cls.toFixed(5)),
          loadLongTaskExcessMs: Math.round(window.__noventraVitals.longTasks),
          ttfbMs: Math.round(navigation.responseStart - navigation.requestStart),
          transferBytes: performance.getEntriesByType('resource').reduce((sum, entry) => sum + entry.transferSize, 0),
          viewport: { width: innerWidth, height: innerHeight },
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          hero: { fontSize: styles.fontSize, fontWeight: styles.fontWeight, lineHeight: styles.lineHeight, gutter: container.x + leftPadding, wrapperWidth: container.width, contentWidth: container.width - leftPadding - rightPadding }
        };
      });
      samples.push({ name, trial, ...sample });
      await context.close();
    }
  }
  await browser.close();
  const report = {
    recordedAt: new Date().toISOString(),
    environment: 'Local Next.js production server, unthrottled Chromium, fresh browser context per trial. Initial-load observations over two seconds after network idle. These are lab measurements, not deployed field Core Web Vitals; INP requires field interaction data.',
    samples
  };
  await fs.mkdir(path.join('inspection', 'local'), { recursive: true });
  await fs.writeFile(path.join('inspection', 'local', 'performance.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
