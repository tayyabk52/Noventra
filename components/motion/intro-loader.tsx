"use client";
import { useRef } from "react";
import { gsap, useGSAP, motionQueries } from "@/lib/motion";

export function IntroLoader() {
  const scope = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(motionQueries.allowed, () => {
      const element = scope.current;
      if (!element || !count.current) return;
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const duration = Math.max(1.2, Math.min(8, (navigation?.responseEnd || 1200) / 1000));
      const value = { progress: 0 };
      gsap.timeline()
        .from(element.querySelectorAll("span"), { opacity: 0, duration: .5, ease: "power2.out" }, 0)
        .to(value, { progress: 100, duration, ease: "power2.out", onUpdate: () => { if (count.current) count.current.textContent = String(Math.round(value.progress)); } }, 0)
        .to(element, { scale: 0, rotation: 3, duration: 1, ease: "expoScale(0.5,7,none)" })
        .set(element, { display: "none" });
    });
    return () => media.revert();
  }, { scope });
  return <div className="intro-loader" ref={scope} aria-hidden="true"><div><span ref={count}>0</span><span>%</span></div></div>;
}
