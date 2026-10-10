const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');

const output = path.join(process.cwd(), 'inspection', 'reference');
const properties = ['display','position','top','width','height','maxWidth','minHeight','paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginRight','marginBottom','marginLeft','gap','rowGap','columnGap','gridTemplateColumns','flexDirection','alignItems','justifyContent','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','textTransform','color','backgroundColor','backgroundImage','border','borderRadius','boxShadow','backdropFilter','overflow','opacity','transform','transitionProperty','transitionDuration','transitionTimingFunction','animationName','animationDuration','animationTimingFunction','animationIterationCount'];

async function inspect(page) {
  return page.evaluate((props) => {
    const selector = (el) => el.id ? `#${CSS.escape(el.id)}` : `${el.tagName.toLowerCase()}${Array.from(el.classList).slice(0,4).map(c => `.${CSS.escape(c)}`).join('')}`;
    const sample = (el) => {
      const s = getComputedStyle(el), b = el.getBoundingClientRect();
      return { selector: selector(el), tag: el.tagName, text: (el.innerText || '').trim().slice(0,240), rect: { x:b.x,y:b.y+scrollY,width:b.width,height:b.height }, styles:Object.fromEntries(props.map(p=>[p,s[p]])), children:Array.from(el.children).map(selector).slice(0,12) };
    };
    const rules = [];
    const walk = (list) => { for (const r of list) { if (r.type===CSSRule.MEDIA_RULE) rules.push({type:'media',condition:r.conditionText,css:r.cssText}); if (r.type===CSSRule.KEYFRAMES_RULE || r.type===CSSRule.FONT_FACE_RULE) rules.push({type:r.type===CSSRule.FONT_FACE_RULE?'font':'keyframes',css:r.cssText}); if(r.cssRules) walk(r.cssRules); } };
    const blocked=[];
    for (const sheet of document.styleSheets) { try {walk(sheet.cssRules);} catch {blocked.push(sheet.href);} }
    const unique = new Set();
    const elements=Array.from(document.querySelectorAll('header,nav,main,section,footer,h1,h2,h3,h4,h5,h6,p,a,button,input,div,span')).filter(el=>{
      const rect=el.getBoundingClientRect(); if (!rect.width || !rect.height) return false;
      const key=selector(el)+'|'+(el.innerText||'').trim().slice(0,35); if(unique.has(key)) return false; unique.add(key); return true;
    }).map(sample);
    return {url:location.href,title:document.title,viewport:{width:innerWidth,height:innerHeight},body:sample(document.body),elements,rules,blockedStylesheets:blocked,stylesheets:Array.from(document.styleSheets).map(s=>s.href),scripts:Array.from(document.scripts).map(s=>({src:s.src,text:s.src?'':s.textContent.slice(0,25000)})),images:Array.from(document.images).map(i=>({src:i.currentSrc,alt:i.alt,width:i.naturalWidth,height:i.naturalHeight})),animations:document.getAnimations().map(a=>({timing:a.effect?.getTiming(),frames:a.effect?.getKeyframes(),target:a.effect?.target?selector(a.effect.target):null})),fonts:Array.from(document.fonts).map(f=>({family:f.family,weight:f.weight,status:f.status}))};
  }, properties);
}

(async()=>{
  await fs.mkdir(output,{recursive:true});
  const browser = await chromium.launch({headless:true,channel:'chromium'});
  for (const [name,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:375,height:812}]]) {
    const page=await browser.newPage({viewport,deviceScaleFactor:1});
    const errors=[]; const failedRequests=[]; page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
    await page.goto('https://logicera.com/',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(30000);
    await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:path.join(output,`${name}-initial.png`)});
    const preloaderSuppressed=await page.evaluate(()=>{const overlay=document.querySelector('div.fixed.inset-0.z-\\[9999\\]');if(overlay && getComputedStyle(overlay).display!=='none' && getComputedStyle(overlay).opacity!=='0'){overlay.setAttribute('data-inspection-suppressed','true');overlay.style.display='none';return true;}return false;});
    await page.screenshot({path:path.join(output,`${name}-content.png`)});
    const height=await page.evaluate(()=>document.documentElement.scrollHeight);
    for(let y=0;y<height;y+=650){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(220);}
    await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(2000);
    const data=await inspect(page);data.errors=errors;data.failedRequests=failedRequests;data.preloaderSuppressed=preloaderSuppressed;
    if (name === 'desktop') {
      const assets = [...data.stylesheets.filter(Boolean), ...data.scripts.map(script => script.src).filter(src => src.startsWith('https://logicera.com/'))];
      await Promise.all(assets.map(async (url, index) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Public source asset returned ${response.status}: ${url}`);
        const extension = url.includes('.css') ? 'css' : 'js';
        await fs.writeFile(path.join(output, `source-${index}.${extension}`), await response.text());
      }));
    }
    const hovers=[];
    for (const query of ['header a','div.text-black.inline-flex.uppercase','nav button','.swiper-slide','a']) {
      const el=page.locator(query).first();if(await el.count()){try{const before=await el.evaluate(e=>({color:getComputedStyle(e).color,background:getComputedStyle(e).backgroundColor,transform:getComputedStyle(e).transform}));await el.hover({timeout:1500});await page.waitForTimeout(500);const after=await el.evaluate(e=>({color:getComputedStyle(e).color,background:getComputedStyle(e).backgroundColor,transform:getComputedStyle(e).transform}));hovers.push({query,before,after});}catch{}}
    }
    data.hovers=hovers;
    await fs.writeFile(path.join(output,`${name}.json`),JSON.stringify(data,null,2));
    await fs.writeFile(path.join(output,`${name}.html`),await page.content());
    await page.mouse.move(0,0);await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:path.join(output,`${name}-full.png`),fullPage:true});
    console.log(JSON.stringify({name,height,elements:data.elements.length,fonts:[...new Set(data.fonts.filter(f=>f.status==='loaded').map(f=>f.family))],headings:data.elements.filter(e=>/^H[1-3]$/.test(e.tag)).slice(0,5).map(e=>({text:e.text,rect:e.rect,size:e.styles.fontSize,line:e.styles.lineHeight,weight:e.styles.fontWeight})),rules:data.rules.length,errors,failedRequests,preloaderSuppressed},null,2));
    await page.close();
  }
  await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
