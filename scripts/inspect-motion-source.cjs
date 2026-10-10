const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const output = path.join('inspection', 'motion');
const targetSelectors = ['#hero-banner', '.hero-bottom', '.features-swiper', '.testimonial-section', '.partner-section', '.sticky.top-0.w-full.h-screen', '[data-source-ticker]', '[data-source-lead]'];

async function snapshot(page, label) {
  return page.evaluate(({ selectors, label }) => {
    const properties = ['transform', 'opacity', 'visibility', 'clipPath', 'filter', 'strokeDasharray', 'strokeDashoffset', 'transitionDuration', 'transitionTimingFunction', 'animationName', 'animationDuration'];
    const gsap = window.gsap;
    const identify = node => node?.nodeType === 1 ? `${node.tagName.toLowerCase()}.${typeof node.className === 'string' ? node.className.split(' ').slice(0, 3).join('.') : node.className?.baseVal || ''}` : 'value';
    return {
      label, scrollY, viewport: { width: innerWidth, height: innerHeight },
      engine: { gsap: gsap?.version || null, lenis: !!window.lenis, scrollTrigger: !!window.ScrollTrigger },
      sections: selectors.flatMap(selector => [...document.querySelectorAll(selector)].map(element => {
        const bounds = element.getBoundingClientRect();
        const candidates = [element, ...element.querySelectorAll('h1,h2,h3,p,.word,.char,.line,svg path,.panel,.swiper-wrapper,.testimonial-text,.testimonial-author')].slice(0, 45);
        return { selector, top: bounds.top, height: bounds.height, children: candidates.map(node => ({ node: identify(node), text: node.textContent?.slice(0, 80), css: Object.fromEntries(properties.map(key => [key, getComputedStyle(node)[key]])) })) };
      })),
      tweens: gsap ? gsap.globalTimeline.getChildren(true, true, false).filter(tween => tween.isActive()).slice(0, 40).map(tween => ({ targets: tween.targets().map(identify), duration: tween.duration(), progress: tween.progress(), vars: Object.fromEntries(Object.entries(tween.vars).filter(([key]) => ['ease', 'duration', 'delay', 'stagger', 'x', 'y', 'xPercent', 'yPercent', 'opacity', 'autoAlpha', 'rotation', 'clipPath', 'drawSVG', 'scale', 'filter'].includes(key)).map(([key, value]) => [key, typeof value === 'function' ? 'function' : value])) })) : [],
      triggers: window.ScrollTrigger?.getAll().map(trigger => ({ id: trigger.vars.id || null, trigger: identify(trigger.trigger), start: trigger.vars.start, end: typeof trigger.vars.end === 'function' ? 'function' : trigger.vars.end, scrub: trigger.vars.scrub || false, pin: !!trigger.pin, progress: trigger.progress })) || []
    };
  }, { selectors: targetSelectors, label });
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chromium' });
  for (const [name, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 375, height: 812 }]]) {
    const page = await browser.newPage({ viewport, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
    await page.route(/googletagmanager|google-analytics|code\.tidio/, route => route.abort());
    await page.goto('https://logicera.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => {
      const overlay = document.querySelector('div.fixed.inset-0.z-\\[9999\\]');
      return !!document.querySelector('#hero-banner') && (!overlay || getComputedStyle(overlay).opacity === '0' || getComputedStyle(overlay).display === 'none');
    }, { timeout: 30000 });
    await page.evaluate(() => {
      const ticker = [...document.querySelectorAll('div.overflow-hidden')].find(element => element.textContent.trim().startsWith('MODERNIZE INNOVATE') && element.children.length === 2);
      ticker?.setAttribute('data-source-ticker', '');
      [...document.querySelectorAll('h3')].find(element => element.textContent.includes('Subscribe to our Newsletter'))?.parentElement?.setAttribute('data-source-lead', '');
    });
    const frames = [];
    for (const delay of process.argv.includes('--footer') ? [] : [100, 600, 1600, 3200]) {
      await page.waitForTimeout(delay);
      frames.push(await snapshot(page, `hero-after-${delay}ms`));
    }
    if (!process.argv.includes('--footer')) {
      await page.mouse.move(viewport.width * .8, viewport.height * .3);
      await page.waitForTimeout(600);
      frames.push(await snapshot(page, 'hero-pointer-parallax'));
      await page.screenshot({ path: path.join(output, `${name}-hero.png`) });
    }
    for (const selector of targetSelectors.slice(process.argv.includes('--footer') ? 6 : 1)) {
      const element = page.locator(selector).first();
      if (!await element.count()) continue;
      await element.evaluate(node => window.scrollTo({ top: node.getBoundingClientRect().top + scrollY - innerHeight * .5, behavior: 'instant' }));
      await page.waitForTimeout(300);
      frames.push(await snapshot(page, `${selector}-enter`));
      await page.waitForTimeout(900);
      frames.push(await snapshot(page, `${selector}-settled`));
    }
    await fs.writeFile(path.join(output, `${name}-${process.argv.includes('--footer') ? 'footer-' : ''}observations.json`), JSON.stringify(frames, null, 2));
    console.log(JSON.stringify({ name, observations: frames.length, engine: frames[0].engine, activeTweens: frames.flatMap(frame => frame.tweens).length, triggers: frames.at(-1).triggers }, null, 2));
    await page.close();
  }
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
