"use client";
import { useEffect, useRef } from "react";
import { COUNTER_DURATION_MS, counterEase } from "@/lib/animations";
export interface CounterProps { value: number; label: string; delayMs?: number }
export function Counter({ value, label, delayMs = 0 }: Readonly<CounterProps>) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    let frame = 0;
    const count = (delay: number) => {
      if (motion.matches) return;
      cancelAnimationFrame(frame);
      const start = performance.now() + delay;
      const tick = (now: number) => {
        const progress = Math.max(0, Math.min((now - start) / COUNTER_DURATION_MS, 1));
        element.textContent = String(Math.round(value * counterEase(progress))).padStart(2, "0");
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      count(delayMs);
    }, { threshold: 0.5 });
    const replay = () => { observer.disconnect(); count(0); };
    const synchronizeMotion = () => {
      if (!motion.matches) return;
      observer.disconnect(); cancelAnimationFrame(frame);
      element.textContent = String(value).padStart(2, "0");
    };
    observer.observe(element);
    element.addEventListener("noventra:counter-replay", replay);
    motion.addEventListener("change", synchronizeMotion);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); element.removeEventListener("noventra:counter-replay", replay); motion.removeEventListener("change", synchronizeMotion); };
  }, [value, delayMs]);
  return <span className="counter" role="img" aria-label={`${String(value).padStart(2, "0")}. ${label}`}><span aria-hidden="true" ref={ref}>{String(value).padStart(2, "0")}</span></span>;
}
