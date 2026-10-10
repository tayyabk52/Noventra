"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/motion";
export interface HeaderSurfaceProps { children: ReactNode }
export function HeaderSurface({ children }: Readonly<HeaderSurfaceProps>) {
  const [scrolled, setScrolled] = useState(false);
  const sentinel = useRef<HTMLSpanElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const marker = sentinel.current;
    if (!marker) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(marker);
    return () => observer.disconnect();
  }, []);
  useGSAP(() => {
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : .6;
    const sourcePadding = innerWidth >= 1800 ? 2.5 : innerWidth >= 1500 ? 1.8 : innerWidth >= 1200 ? 1.6 : innerWidth >= 992 ? 1.4 : innerWidth >= 768 ? 1.2 : innerWidth >= 676 ? 1 : innerWidth >= 475 ? .8 : 1;
    // Source padding compression translated to a transform on our fixed chrome.
    gsap.to(".header-inner", { y: scrolled ? -(sourcePadding - 1) * 8 : 0, duration, ease: "power2.out", overwrite: "auto" });
    gsap.to(".header-inner > .brand-logo", { scale: scrolled ? .9 : 1, duration, ease: "power2.out", transformOrigin: "left center", overwrite: "auto" });
    gsap.to(".desktop-nav", { scale: scrolled ? .9 : 1, duration, ease: "power2.out", transformOrigin: "center center", overwrite: "auto" });
    gsap.to(".header-actions", { scale: scrolled ? .9 : 1, duration, ease: "power2.out", transformOrigin: "right center", overwrite: "auto" });
  }, { scope: header, dependencies: [scrolled] });
  return <><span ref={sentinel} className="header-sentinel" aria-hidden="true" /><header ref={header} className={`site-header${scrolled ? " is-scrolled" : ""}`}>{children}</header></>;
}
