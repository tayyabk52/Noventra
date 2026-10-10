<!-- Hallmark · pre-emit critique: P4 H4 E4 S5 R4 V4 · studied-DNA: LogicEra -->
# Noventra design system

## Status and provenance

Verified before application implementation on 2026-10-09. Source: https://logicera.com/, explicitly supplied as the public architectural reference for Noventra. Measurements are from headless Playwright Chromium at **1440×900** and **375×812**, using window.getComputedStyle, getBoundingClientRect, document.fonts, CSSOM, Web Animations, and downloaded public CSS/JavaScript.

Evidence: inspection/reference/desktop.json, mobile.json, desktop-content.png, mobile-content.png, desktop-full.png, mobile-full.png, and source-*.css/js. Brand evidence: inspection/brand/palette.json. Reproduce with node scripts/inspect-reference.cjs and node scripts/analyze-brand.cjs.

The initial nine-second capture was still inside the preloader. A thirty-second settled pass hydrated successfully on both viewports; **no preloader suppression was needed**. Both settled passes had zero page errors. The third-party chat script was blocked by Chromium ORB; analytics requests were aborted. The rotating hero, GSAP pin spacing, and moving slides make absolute section Y positions time-dependent. Component padding and computed typography are the stable evidence; screenshots are captured at specific animation phases. The motion revision includes the source's introductory counter and exit, with a CSS timeout and no-JavaScript/reduced-motion bypass.

## Reference architecture

Macrostructure: oversized, left-aligned uppercase hero with a right-hand outline graphic; split introduction; light counter ribbon; split quote/statement; dark technology band; two-column image-bearing services; large kinetic typography; underlined lead intake; four-column footer. Floating capsule navigation is visually detached within a fixed header. Mobile source uses a bottom capsule for contact/menu and a compact top logo.

Noventra keeps PRODUCT.md's explicit order: Hero (including introduction) → delivery counters → approach carousel → technology ecosystem → services → ticker → consultation → footer. Static sections and page remain React Server Components. Interactive leaves: menu, scroll state, counter, carousel, marquee controls, service disclosures, form.

## Exact reference metrics

Cells give font size / line height / weight, padding top-right-bottom-left, then bounding-box width × height. These rows are generated directly from the saved measurements.

| Anatomy | Desktop 1440×900 | Mobile 375×812 |
| --- | --- | --- |
| Header | 20px / 30px / 400; padding 0px 0px 0px 0px; 1440 × 110px | 20px / 30px / 400; padding 0px 0px 0px 0px; 375 × 92px |
| Desktop navigation | 20px / 30px / 400; padding 20px 40px 20px 40px; 318.48 × 58px | 20px / 30px / 400; padding 6px 50px 6px 6px; 195.64 × 49px |
| Hero canvas | 20px / 30px / 400; padding 140px 0px 100px 0px; 1440 × 900px | 20px / 30px / 400; padding 140px 0px 100px 0px; 375 × 460px |
| Hero headline | 100px / 90px / 800; padding 0px 0px 0px 0px; 1380 × 360px | 33px / 29.7px / 800; padding 0px 0px 0px 0px; 335 × 118.75px |
| Hero container | 20px / 30px / 400; padding 0px 30px 0px 30px; 1440 × 660px | 20px / 30px / 400; padding 0px 20px 0px 20px; 375 × 220px |
| Hero actions | 20px / 30px / 800; padding 0px 0px 0px 0px; 1380 × 54px | 20px / 30px / 800; padding 0px 0px 0px 0px; 335 × 44px |
| Introduction container | 20px / 30px / 400; padding 60px 30px 60px 30px; 1440 × 770px | 20px / 30px / 400; padding 50px 20px 50px 20px; 375 × 806.19px |
| Introduction title | 39px / 37.05px / 800; padding 0px 0px 0px 0px; 540 × 80.19px | 24px / 22.8px / 800; padding 0px 0px 0px 0px; 335 × 51.19px |
| Counter | 75px / 75px / 300; padding 0px 0px 0px 0px; 320 × 75px | 60px / 60px / 300; padding 0px 0px 0px 0px; 256.66 × 60px |
| Metric title | 28px / 28px / 800; padding 0px 0px 0px 0px; 320 × 56px | 20px / 20px / 800; padding 0px 0px 0px 0px; 256.66 × 20px |
| Approach section | 20px / 30px / 400; padding 200px 0px 200px 0px; 1440 × 749px | 20px / 30px / 400; padding 60px 0px 60px 0px; 375 × 621.38px |
| Quote text | 24px / 39px / 400; padding 0px 0px 0px 0px; 460 × 234px | 16px / 26px / 400; padding 0px 0px 0px 0px; 243.31 × 182px |
| Approach headline | 75px / 75px / 300; padding 0px 0px 0px 0px; 320 × 75px | 60px / 60px / 300; padding 0px 0px 0px 0px; 256.66 × 60px |
| Ecosystem band | 20px / 30px / 400; padding 0px 0px 0px 0px; 1440 × 489.91px | 20px / 30px / 400; padding 0px 0px 0px 0px; 345 × 407.52px |
| Service title | 39px / 35.1px / 800; padding 0px 0px 0px 0px; 600 × 74.38px | 28px / 25.2px / 800; padding 0px 0px 0px 0px; 335 × 82.13px |
| Kinetic ticker | 160px / 160px / 400; padding 0px 0px 0px 0px; 1440 × 160px | 90px / 90px / 400; padding 0px 0px 0px 0px; 375 × 90px |
| Lead heading | 28px / 39.2px / 500; padding 0px 0px 0px 0px; 860 × 39.19px | 20px / 30px / 500; padding 0px 0px 0px 0px; 335 × 30px |
| Lead input | 20px / 30px / 400; padding 15px 0px 15px 0px; 860 × 61px | 20px / 30px / 400; padding 15px 0px 15px 0px; 335 × 61px |

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

