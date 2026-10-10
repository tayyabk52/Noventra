"use client";
import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP, motionQueries } from "@/lib/motion";

export function HeroHeadline() {
  const scope = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  useGSAP(() => {
    let disposed = false;
    const media = gsap.matchMedia();
    document.fonts.ready.then(() => {
      if (disposed) return;
      media.add(motionQueries.allowed, () => {
        const heading = scope.current?.querySelector("h1");
        if (!heading) return;
        const split = SplitText.create(heading, { type: "words", wordsClass: "motion-word", aria: "auto" });
        const animation = gsap.timeline({ repeat: -1, repeatDelay: .2, paused: pausedRef.current });
        animation.fromTo(split.words, { yPercent: 100, opacity: 0, rotation: 5, clipPath: "inset(100% 0 0 0)" }, { yPercent: 0, opacity: 1, rotation: 0, clipPath: "inset(-20% -10% -10% 0)", duration: 2, stagger: .1, ease: "expo.out" })
          .to(split.words, { yPercent: 100, opacity: 0, rotation: 4, clipPath: "inset(100% 0 0 0)", duration: .8, stagger: .05, ease: "back.inOut" }, "+=3");
        timeline.current = animation;
        return () => { timeline.current = null; split.revert(); };
      });
    });
    return () => { disposed = true; media.revert(); };
  }, { scope });
  function toggle() {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    const animation = timeline.current;
    if (next && animation) {
      // Pause on a readable frame, rather than freezing a clipped word.
      animation.time(2 + .1 * (scope.current?.querySelectorAll(".motion-word").length || 1)).pause();
    } else animation?.resume();
  }
  return <div className="hero-headline" ref={scope}><h1 id="hero-title"><span className="hero-line">AI that moves</span><span className="hero-line">business</span><span className="hero-line hero-line--accent">forward.</span></h1><button className="icon-button hero-animation-control" onClick={toggle} aria-label={`${paused ? "Resume" : "Pause"} headline animation`} aria-pressed={paused}>{paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}</button></div>;
}
