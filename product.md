# PRODUCT.md: Website Blueprint & Content Specification

## 1. Project Overview & Objective
- **Project Name**: Modern High-Conversion Web Experience
- **Architectural Benchmark**: [LogicEra](https://logicera.com/)
- **Core Objective**: Build a modern, performant, and responsive web presence that mirrors the structural hierarchy, typographic weight, motion design, and interaction finesse of `https://logicera.com/`, adapted to the client's brand identity, logo, and core messaging.
- **Target Deliverable**: A fully responsive Next.js 14+/15+ application with clean modular component architecture, dynamic micro-interactions, mobile-first optimization, and zero placeholder content.

---

## 2. Information Architecture & Section Breakdown

The website must be structured into modular, reusable sections matching the flow of the benchmark:

```
┌────────────────────────────────────────────────────────┐
│ Preloader & Initial Experience (Optional / Smooth Intro)│
├────────────────────────────────────────────────────────┤
│ Global Header & Navigation (Desktop Sticky + Mobile)   │
├────────────────────────────────────────────────────────┤
│ 1. Hero Section (Tagline, Headline, CTAs, Credentials) │
├────────────────────────────────────────────────────────┤
│ 2. Metrics & Proof Points Grid (Counter Stat Cards)   │
├────────────────────────────────────────────────────────┤
│ 3. Social Proof & Testimonial Carousel                │
├────────────────────────────────────────────────────────┤
│ 4. Partner / Technology Ecosystem Marquee             │
├────────────────────────────────────────────────────────┤
│ 5. Interactive Solutions & Services Showcase           │
├────────────────────────────────────────────────────────┤
│ 6. High-Impact Kinetic Typography Ticker Strip        │
├────────────────────────────────────────────────────────┤
│ 7. Lead Generation / Consultation CTA Section         │
├────────────────────────────────────────────────────────┤
│ Global Multi-Column Footer & Legal Navigation          │
└────────────────────────────────────────────────────────┘
```

### Detailed Section Requirements

#### A. Global Navigation (`Navbar`)
- **Desktop (>=1024px)**:
  - Sticky header with dynamic backdrop blur (`backdrop-blur-md bg-opacity`) on scroll.
  - Brand logo on left (configured via client asset).
  - Center/Right navigation links with subtle underline/glow hover states.
  - Distinct Primary CTA button ("Talk to Us" / "Get Started" / "Schedule a Demo").
- **Mobile (<1024px)**:
  - Compact header with brand logo and custom hamburger icon.
  - Full-screen or off-canvas animated drawer displaying navigation links, contact info, and mobile CTA button.
  - Smooth backdrop dimming and body scroll lock when open.

#### B. Hero Section (`HeroSection`)
- **Pill / Badge Tag**: Eyebrow indicator (e.g., "Microsoft Solutions Partner" or client equivalent accolade/specialty).
- **Primary Heading (`h1`)**: High-impact, multi-line typography with balanced line breaks and strategic emphasis.
- **Sub-headline**: Concise value proposition explaining how the company solves core customer pain points.
- **Action Group**:
  - Primary CTA button with subtle hover micro-interaction (scale/arrow transition).
  - Secondary CTA link ("Explore Solutions" or "Case Studies").
- **Visual Anchor / Graphic**: Tech-forward abstract graphic, 3D element, or high-definition product visual aligned with client domain.

#### C. Performance Metrics & Stats Grid (`StatsSection`)
- **Layout**: 4 to 5 responsive metric cards (e.g., `99% Downtime Reduction`, `50% Cost Optimization`, `24/7 Monitoring`, `10x Performance Boost`, `100% Reliability`).
- **Interactive Behavior**:
  - Numbers animate on scroll viewport trigger (count up from 0).
  - Cards feature subtle borders, hover elevation, and muted secondary text descriptions.

#### D. Social Proof & Testimonials (`TestimonialsSection`)
- **Layout**: Prominent quote display with customer testimonial text, author name, client organization/role, and portrait avatar.
- **Navigation Controls**: Clean Previous / Next buttons with tactile hover feedback and swipe support on mobile devices.

#### E. Ecosystem / Partner Logo Marquee (`PartnerMarquee`)
- **Layout**: Continuous horizontal infinite scrolling ribbon.
- **Interactivity**: Smooth CSS hardware-accelerated movement (`transform: translateX`) with pause-on-hover capability.
- **Greyscale to Color / Opacity Shift**: Logos render with subtle monochromatic styling and brighten on hover.

#### F. Interactive Solutions & Services Showcase (`ServicesSection`)
- **Layout**: Split-pane or categorized modular cards (inspired by LogicEra's Left/Right service presentation).
- **Features**:
  - Category tags / badges.
  - Distinct headline for each service vertical.
  - Value bullet points or short descriptions.
  - Direct action trigger ("Book Free Consultation", "Explore Service").
- **Responsive Handling**: Stacks elegantly into single-column cards on tablet/mobile with consistent padding and readable font sizes.

#### G. Kinetic Typography Ticker (`TickerStrip`)
- **Layout**: High-energy uppercase ticker (e.g., "MODERNIZE • INNOVATE • ACCELERATE").
- **Styling**: Large tracking, outline or muted font style, continuous seamless translation.

#### H. Consultation / Lead Intake CTA (`LeadSection`)
- **Content**: Compelling closing headline urging the user to take action.
- **Lead Capture**: Clean email intake input with client-side format validation, submit state handling, and privacy disclaimer checkbox/notice.

#### I. Global Footer (`Footer`)
- **Multi-column Structure**:
  - Column 1: Brand logo, concise mission statement, copyright & current year.
  - Column 2: Solutions / Services links.
  - Column 3: Company / About links.
  - Column 4: Resources & Legal (Privacy Policy, Terms of Service).
- **Social Links**: Accessible SVG icon links to LinkedIn, Twitter/X, GitHub, etc.

---

## 3. Brand Adaptation & Content Schema

The agent must inject the client's assets into the structured JSON schema below:

```typescript
// types/content.ts
export interface BrandConfig {
  name: string;
  tagline: string;
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };
}

export interface MetricItem {
  id: string;
  value: string; // e.g. "99%"
  numericValue: number; // for counter animation, e.g. 99
  unit?: string; // e.g. "%" or "x"
  label: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  category: string;
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl?: string;
}
```

### Color Palette Translation Protocol
When the client supplies their logo and primary brand color:
1. **Primary Brand Accent**: Replaces the source site's primary accent (e.g. blue/cyan accents).
2. **Secondary / Gradient Accents**: Derived mathematically (analogous or complementary tone) from the client's logo hue.
3. **Neutrals & Dark/Light Canvas**: Maintain the source site's deep contrast ratios (`#0a0d14`, `#111827`, `#f9fafb`, slate/zinc scales) to preserve readability and modern tech aesthetic.

---

## 4. Non-Functional & Technical Acceptance Criteria

1. **Responsiveness**: Flawless layout and typography scaling across standard breakpoints:
   - Mobile: `360px - 640px`
   - Tablet: `641px - 1023px`
   - Desktop: `1024px - 1440px`
   - Ultra-wide: `1441px+` (constrained by `max-w-7xl` container)
2. **Page Performance & SEO**:
   - Dynamic OpenGraph and Twitter cards in `app/layout.tsx`.
   - Core Web Vitals targets: LCP < 1.8s, CLS < 0.05, FID/INP < 100ms.
   - All images rendered via `next/image` with WebP/AVIF formatting.
3. **Accessibility (a11y)**:
   - Proper ARIA labels on icon buttons and mobile toggles (`aria-expanded`, `aria-label`).
   - Color contrast ratio >= 4.5:1 on all readable text.
   - Smooth focus indicators for keyboard navigation.
4. **Code Cleanliness**:
   - Zero ESLint warnings or TypeScript compilation errors.
   - Self-contained, modular section components in `components/sections/`.