Supplied raster: 1983×450 pixels. Non-background bounds: x=357, y=135, width=1275, height=230. Eight-channel-value histogram quantization finds primary navy **#081830** (20,861 pixels), accent cyan **#08c0d0** (1,238 pixels), secondary blue **#1088b8** (649 pixels). These are sampled/quantized evidence, not a claim that the raster has three flat fills. It contains gradients and anti-aliasing.

Use the supplied Noventra mark/wordmark, never redraw it as a substitute. Preserve a copy of the original; prepare optimized transparent PNG/WebP assets from the raster. Palette colors are represented as semantic CSS tokens, with equivalent OKLCH values generated mathematically.

Logo tagline, used verbatim: **AI that moves business forward.** Audience inferred from that tagline and approved content direction: business leaders evaluating practical AI implementation. CTA: start a project conversation. Tone: direct, engineering-led, business-focused. Scene: a business owner reviewing technology partners on a laptop in daylight; the source's light canvas supports clear long-form reading, with navy bands anchoring technical sections.

User confirmed drafting AI-focused copy, replacing unsupported results with delivery stages, and labeling the quote section as Noventra's approach. Four counters **01 Discover, 02 Design, 03 Deliver, 04 Evolve** are ordinal process numbers, not company performance claims. Three perspective quotes are authored Noventra principles, not customer testimonials. Technology names describe an open ecosystem, not certified partnerships. No invented addresses, customer portraits, social profiles, certifications, or client logos. Legal pages describe actual implementation behavior.

## Responsive translation and accessibility decisions

Exact source media-query conditions: (min-width: 475px); (min-width: 676px); (min-width: 768px); (min-width: 992px); (min-width: 1200px); (min-width: 1500px); (min-width: 1800px); (min-width: 1921px); (min-width: 2600px); (hover: hover); not all and (min-width: 676px); (min-width: 480px); (min-width: 560px).

PRODUCT.md overrides the source navigation switch at 992px with **1024px**. Implement 640px tablet, 768px wider tablet, 1024px desktop, 1440px wide; max container **1280px** as required by PRODUCT.md (source maxima are 2320/1880/1600px). At 1440px, the wrapper begins at 80px and content begins at 110px after its measured 30px gutter; source hero began at 30px. Preserve measured **20px mobile gutters**, 50px mobile introduction padding, 60px general mobile sections, 100/140px desktop separations, and 200px desktop approach breathing room.

