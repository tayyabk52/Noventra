# Noventra

Noventra's brand website, built with Next.js App Router, strict TypeScript and Tailwind CSS v4. The design translates computed measurements from the supplied LogicEra reference into the supplied Noventra logo, navy/cyan palette and approved AI-focused copy.

## Run locally

Requires Node.js 22 or newer and npm. The lockfile pins the installed dependencies.

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:3010. For the production build:

```powershell
npm run build
npm run start
```

The local scripts use port 3010 because port 3000 was already occupied in the supplied workspace. A remote host can use `npx next start --hostname 0.0.0.0 --port 3010` behind its HTTPS proxy.

## Content and architecture

- `lib/content.ts` holds brand details, navigation, service descriptions, delivery stages, principles and technology names.
- `tokens.css` defines semantic OKLCH colors, the extracted 5px spacing scale, typography and motion curves. `tailwind.config.ts` maps those tokens to Tailwind.
- `components/ui/` contains primitives, counters, diagrams and controlled tickers.
- `components/layout/` contains the server-rendered navbar/footer and small client modules for the menu, header surface and contact capsule.
- `components/sections/` contains the page sections. Static page content remains server-rendered; menu, carousel, counters, pause controls and form are interactive leaves.
- `components/motion/` and `app/motion.css` reproduce LogicEra's inspected GSAP choreography. GSAP ScrollTrigger/SplitText/DrawSVG handle reveals, hero loops, pinned services and SVG strokes; Lenis smooths desktop wheel/anchor scrolling; Swiper supplies the delivery carousel. Touch scrolling remains native. Repeating effects have pause controls and spatial effects honor reduced motion.
- `/resources/ai-readiness`, `/privacy` and `/terms` are complete linked pages.

The four large numbers are delivery-stage ordinals, not performance claims. The quote carousel presents Noventra principles, not customer endorsements. Technology names describe an ecosystem, not certifications or partnerships. These choices were approved in the conversation because no verified metrics, testimonials or contact address were supplied.

## Enquiry storage

The form validates email and consent, saves the enquiry before confirming success, and returns an `NV-XXXXXXXX` reference. It supports recovery after a failed request, a honeypot, a request-size limit, rate limiting and a ten-minute idempotency cache.

Copy `.env.example` to `.env.local` and configure the values appropriate to the host:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public HTTPS domain for metadata, robots and sitemap; set it before building for deployment. |
| `CONTACT_WEBHOOK_URL` | Optional HTTPS endpoint that durably accepts the enquiry JSON with a successful HTTP response. |
| `CONTACT_WEBHOOK_TOKEN` | Optional server-only bearer token for that endpoint. |
| `LEAD_STORAGE_DIR` | Defaults to `.data`; mount on a persistent volume when using file storage. |

Without a webhook, records append to `.data/enquiries.jsonl`. This private file is ignored by version control and is never served as a public asset. On an ephemeral/serverless host, use the webhook integration; local files are not durable across deployments. The website does not claim to send an email. Configure an operator notification in the webhook destination if needed.

Rate limits and idempotency are held in one Node process. A deployment using multiple instances should centralize those controls and durable deduplication in its receiving service. Windows file permissions are inherited from the configured directory; use a private directory or volume for enquiry data.

## Verification

```powershell
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
```

Run browser checks against a production server using an isolated test-data directory. In one terminal:

```powershell
$env:LEAD_STORAGE_DIR='.data/verification'
npm run start
```

In another terminal:

```powershell
npm run test:e2e
npm run verify:performance
```

The suite checks 1440×900 and 375×812, WCAG AA through axe, keyboard/focus behavior, native touch swiping, service disclosures, pause controls, reduced motion, form recovery and actual persistence, API rejection/idempotency, linked routes, resource health and overflow at five additional widths. Tests scoped to one viewport are deliberately skipped in the other project. Verification records use reserved `.example` addresses.

Screenshots and lab measurements are in `inspection/local/`; the HTML test report is in `playwright-report/`. See `VERIFICATION.md` for results and limitations. Restart the server without the test storage environment variable for normal use.

The recorded local checks and screenshots describe the initial implementation before the animation revision. The animation-only pass inspected the live reference at both viewports and its public JavaScript bundles, documented exact timing/easing in `DESIGN.md`, and implemented the motion layer. No local tests, lint, typecheck or production build were run in that pass, at the user's request. Run the commands above when a new verification pass is authorized.

## Design evidence and assets

`DESIGN.md` was generated and checked before application implementation. It records exact source values, component anatomy and deliberate Noventra adaptations. Raw desktop/mobile computed-style JSON and screenshots are in `inspection/reference/`; the brand palette analysis is in `inspection/brand/palette.json`.

```powershell
npm run inspect:reference
node scripts/analyze-brand.cjs
```

`scripts/synthesize-design.cjs` can regenerate the source specification from those measurements, replacing `DESIGN.md`; preserve any later editorial notes before running it. `scripts/prepare-assets.cjs` regenerates optimized logo assets from the preserved original and downloads the measured Open Sans font. These scripts need network access; the application itself serves the font locally and does not require the reference site at build or runtime.

The supplied original logo is preserved at `public/brand/noventra-original.png`. All page diagrams are original SVGs. The locally served Open Sans font uses the SIL Open Font License included at `public/fonts/OFL.txt`.
