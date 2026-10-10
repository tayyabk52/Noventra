import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { brandColors } from "@/lib/brand-colors";
import { IntroLoader } from "@/components/motion/intro-loader";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { PageMotion } from "@/components/motion/page-motion";
import { RouteTransition } from "@/components/motion/route-transition";
import "lenis/dist/lenis.css";
import "swiper/css";
import "./globals.css";
import "./motion.css";

const openSans = localFont({ src: "../public/fonts/open-sans-0.woff2", variable: "--font-open-sans", display: "swap", weight: "300 800", fallback: ["Arial"], adjustFontFallback: "Arial" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3010";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Noventra | AI that moves business forward", template: "%s | Noventra" },
  description: "Practical AI, intelligent automation, and thoughtful engineering. Noventra helps turn business challenges into useful, working solutions.",
  openGraph: { title: "Noventra | AI that moves business forward", description: "Practical intelligence. Built around your business.", type: "website", siteName: "Noventra", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Noventra | AI that moves business forward", description: "Practical intelligence. Built around your business." },
  robots: { index: true, follow: true }
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: brandColors.hero };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth" className={openSans.variable}><body><IntroLoader /><SmoothScroll /><PageMotion /><RouteTransition /><noscript><style>{`.intro-loader { display: none; } .metrics-carousel .swiper-wrapper { display: grid; transform: none !important; } .metrics-carousel .swiper-slide { width: auto; } .metrics-carousel .swiper-slide[data-copy="duplicate"], .metrics-carousel .carousel-toolbar, .hero-animation-control, .motion-pause { display: none; }`}</style></noscript><Navbar />{children}<Footer /></body></html>;
}
