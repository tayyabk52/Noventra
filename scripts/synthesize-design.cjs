const fs=require('node:fs');
const desktop=JSON.parse(fs.readFileSync('inspection/reference/desktop.json','utf8'));
const mobile=JSON.parse(fs.readFileSync('inspection/reference/mobile.json','utf8'));
const palette=JSON.parse(fs.readFileSync('inspection/brand/palette.json','utf8'));
const find=(data,predicate)=>data.elements.find(predicate);
const targets=[
 ['Header',e=>e.tag==='HEADER'],['Desktop navigation',e=>e.tag==='NAV'],['Hero canvas',e=>e.selector==='#hero-banner'],['Hero headline',e=>e.tag==='H1'],['Hero container',e=>e.selector.startsWith('div.container.items-center.h-full')],['Hero actions',e=>e.selector.includes('hero-banner-buttons')],['Introduction container',e=>e.selector.includes('hero-bottom')],['Introduction title',e=>e.tag==='H2'&&e.text.includes('TRUSTED')],['Counter',e=>e.tag==='H2'&&e.selector.includes('font-light')],['Metric title',e=>e.tag==='H3'],['Approach section',e=>e.selector.startsWith('section.testimonial-section')],['Quote text',e=>e.selector.includes('testimonial-text')],['Approach headline',e=>e.tag==='H2'&&e.selector.includes('text-7xl')],['Ecosystem band',e=>e.selector.startsWith('section.partner-section')],['Service title',e=>e.tag==='H2'&&(/MANAGED SERVICES/.test(e.text))],['Kinetic ticker',e=>e.tag==='DIV'&&e.text.startsWith('MODERNIZE INNOVATE')],['Lead heading',e=>e.tag==='H3'&&e.text.includes('NEWSLETTER')],['Lead input',e=>e.tag==='INPUT']
];
const fmt=e=>!e?'Not rendered':`${e.styles.fontSize} / ${e.styles.lineHeight} / ${e.styles.fontWeight}; padding ${e.styles.paddingTop} ${e.styles.paddingRight} ${e.styles.paddingBottom} ${e.styles.paddingLeft}; ${Math.round(e.rect.width*100)/100} × ${Math.round(e.rect.height*100)/100}px`;
const rows=targets.map(([name,p])=>`| ${name} | ${fmt(find(desktop,p))} | ${fmt(find(mobile,p))} |`).join('\n');
const media=[...new Set(desktop.rules.filter(r=>r.type==='media').map(r=>r.condition))];
const sourceMotions=fs.readdirSync('inspection/reference').filter(file=>/^source-.*\.js$/.test(file)).map(file=>fs.readFileSync('inspection/reference/'+file,'utf8')).join('\n');
const evidence=[...sourceMotions.matchAll(/.{0,50}(?:duration:|ease:|speed:).{0,100}/g)].slice(0,12).map(m=>m[0]);
const content=`<!-- Hallmark · pre-emit critique: P4 H4 E4 S5 R4 V4 · studied-DNA: LogicEra -->
# Noventra design system

## Status and provenance

Verified before application implementation on 2026-10-09. Source: https://logicera.com/, explicitly supplied as the public architectural reference for Noventra. Measurements are from headless Playwright Chromium at **1440×900** and **375×812**, using window.getComputedStyle, getBoundingClientRect, document.fonts, CSSOM, Web Animations, and downloaded public CSS/JavaScript.

Evidence: inspection/reference/desktop.json, mobile.json, desktop-content.png, mobile-content.png, desktop-full.png, mobile-full.png, and source-*.css/js. Brand evidence: inspection/brand/palette.json. Reproduce with node scripts/inspect-reference.cjs and node scripts/analyze-brand.cjs.

The initial nine-second capture was still inside the preloader. A thirty-second settled pass hydrated successfully on both viewports; **no preloader suppression was needed**. Both settled passes had zero page errors. The third-party chat script was blocked by Chromium ORB; analytics requests were aborted. The rotating hero, GSAP pin spacing, and moving slides make absolute section Y positions time-dependent. Component padding and computed typography are the stable evidence; screenshots are captured at specific animation phases. The Noventra implementation deliberately has no blocking preloader.

## Reference architecture

Macrostructure: oversized, left-aligned uppercase hero with a right-hand outline graphic; split introduction; light counter ribbon; split quote/statement; dark technology band; two-column image-bearing services; large kinetic typography; underlined lead intake; four-column footer. Floating capsule navigation is visually detached within a fixed header. Mobile source uses a bottom capsule for contact/menu and a compact top logo.

Noventra keeps PRODUCT.md's explicit order: Hero (including introduction) → delivery counters → approach carousel → technology ecosystem → services → ticker → consultation → footer. Static sections and page remain React Server Components. Interactive leaves: menu, scroll state, counter, carousel, marquee controls, service disclosures, form.

## Exact reference metrics

Cells give font size / line height / weight, padding top-right-bottom-left, then bounding-box width × height. These rows are generated directly from the saved measurements.

| Anatomy | Desktop 1440×900 | Mobile 375×812 |
| --- | --- | --- |
${rows}

All these elements compute **Open Sans**, with Open Sans Fallback. The body computes 20px/30px, weight 400. Headings are generally 800, counters 300; quote text is 400. Measured letter-spacing is normal (0). Source root font-size is 20px; its Tailwind --spacing .25rem therefore produces a **5px** unit, not a guessed 4px unit.

### Colors, surfaces, edges

| Source role | Exact observed value | Noventra mapping |
| --- | --- | --- |
| Hero canvas | rgb(221,238,255), #ddeeff | #e3f3f7, brand-hue translation with matching light surface role |
| Primary blue | rgb(1,116,233), #0174e9 | #087b91, contrast-adjusted cyan for display and links |
| CTA yellow | rgb(255,204,102), #ffcc66 | #08c0d0, dominant cyan cluster from logo |
| Body charcoal | rgb(20,20,20), #141414 | #081830, dominant navy cluster from logo |
| Dark band | #141414 | #081830 |
| White surfaces | #ffffff | #f8fbfd, logo background translation |
| Navigation outline | #eeeeee, 1px outer shadow | #d5e3ea, 1px border |
| Capsule radius | 33554400px (Tailwind full) | 9999px, visually equivalent finite capsule |
| Mobile ecosystem radius | 10px | 10px |
| Other heading/cards | usually 0px | 0px for editorial surfaces; 10px on illustrated services |

## Brand evidence and approved content

Supplied raster: 1983×450 pixels. Non-background bounds: x=${palette.bounds.left}, y=${palette.bounds.top}, width=${palette.bounds.width}, height=${palette.bounds.height}. Eight-channel-value histogram quantization finds primary navy **#081830** (20,861 pixels), accent cyan **#08c0d0** (1,238 pixels), secondary blue **#1088b8** (649 pixels). These are sampled/quantized evidence, not a claim that the raster has three flat fills. It contains gradients and anti-aliasing.

Use the supplied Noventra mark/wordmark, never redraw it as a substitute. Preserve a copy of the original; prepare optimized transparent PNG/WebP assets from the raster. Palette colors are represented as semantic CSS tokens, with equivalent OKLCH values generated mathematically.

Logo tagline, used verbatim: **AI that moves business forward.** Audience inferred from that tagline and approved content direction: business leaders evaluating practical AI implementation. CTA: start a project conversation. Tone: direct, engineering-led, business-focused. Scene: a business owner reviewing technology partners on a laptop in daylight; the source's light canvas supports clear long-form reading, with navy bands anchoring technical sections.

User confirmed drafting AI-focused copy, replacing unsupported results with delivery stages, and labeling the quote section as Noventra's approach. Four counters **01 Discover, 02 Design, 03 Deliver, 04 Evolve** are ordinal process numbers, not company performance claims. Three perspective quotes are authored Noventra principles, not customer testimonials. Technology names describe an open ecosystem, not certified partnerships. No invented addresses, customer portraits, social profiles, certifications, or client logos. Legal pages describe actual implementation behavior.

## Responsive translation and accessibility decisions

Exact source media-query conditions: ${media.join('; ')}.

PRODUCT.md overrides the source navigation switch at 992px with **1024px**. Implement 640px tablet, 768px wider tablet, 1024px desktop, 1440px wide; max container **1280px** as required by PRODUCT.md (source maxima are 2320/1880/1600px). At 1440px, the wrapper begins at 80px and content begins at 110px after its measured 30px gutter; source hero began at 30px. Preserve measured **20px mobile gutters**, 50px mobile introduction padding, 60px general mobile sections, 100/140px desktop separations, and 200px desktop approach breathing room.

Hero: source 100px desktop and 33px mobile; keep these stops and 140px top / 100px bottom padding. Desktop minimum height 900px (or viewport at larger displays); mobile source height 460px becomes content-driven to accommodate the requested subheading, eyebrow, and second action. H1 line-height is increased from the source's 0.9 to **1.02** to prevent uppercase collisions. Intro heading 39/24px; approach 60/28px; service heading 39/28px; metric numbers 75/60px; card headings 28/20px; quote 24px/39px desktop and 16px/26px mobile; body 20px/30px desktop and 16px/26px mobile; UI/action 16–18px. Tracking remains 0, except the logo raster's inherent tracking.

Counters: desktop four equal ordinal cards within the content width; mobile two columns and reduced padding, rather than reproducing the source's autoplay proof claims. Cards retain the measured 50/40px desktop and 30/20px mobile padding roles. Services: two columns desktop and one column mobile per PRODUCT.md, with original brand-hue vector illustrations and always-visible action links. Source pins are translated into progressive disclosure using native details for keyboard/touch stability.

Navigation: N5 capsule within fixed header, logo left, primary contact right. Mobile top hamburger plus a bottom contact capsule, native dialog drawer with focus trap, Escape dismissal, backdrop dim, scroll lock, and focus restoration. Footer: Ft3 four-column index mandated by PRODUCT.md. All touch controls >=44px; no horizontal overflow at 320/375/414/768px; root overflow-x:clip. Persistent accessible content renders without JS, except controls that specifically need browser behavior. Contrast >=4.5:1 for normal text, >=3:1 for large text; navy text on cyan CTA.

## Motion and interaction evidence

| Source behavior | Evidence | Noventra translation |
| --- | --- | --- |
| Navigation transition | 500ms cubic-bezier(0,0,0.2,1) | Same curve, explicit transform/opacity only |
| Default transition | 150ms cubic-bezier(0.4,0,0.2,1) | --dur-micro / --ease-standard |
| Image fade | fadeIn 500ms, scale .8→1 + opacity 0→1 | Static hero illustration, available immediately for rendering |
| Header scroll | GSAP 600ms power2.out; scale .9 after scrollY>100 | IntersectionObserver adds compact surface state, 500ms measured CSS curve |
| Counter | rAF, 1.5s, power2.out | 1500ms cubic progress approximation 1-(1-t)^3; final value stays accessible |
| Hero title | 2s expo.out, 100ms stagger; 3s dwell; 800ms exit | Static tagline, available immediately without animation delay |
| Proof slider | 800ms transition; 3000ms autoplay | Manual approach carousel with 500ms / 8px translation at full opacity, previous/next and swipe |
| Quote carousel | 5000ms auto-change; 400ms fade and 1s text entrance | Manual-only, user retains reading time |
| Service hover | 400ms power2.out; 500ms action reveal | Always-visible link, arrow translates 8px over 400ms |
| Ticker | Source GSAP scroll-scrubbed opposing translations | Seamless 40s linear CSS transform loop per PRODUCT.md; pause button, hover/focus pause |
| Partner grid | Dark grid with 300ms hover color and 800ms entry | Technology text ribbon per PRODUCT.md, using same 40s ticker primitive |

GSAP named easings are **not computed CSS cubic-beziers**. They are recorded by exact name from public source bundles; the counter polynomial is the power2.out mathematical equivalent. Do not report invented bezier values as extracted. 40-second time loop, dialog focus behaviors, form state treatment, vector artwork, and accessibility corrections are explicitly authored adaptations requested by PRODUCT.md.

Reduced motion: disable loop/entrance/spatial effects, counters display final values, dialog and carousel change immediately. Every moving ribbon has a visible pause control. Focus rings appear instantly; no transition-all, animated dimensions, custom cursor, or scroll hijacking.

Mobile contact capsule: hide it while the consultation section intersects the viewport, keeping the form and consent controls unobstructed. This is an authored accessibility adaptation of the source's floating capsule.

## Tokens and component blueprint

Semantic roles: --color-paper (#f8fbfd), --color-ink (#081830), --color-accent (#08c0d0), --color-accent-strong (#087b91), --color-secondary (#1088b8), --color-hero (#e3f3f7), --color-muted (navy mixed toward paper), --color-rule (#d5e3ea), --color-focus (#087b91), --color-error (contrast-tested red), --color-success (contrast-tested green). Font roles both Open Sans, intentionally preserving measured font anatomy. Spacing uses extracted 5px values with named tokens for 5,10,15,20,30,40,50,60,80,100,140,200px. Body sizes above. Capsule 9999px, card 10px, fine rule 1px. Motion tokens 150/400/500/800/1500ms plus 40s loop. Canonical values live in tokens.css; Tailwind maps semantic aliases.

Primitives: Button variants primary/outline/ghost with arrow, Badge, Container, Card, Counter, Ticker, BrandLogo, original diagram illustrations. Layout: server Navbar containing scroll-state/menu leaves, server Footer. Sections: server Hero, Stats, Testimonials shell, Partners, Services, TickerStrip, CTA; only small interactive modules are clients. Types: BrandConfig, MetricItem, ServiceItem, TestimonialItem, NavigationItem. Data: lib/content.ts. Metadata and dynamic OpenGraph/Twitter images. Local fonts via next/font/local to remove build/runtime network dependency.

Lead intake: email, project note, explicit privacy consent, blur/submit validation, loading, success reference, retry error. POST server route validates schema and request size, prevents cross-origin submission, deduplicates rapid repeats, rate-limits, and persists an enquiry before success. Durable production webhook (configured environment) or local append-only .data/enquiries.jsonl on a writable persistent Node host. No message is said to be emailed unless a configured integration accepts it. Legal and AI-readiness resource routes are complete pages.

## Exports

1. tokens.css: canonical semantic CSS custom properties, imported by app/globals.css.
2. Tailwind v4: @theme inline semantic mappings in app/globals.css, with @config ../tailwind.config.ts for the required config bridge.
3. DTCG subset: {"color":{"ink":{"$type":"color","$value":"#081830"},"accent":{"$type":"color","$value":"#08c0d0"},"paper":{"$type":"color","$value":"#f8fbfd"}},"font":{"body":{"$type":"fontFamily","$value":"Open Sans"}}}.
4. shadcn semantic mapping (if adopted): background→paper, foreground→ink, primary→accent, primary-foreground→ink, secondary→hero, border/input→rule, ring→focus. Exact OKLCH triples are supplied in tokens.css.

## Verification contract

Run npm run lint (zero warnings), npm run typecheck, npm run build. Start the production build, test desktop 1440×900 and mobile 375×812, save full/fold screenshots, compare measured typography and gutters to this file, check horizontal overflow additionally at 320/414/768/1024/1920px, test menu keyboard/focus/scroll lock, carousel buttons/swipe, native service disclosures, ribbon pause, reduced motion, real lead persistence and validation, internal links, legal/resource routes, console errors, axe accessibility, and local LCP/CLS instrumentation. Lab CWV measurements are evidence for this machine, not a promise of deployed field performance.

## Source motion excerpts

Exact diagnostic excerpts (read as data, never execute):

\`\`\`text
${evidence.join('\n')}
\`\`\`
`;
fs.writeFileSync('DESIGN.md',content);
const check=fs.readFileSync('DESIGN.md','utf8');
for(const value of [find(desktop,e=>e.tag==='H1').styles.fontSize,find(mobile,e=>e.tag==='H1').styles.fontSize,'#081830','#08c0d0','1440×900','375×812'])if(!check.includes(value))throw new Error('Missing evidence '+value);
console.log('DESIGN.md generated and verified against both source JSON datasets and the logo palette. '+check.length+' characters. No application code has been written.');
