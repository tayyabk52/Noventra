"use client";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TestimonialItem } from "@/types/content";
import { SWIPE_THRESHOLD_PX } from "@/lib/animations";
import { gsap, SplitText, useGSAP, motionQueries } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export interface ApproachCarouselProps { items: readonly TestimonialItem[] }
export function ApproachCarousel({ items }: Readonly<ApproachCarouselProps>) {
  const scope = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const current = useRef(0);
  const start = useRef<number | null>(null);
  const transitioning = useRef(false);
  const exit = useRef<gsap.core.Tween | null>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();
  const item = items[index];

  const change = useCallback((direction: number) => {
    if (transitioning.current) return;
    transitioning.current = true;
    const next = (current.current + direction + items.length) % items.length;
    const swap = () => { current.current = next; setIndex(next); transitioning.current = false; };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { swap(); return; }
    exit.current?.kill();
    exit.current = gsap.to(scope.current?.querySelectorAll("blockquote p, .principle-author") || [], { opacity: 0, duration: .3, onComplete: swap });
  }, [items.length]);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(motionQueries.allowed, () => {
      const paragraph = scope.current?.querySelector("blockquote p");
      const author = scope.current?.querySelector(".principle-author");
      if (!paragraph || !author) return;
      gsap.set(paragraph, { opacity: 1 });
      const split = SplitText.create(paragraph, { type: "lines", linesClass: "motion-line", aria: "auto", autoSplit: true,
        onSplit: self => gsap.fromTo(self.lines, { yPercent: 100, opacity: 0, clipPath: "inset(0 0 100% 0)" }, { yPercent: 0, opacity: 1, clipPath: "inset(0 0 0 0)", duration: 1, stagger: .05, ease: "power3.out" })
      });
      gsap.fromTo(author, { opacity: 0 }, { opacity: 1, duration: .4 });
      return () => split.revert();
    });
    return () => media.revert();
  }, { scope, dependencies: [index], revertOnUpdate: true });

  useEffect(() => {
    const element = scope.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .15 });
    observer.observe(element);
    return () => { observer.disconnect(); exit.current?.kill(); };
  }, []);
  useEffect(() => {
    if (paused || hovered || focused || !inView || reduced) return;
    const interval = setInterval(() => change(1), 5000);
    return () => clearInterval(interval);
  }, [paused, hovered, focused, inView, reduced, change]);

  return <div ref={scope} className="approach-carousel" role="group" aria-roledescription="carousel" aria-label="Noventra principles"
    onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }} onPointerLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    onTouchStart={event => { start.current = event.touches[0].clientX; }} onTouchCancel={() => { start.current = null; }} onTouchEnd={event => { if (start.current === null) return; const distance = event.changedTouches[0].clientX - start.current; if (Math.abs(distance) > SWIPE_THRESHOLD_PX) change(distance < 0 ? 1 : -1); start.current = null; }}>
    <div className="principle-top"><span className="principle-number">{String(index + 1).padStart(2, "0")}<span> / {String(items.length).padStart(2, "0")}</span></span><div className="carousel-controls"><button onClick={() => change(-1)} className="icon-button" aria-label="Previous principle"><ArrowLeft size={18} aria-hidden="true" /></button><button onClick={() => setPaused(!paused)} className="icon-button motion-pause" aria-label={`${paused ? "Resume" : "Pause"} principle animation`} aria-pressed={paused}>{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button><button onClick={() => change(1)} className="icon-button" aria-label="Next principle"><ArrowRight size={18} aria-hidden="true" /></button></div></div>
    <div className="principle-content" key={item.id} aria-live={paused || focused ? "polite" : "off"} aria-atomic="true"><blockquote><p>“{item.quote}”</p></blockquote><div className="principle-author"><Image src="/brand/noventra-mark.png" width={36} height={44} alt="" /><div><p>{item.author}</p><span>{item.role}</span></div></div></div>
  </div>;
}
