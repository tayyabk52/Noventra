"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, motionQueries } from "@/lib/motion";
import { registerScrollAnchor, scrollToPosition } from "@/lib/scroll";

export interface ServiceScenesProps { children: readonly ReactNode[]; labels: readonly string[] }
export function ServiceScenes({ children, labels }: Readonly<ServiceScenesProps>) {
  const scope = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const choose = useRef<(index: number, immediate?: boolean, onComplete?: () => void) => void>(() => {});
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [sceneSize, setSceneSize] = useState(1);
  const [pinned, setPinned] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const count = Math.ceil(children.length / sceneSize);

  useGSAP(() => {
    let disposed = false;
    const media = gsap.matchMedia();
    const element = stage.current;
    if (!element) return;
    const details = Array.from(element.querySelectorAll<HTMLDetailsElement>("details"));
    const disclosure = () => {
      const opened = details.find(detail => detail.open);
      const wasPinned = element.classList.contains("is-pinned");
      setExpanded(!!opened);
      if (opened && wasPinned) requestAnimationFrame(() => {
        const header = document.querySelector(".header-inner")?.getBoundingClientRect().height || 90;
        scrollToPosition(Math.max(0, opened.getBoundingClientRect().top + scrollY - header - 20), true);
      });
    };
    details.forEach(detail => detail.addEventListener("toggle", disclosure));

    document.fonts.ready.then(() => {
      if (disposed) return;
      media.add({ allowed: motionQueries.allowed, desktop: motionQueries.desktop }, context => {
        const cards = Array.from(element.querySelectorAll<HTMLElement>(".service-card"));
        const desktop = !!context.conditions?.desktop;
        const size = desktop ? 2 : 1;
        const scenes = desktop ? Array.from(element.querySelectorAll<HTMLElement>(".service-panel")) : cards;
        const cleanups: Array<() => void> = [];
        const splits: SplitText[] = [];
        const animations = new Map<HTMLElement, gsap.core.Tween>();
        setSceneSize(size);
        activeRef.current = 0;
        setActive(0);

        const reveal = (card: HTMLElement) => {
          const tween = animations.get(card);
          if (tween) { tween.play(); return; }
          const heading = card.querySelector("h3");
          if (!heading) return;
          const split = SplitText.create(heading, { type: "words", wordsClass: "motion-word", aria: "auto" });
          splits.push(split);
          animations.set(card, gsap.fromTo(split.words, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, stagger: .05, ease: "back.out(1.7)" }));
        };
        const reset = () => { choose.current = () => {}; setPinned(false); element.classList.remove("is-pinned"); };
        const cleanup = () => { reset(); cleanups.forEach(remove => remove()); splits.forEach(split => split.revert()); };
        if (!context.conditions?.allowed || expanded) { reset(); return cleanup; }

        // LogicEra keeps mobile solutions in normal document flow. Do the same here:
        // disclosures must be able to grow a card without fighting a pinned layer.
        if (!desktop) {
          reset();
          cards.forEach(card => ScrollTrigger.create({ trigger: card, start: "top 80%", once: true, onEnter: () => context.add(() => reveal(card)) }));
          return cleanup;
        }

        element.classList.add("is-pinned");
        const headerOffset = () => (document.querySelector(".header-inner")?.getBoundingClientRect().height || 90) + 10;
        const measure = () => Math.ceil(Math.max(...scenes.map(scene => scene.scrollHeight)));
        const height = measure();
        if (height > innerHeight - headerOffset() - 20) {
          // Retain readable normal-flow cards when an entire scene cannot fit.
          reset();
          cards.forEach(card => ScrollTrigger.create({ trigger: card, start: "top 80%", once: true, onEnter: () => context.add(() => reveal(card)) }));
          return cleanup;
        }
        setPinned(true);
        gsap.set(element, { height });
        gsap.set(scenes, { xPercent: index => index === 0 ? 0 : 100 });
        const sceneTimes = [1];
        const timeline = gsap.timeline({
          paused: true,
          onUpdate: () => {
            const next = Math.max(0, Math.min(scenes.length - 1, Math.floor((timeline.time() + 1) / 5)));
            if (activeRef.current !== next) {
              activeRef.current = next;
              setActive(next);
              context.add(() => cards.slice(next * size, next * size + size).forEach(reveal));
            }
          }
        });
        timeline.to({}, { duration: 2 });
        for (let index = 1; index < scenes.length; index++) {
          timeline.to(scenes[index - 1], { xPercent: -100, duration: 3, ease: "power2.out" })
            .to(scenes[index], { xPercent: 0, duration: 3, ease: "power2.out" }, "<")
            .to({}, { duration: 2 });
          sceneTimes.push(index * 5 + 1);
        }
        const trigger = ScrollTrigger.create({
          animation: timeline, trigger: element,
          start: () => `top ${headerOffset()}px`, end: () => `+=${innerHeight * 5}`,
          pin: true, pinSpacing: true, scrub: 1, invalidateOnRefresh: true,
          onRefreshInit: () => { gsap.set(element, { height: measure() }); }
        });
        const select = (index: number, immediate = false, onComplete?: () => void) => {
          if (!trigger) return;
          const scene = Math.max(0, Math.min(scenes.length - 1, index));
          const progress = sceneTimes[scene] / timeline.duration();
          scrollToPosition(trigger.start + progress * (trigger.end - trigger.start), immediate, () => {
            trigger.getTween()?.progress(1);
            timeline.progress(progress);
            onComplete?.();
          });
          if (immediate) { ScrollTrigger.update(); trigger.getTween()?.progress(1); timeline.progress(progress); }
        };
        choose.current = select;
        cards.forEach((card, index) => {
          cleanups.push(registerScrollAnchor(card.id, complete => select(Math.floor(index / size), false, complete)));
          const focus = () => { if (activeRef.current !== Math.floor(index / size)) select(Math.floor(index / size), true); };
          card.addEventListener("focusin", focus);
          cleanups.push(() => card.removeEventListener("focusin", focus));
          if (!matchMedia(motionQueries.pointer).matches) return;
          const heading = card.querySelector(".service-title-motion");
          const cta = card.querySelector(".service-cta");
          if (!heading || !cta) return;
          gsap.set(heading, { y: -32 });
          gsap.set(cta, { y: 15, opacity: 0, scale: .95 });
          const enter = () => context.add(() => {
            gsap.to(heading, { y: 0, duration: .4, ease: "power2.out", overwrite: "auto" });
            gsap.to(cta, { y: 0, opacity: 1, scale: 1, duration: .5, delay: .1, ease: "power2.out", overwrite: "auto" });
          });
          const leave = () => { if (card.matches(":hover, :focus-within")) return; context.add(() => {
            gsap.to(heading, { y: -32, duration: .4, ease: "power2.out", overwrite: "auto" });
            gsap.to(cta, { y: 10, opacity: 0, scale: .95, duration: .3, ease: "power2.out", overwrite: "auto" });
          }); };
          card.addEventListener("pointerenter", enter); card.addEventListener("pointerleave", leave);
          card.addEventListener("focusin", enter); card.addEventListener("focusout", leave);
          cleanups.push(() => { card.removeEventListener("pointerenter", enter); card.removeEventListener("pointerleave", leave); card.removeEventListener("focusin", enter); card.removeEventListener("focusout", leave); });
        });
        ScrollTrigger.create({ trigger: element, start: "top 80%", once: true, onEnter: () => context.add(() => cards.slice(0, size).forEach(reveal)) });
        ScrollTrigger.refresh();
        const focusedCard = cards.findIndex(card => card.contains(document.activeElement));
        if (focusedCard >= 0) select(Math.floor(focusedCard / size), true);
        else if (location.hash) {
          const linked = cards.findIndex(card => `#${card.id}` === location.hash);
          if (linked >= 0) select(Math.floor(linked / size), true);
        }
        return cleanup;
      });
    });
    return () => { disposed = true; details.forEach(detail => detail.removeEventListener("toggle", disclosure)); media.revert(); };
  }, { scope, dependencies: [expanded], revertOnUpdate: true });

  return <div ref={scope} className="service-scenes"><div className="carousel-toolbar service-scene-toolbar" hidden={!pinned}><span className="carousel-position">{String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}<span>{labels.slice(active * sceneSize, active * sceneSize + sceneSize).join(" + ")}</span></span><div className="carousel-controls"><button className="icon-button" onClick={() => choose.current(active - 1)} disabled={active === 0} aria-label="Previous services"><ArrowLeft size={18} aria-hidden="true" /></button><button className="icon-button" onClick={() => choose.current(active + 1)} disabled={active === count - 1} aria-label="Next services"><ArrowRight size={18} aria-hidden="true" /></button></div></div><div className="services-grid" ref={stage}>{Array.from({ length: Math.ceil(children.length / 2) }, (_, index) => <div className="service-panel" key={index}>{children.slice(index * 2, index * 2 + 2)}</div>)}</div></div>;
}
