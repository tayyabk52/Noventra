# Noventra verification

The results below describe the **initial implementation, before the animation revision**, verified on 9 October 2026 against the local Next.js production server at http://127.0.0.1:3010, using headless Chromium. They do not certify the current motion layer.

The later animation-only pass inspected the source's public bundles and live desktop/mobile animation states, saving evidence in `inspection/motion/` and specifying it in `DESIGN.md` before implementation. GSAP, Lenis and Swiper now reproduce the extracted timing/easing, hero/SVG/pointer effects, section text reveals, carousels, service panels, kinetic ticker, menu/button/header effects, preloader, and route transitions. **No local tests, lint, typecheck or production build were run in that pass, as requested.** The current live preview reuses the existing workspace development server at http://127.0.0.1:3000; the initial production server on 3010 was stopped so it would not continue serving the older version.

## Engineering checks

| Check | Result |
| --- | --- |
| `npm run build` | Passed; no build warnings or TypeScript errors. Homepage, legal/resource pages and metadata routes prerendered; enquiry API remains dynamic. |
| `npm run typecheck` | Passed under strict TypeScript. |
| `npm run lint` | Passed with `--max-warnings 0`. |
| `npm run test:e2e` | 15 passed, 5 deliberately skipped; 20 project cases in total, 24.3 seconds. Skips are viewport-specific cases run in the applicable project. |
| `npm audit --omit=dev` | Zero production dependency vulnerabilities. |

The browser suite verifies loaded resources and console errors, typography, screenshots, axe WCAG 2 A/AA and 2.1 AA checks, drawer focus trap/Escape/scroll lock/focus restoration, real mobile touch swiping, carousel controls, native service disclosures, keyboard focus, ticker pause, reduced motion, real enquiry persistence, form retry with retained details, API validation/cross-origin rejection/request limits/idempotency, internal anchors and linked routes, and horizontal overflow at 320/414/768/1024/1920px.

Automated accessibility checks found zero violations on the homepage at both required viewports, the open mobile drawer, and the privacy, terms and readiness pages. Automated checks cover a subset of accessibility; keyboard and touch behavior were also exercised explicitly.

## Evidence and visual comparison

Source inspection finished before implementation. The initial `DESIGN.md` was created at 17:29 on 9 October after the settled desktop/mobile measurement files; application files were created afterward. Subsequent design-document edits record the final adaptations and verification findings.

| Evidence | Location |
| --- | --- |
| Exact source CSS/geometry and responsive rules | `inspection/reference/desktop.json`, `mobile.json` |
| Source desktop/mobile fold and full screenshots | `inspection/reference/*-content.png`, `*-full.png` |
| Noventra desktop fold / full | `inspection/local/desktop-fold.png` (1440×900), `desktop-full.png` (1440×7012) |
| Noventra mobile fold / full | `inspection/local/mobile-fold.png` (375×812), `mobile-full.png` (375×8012) |
| Additional responsive screenshots | `inspection/local/width-320.png`, `width-414.png`, `width-768.png`, `width-1024.png`, `width-1920.png` |
| Mobile section review | `inspection/local/mobile-approach.png`, `mobile-solutions.png`, `mobile-contact.png` |
| Playwright HTML report | `playwright-report/index.html` |
| Brand color sampling | `inspection/brand/palette.json` |
| Local performance trials | `inspection/local/performance.json` |

The comparison preserves the measured Open Sans family, 800-weight uppercase headings, 100px/33px desktop/mobile hero sizes, 5px spacing scale, floating capsule navigation, light process band, split quote section, dark technology band, paired services and large ticker. The provided logo supplies the navy/cyan palette. Original vector diagrams replace the reference brand's imagery.

| Measurement | Reference | Noventra | Reason |
| --- | --- | --- | --- |
| Hero font size, desktop / mobile | 100px / 33px | 100px / 33px | Exact extracted sizes. |
| Hero weight | 800 | 800 | Exact extracted weight. |
| Hero line height, desktop / mobile | 90px / 29.7px | 102px / 33.66px | Documented readability adaptation for Noventra's uppercase line breaks. |
| Desktop outer container | Wider source container | 1280px wrapper, 1220px inner content | Explicit PRODUCT.md maximum; content starts at 110px at a 1440px viewport. |
| Mobile content gutter | 20px | 20px | Exact measured gutter; 335px inner content at 375px. |
| Mobile navigation switch | 992px | 1024px | Explicit PRODUCT.md breakpoint. |
| Hero content and motion (initial version) | Rotating headlines and delayed entrances | Initially static; now source-timed word loop and SVG/pointer effects | Keep the approved Noventra headline; current motion is outside these baseline checks. |
| Quote carousel (initial version) | Timed customer content | Initially manual; now 5s Noventra principles with source-timed line transitions | Approved content substitute with pause, buttons and touch swipe. |

This is a documented brand translation of measured architecture. Content lengths, the specified container width, original imagery and accessibility changes intentionally prevent an identical pixel overlay of the source.

Visual review identified and fixed text contrast during carousel fades, the small mobile graphic extending beyond the full-page capture, and the floating mobile contact action covering the form. The carousel now translates at full opacity; the hero clips decorative overflow; the mobile capsule hides while the consultation section is visible.

## Local performance

Three fresh browser contexts per viewport, no network or CPU throttling. Initial-load observations continue for two seconds after network idle. These measurements are from this machine; deployed field performance and INP require measurements after hosting.

| Viewport | LCP median | LCP range | Maximum CLS | Initial resource transfer |
| --- | --- | --- | --- | --- |
| Desktop 1440×900 | 200ms | 196–1248ms | 0.00007 | 231,145 bytes |
| Mobile 375×812 | 196ms | 192–196ms | 0 | 231,145 bytes |

All six trials remain below the 2.5-second LCP and 0.1 CLS thresholds. The first desktop trial includes a 758ms server response during concurrent verification work. Exact timing and geometry are saved in the JSON evidence; no field Core Web Vitals certification is claimed.

## Enquiries and deployment configuration

Browser tests submitted reserved `.example` email addresses and verified the saved references in `.data/verification/enquiries.jsonl`. Test records are isolated from normal enquiry storage. The working preview is restarted with the default `.data/enquiries.jsonl` destination.

Before deploying, set `NEXT_PUBLIC_SITE_URL` to the public domain and configure either a durable HTTPS contact webhook or a persistent private storage volume. Operator notification, access and retention depend on that chosen destination. Rate limiting and the ten-minute idempotency cache are currently process-local; use centralized controls for a deployment with multiple instances. No external email or CRM delivery was configured or tested.

## Development dependency audit

The full dependency audit reports five high-severity entries in the development-only ESLint dependency chain: `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`. They describe one transitive stack-exhaustion advisory, [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), affecting braces through 3.0.3. The registry audit's proposed fix is a major downgrade to Next's ESLint configuration 14.2.35; it was not applied to the Next 16 toolchain. Keep dependency updates under review when a compatible fix becomes available. Production dependencies have zero reported vulnerabilities. The full audit result is preserved in `inspection/local/dependency-audit.json`.