Hero: source 100px desktop and 33px mobile; keep these stops and 140px top / 100px bottom padding. Desktop minimum height 900px (or viewport at larger displays); mobile source height 460px becomes content-driven to accommodate the requested subheading, eyebrow, and second action. H1 line-height is increased from the source's 0.9 to **1.02** to prevent uppercase collisions. Intro heading 39/24px; approach 60/28px; service heading 39/28px; metric numbers 75/60px; card headings 28/20px; quote 24px/39px desktop and 16px/26px mobile; body 20px/30px desktop and 16px/26px mobile; UI/action 16–18px. Tracking remains 0, except the logo raster's inherent tracking.

Counters: desktop four equal ordinal cards within the content width; mobile two columns and reduced padding, rather than reproducing the source's autoplay proof claims. Cards retain the measured 50/40px desktop and 30/20px mobile padding roles. Services: two columns desktop and one column mobile per PRODUCT.md, with original brand-hue vector illustrations and always-visible action links. Source pins are translated into progressive disclosure using native details for keyboard/touch stability.

Navigation: N5 capsule within fixed header, logo left, primary contact right. Mobile top hamburger plus a bottom contact capsule, native dialog drawer with focus trap, Escape dismissal, backdrop dim, scroll lock, and focus restoration. Footer: Ft3 four-column index mandated by PRODUCT.md. All touch controls >=44px; no horizontal overflow at 320/375/414/768px; root overflow-x:clip. Persistent accessible content renders without JS, except controls that specifically need browser behavior. Contrast >=4.5:1 for normal text, >=3:1 for large text; navy text on cyan CTA.

## Motion and interaction evidence

| Source behavior | Evidence | Noventra translation |
| --- | --- | --- |
| Navigation transition | 500ms cubic-bezier(0,0,0.2,1) | Same curve, explicit transform/opacity only |
| Default transition | 150ms cubic-bezier(0.4,0,0.2,1) | --dur-micro / --ease-standard |
| Image fade | fadeIn 500ms, scale .8→1 + opacity 0→1 | Brand illustration fill reveal; line work draws over 16s with a 500ms delay |
| Header scroll | GSAP 600ms power2.out; scale .9 after scrollY>100 | Same shrink/ease on logo, capsule and actions; retained backdrop transition |
| Counter | rAF, 1.5s, power2.out | 1500ms cubic progress approximation 1-(1-t)^3; final value stays accessible |
| Hero title | 2s expo.out, 100ms stagger; 3s dwell; 800ms exit | Same clipped word loop and 200ms restart gap using the approved tagline; pause control |
| Proof slider | 800ms transition; 3000ms autoplay | Delivery-stage slider with the same timings, touch swipe and navigation/pause controls |
| Quote carousel | 5000ms auto-change; 300ms exit, 400ms author fade and 1s line entrance | Same choreography and autoplay on Noventra principles; pause on hover/focus and explicit control |
| Service hover | 400ms power2.out; 500ms action reveal | Same title lift and CTA entrance; keyboard access and readable mobile actions retained |
| Ticker | Source GSAP scroll-driven opposing translations | Two rows at xPercent -50 ± (25 × viewport progress + 20 × pointer position); pause control |
| Partner grid | Dark grid with 300ms hover color and 800ms back.out(1.7) entry | Technology ribbon retains its continuous loop, with source scale entrances and hover timing |

GSAP named easings are **not computed CSS cubic-beziers**. They are recorded by exact name from public source bundles and now run through GSAP itself; the counter polynomial is the power2.out mathematical equivalent. Do not report invented bezier values as extracted. The remaining 40-second technology loop, dialog focus behaviors, form state treatment, vector artwork, and accessibility corrections are explicitly authored adaptations requested by PRODUCT.md.

Reduced motion: disable loop/entrance/spatial effects, counters display final values, dialog and carousel change immediately. Every moving ribbon has a visible pause control. Focus rings appear instantly; no transition-all, animated dimensions, custom cursor, or scroll hijacking.

Mobile contact capsule: hide it while the consultation section intersects the viewport, keeping the form and consent controls unobstructed. This is an authored accessibility adaptation of the source's floating capsule.

### Motion replication specification, 9 October 2026

This revision implements the user's explicit request to reproduce the source motion instead of the first pass's static/manual substitutions. Code-level evidence is preserved in `inspection/motion/source-animation-calls.json` (142 animation calls), readable public bundles `source-11/12/13/15.js`, and live desktop/mobile computed-style sequences in `*-observations.json` and `*-footer-observations.json`. The live source keeps GSAP and Lenis inside its bundled modules, so absent window globals are not evidence of absent animation. The observations record the actual matrices, clipping, opacity and SVG stroke state; the public bundles establish the timing/easing/scroll configuration.

