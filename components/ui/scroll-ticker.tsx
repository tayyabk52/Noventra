"use client";
import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { gsap, useGSAP, motionQueries } from "@/lib/motion";

export interface ScrollTickerProps { items: readonly string[] }
export function ScrollTicker({ items }: Readonly<ScrollTickerProps>) {
  const scope = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [isPaused, setPaused] = useState(false);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(motionQueries.allowed, () => {
      const element = scope.current;
      if (!element) return;
      const rows = element.querySelectorAll<HTMLElement>(".scroll-ticker-row");
      const top = rows[0];
      const bottom = rows[1];
      if (!top || !bottom) return;
      let pointer = 0;
      gsap.set(rows, { xPercent: -50, willChange: "transform" });
      const setTop = gsap.quickSetter(top, "xPercent");
      const setBottom = gsap.quickSetter(bottom, "xPercent");
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const bounds = element.getBoundingClientRect();
        pointer = Math.max(-1, Math.min(1, (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2)));
      };
      const leave = () => { pointer = 0; };
      const tick = () => {
        if (paused.current) return;
        const bounds = element.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
        const offset = 25 * progress + 20 * pointer;
        setTop(-50 + offset);
        setBottom(-50 - offset);
      };
      element.addEventListener("pointermove", move, { passive: true });
      element.addEventListener("pointerleave", leave, { passive: true });
      gsap.ticker.add(tick);
      tick();
      return () => { element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave); gsap.ticker.remove(tick); };
    });
    return () => media.revert();
  }, { scope });
  return <div ref={scope} className="scroll-ticker"><span className="sr-only">{items.join(". ")}.</span>{[0, 1].map(row => <div key={row} className={`scroll-ticker-row${row === 1 ? " scroll-ticker-row--outline" : ""}`} aria-hidden="true">{[0, 1, 2, 3, 4].flatMap(copy => items.map(item => <span key={`${copy}-${item}`}>{item}<span className="scroll-ticker-separator">✳</span></span>))}</div>)}<button className="icon-button scroll-ticker-control motion-pause" onClick={() => { paused.current = !paused.current; setPaused(paused.current); }} aria-label={`${isPaused ? "Resume" : "Pause"} statement animation`} aria-pressed={isPaused}>{isPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button></div>;
}