- **Smooth scrolling:** use Lenis on desktop/non-touch input, matching the source's `lerp: .1`, `duration: 1`, `smoothWheel: true`, `wheelMultiplier: 1`, `touchMultiplier: 2`, exponential easing `min(1, 1.001 - 2^(-10t))`, and vertical orientation. Source bypasses Lenis at ≤768px and on touch devices; keep native touch scrolling and smooth anchors there. Synchronize ScrollTrigger with Lenis. Pause smooth scrolling while the native modal is open, and honor reduced motion.
- **Hero:** SplitText words, yPercent 100→0, rotation 5→0, clipped bottom→open, opacity 0→1; 2s expo.out with .1s stagger. Hold 3s, exit .8s back.inOut with .05s stagger and rotation 4; restart after .2s. Preserve the existing brand headline. DrawSVG line work uses 16s power2.out and .5s delay. Pointer parallax is `(normalized position - .5) × 30px`, with .5s power2.out smoothing. Hero actions enter from yPercent 100/opacity 0 over 1s power3.out, .2s stagger at top 90%.
- **Introduction and text:** source title helper clips words from yPercent 100 over .8s power2.out, .05s stagger, top 80%, once. Introduction paragraphs reveal lines over 1s with .06s stagger at top center. Common body copy reveals lines over .8s with .1s stagger. Preserve readable server HTML and split only after the font is ready.
- **Delivery stages:** use the same Swiper mechanics: auto-width slides, loop, .8s transition, 3s dwell, 8px mobile/16px desktop gaps, touch enabled, autoplay pauses on hover. Initial card reveals are offset by 200ms; word/line contents move from y 30px over .8s power2.out with .05s stagger. Counters retain 1.5s power2.out count-up.
- **Approach:** heading words reveal through a scrubbed timeline from scale/rotation/clipping; source uses 2s power2.out with .15s stagger and scrub 1. Its CTA scales from 0 through blur 12px to scale 1/blur 0 with back.out(1.7). Quotes change every 5s with .3s exit, 1s power3.out clipped line entrance and .05s stagger; author fades .4s. Visible pause/previous/next controls retain reading control.
- **Ecosystem:** technology items scale 0→1/opacity 0→1 in .8s back.out(1.7) as the band enters; hover color takes .3s power2.out. Keep the PRODUCT.md technology ribbon rather than copying source partner claims.
- **Services:** pair the existing cards into desktop scenes and individual mobile scenes. Pin the scene, move the outgoing panel xPercent 0→-100 and incoming 100→0 over timeline duration 3 with power2.out, holds of 2 timeline units, scrub 1, and a 5-viewport scroll span. Title words enter .8s back.out with .05s stagger. Hover/focus moves the title from y -32→0 in .4s and reveals the action from y 15/scale .95/opacity 0 over .5s power2.out after .1s. Keep direct actions usable on touch. When a viewport is too short for the full card content, retain an unpinned stack with the same word entrances so all content remains readable. Scene selection/focus must expose every service to keyboard users and deep links.
- **Kinetic ticker:** replace the single automatic statement ribbon with the source's two opposing rows, including an outlined second row. GSAP quickSetter updates the exact source xPercent formula from visible-section progress and normalized pointer position. Reset pointer offset on leave; freeze both rows with the pause control.
- **Navigation/menu/buttons:** header scale .9 in .6s power2.out after 100px scroll. Source top padding reduces to 1rem from a responsive scale (.8, 1, 1.2, 1.4, 1.6, 1.8, 2.5rem). Keep Noventra's fixed header height and translate its chrome by half that padding difference, with the same .6s curve. Drawer enters from opacity 0/scale .85/y 30 in .6s power2.out; link accents then enter .7s back.out(1.5), .08s stagger. Exit uses a .12s scale 1.05 prelude and .25s opacity/scale .85/y 20 with power2.in. Buttons reveal a small dot in .4s and move their contents 8px in .4s back.out/back.in. Preserve focus rings and native dialog semantics.
- **CTA/footer:** use the source paragraph line reveal on explanatory copy, .3s input/link color transitions, a continuously rotating loading icon, and smooth anchor/back-to-top movement. The source newsletter heading is static; avoid inventing an additional effect for it.

GSAP and its ScrollTrigger/SplitText/DrawSVG plugins reproduce the actual source curves; Lenis and Swiper reproduce its scroll and slider mechanics. Reduced motion disables looping, text splitting, parallax, pinned choreography and smooth-wheel interception, leaving every item in a readable normal flow. No tests, lint, typecheck or build checks are run in this pass, as requested by the user.

- **Initial experience:** source module 4353 counts from 0 to 100 over navigation response time, minimum 1.2s / maximum 8s, fades counter text for .5s, then exits at scale 0 / rotation 3 over 1s using `expoScale(0.5,7,none)`. Translate the overlay to Noventra navy/cyan. A CSS escape after 9.2s and a no-JavaScript bypass prevent the decorative introduction obstructing access. It is absent under reduced motion.
- **Internal route transition:** source module 4353 fades a backdrop over .2s and expands a tilted curtain over .6s `power2.in` (rotation 15, rotationX 45, perspective 1000, initial scale .3). After navigation, fade both over .5s `power2.inOut`. Use transforms/clip-path on a fixed overlay rather than animating layout dimensions. Preserve ordinary modified/external/anchor clicks; provide a 5s escape if routing stalls. Reduced motion uses ordinary navigation.
- **Service accessibility adaptation:** keep all service text in the server-rendered DOM. The pinned sequence has previous/next controls, reveals a scene when its controls receive keyboard focus, and resolves service hash links to the matching scroll position. Expanded disclosures and viewports too short for a complete card use normal flow so content stays reachable.

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

```text
"}),c?i.os.to([e],{height:o||"calc(100% + 300px)",duration:1.5,ease:"power2.out"}):i.os.to([e],{height:o||"calc(100% + 300px)",duration:1.5,ease:"power2.out",s
:1,refreshPriority:1}});return d.to(i,{yPercent:0,ease:"power2.inOut",duration:1}),d.to(a,{objectPosition:"70% top",ease:"power2.inOut",duration:2},"<"),s.
ent:0,autoAlpha:1,stagger:{each:.06,from:"start"},duration:1,ease:"power2.out"})}}),()=>{d.kill(),u.revert()}},[c]),(0,n.jsx)("div",{className:"dark:bg-charcoa
s.fromTo(o.current,{drawSVG:"0%"},{drawSVG:"100%",duration:16,ease:"power2.out",delay:.5}),l.current){let e=0,r=null,n=()=>{r&&r.revert();let t=d[e].split("|")
th:"inset(-20% -10% -10% 0)",opacity:1,yPercent:0,duration:2,rotation:0,stagger:.1,ease:"expo.out",onComplete:()=>{setTimeout(()=>{s.os.to(i,{clipPath:"inset(1
00% 0 0 0)",opacity:0,yPercent:100,duration:.8,rotation:4,stagger:.05,ease:"back.inOut",onComplete:()=>{e=(e+1)%d.length,setTimeout(n,200)}})},3
os.to([c.current,u.current],{yPercent:0,opacity:1,duration:1,stagger:.2,ease:"power3.out"})}}));let i=t.current,a=null==i?void 0:i.querySelector(".svg-wrapper"
s.to(a,{translateX:(o-.5)*30,translateY:(l-.5)*30,duration:.5,ease:"power2.out"})},t=i.querySelector("#hero-banner");if(t)return t.addEventListener("mousemove"
0,y:30}),s.os.to([o.words,l.lines],{opacity:1,y:0,duration:.8,stagger:.05,ease:"power2.out"})}};return(0,n.jsx)("div",{ref:t,className:"3xl:pt-40 xl:pt-28 lg:p
3e3,disableOnInteraction:!1,pauseOnMouseEnter:!0},speed:800,breakpoints:{992:{spaceBetween:16}},navigation:{nextEl:".swiper-button-next-features",prevEl:".s
=T.current))return;let a=s.os.timeline({defaults:{duration:3.2,ease:"sine.inOut"},onComplete:()=>{t===T.current&&(s.os.set(n,{filter:"blur(0px)",scale:1}),s.os
)));let r=x.current[e];r&&s.os.to(r,{width:"100%",duration:7,ease:"none",onComplete:()=>{setTimeout(()=>{var e,r,n;s.os.to([null==(e=g.current)?void 0:e.queryS
```
