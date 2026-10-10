"use client";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, SplitText, useGSAP, motionQueries } from "@/lib/motion";

export function PageMotion() {
  const pathname = usePathname();
  useGSAP(() => {
    let disposed = false;
    let media: gsap.MatchMedia | undefined;
    document.fonts.ready.then(() => {
      if (disposed) return;
      media = gsap.matchMedia();
      media.add(motionQueries.allowed, context => {
        const splits: SplitText[] = [];
        const bindings: Array<() => void> = [];
        function words(element: HTMLElement) {
          const split = SplitText.create(element, { type: "words", wordsClass: "motion-word", aria: "auto" });
          splits.push(split);
          return split.words;
        }
        function revealHeading(element: HTMLElement) {
          gsap.fromTo(words(element), { yPercent: 100, clipPath: "inset(100% 0 0 0)" }, {
            yPercent: 0, clipPath: "inset(-20% -10% -10% 0)", duration: .8, stagger: .05, ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 80%", end: "bottom 20%", once: true }
          });
        }
        function revealParagraph(element: HTMLElement, intro = false) {
          const split = SplitText.create(element, {
            type: "lines", linesClass: "motion-line", aria: "auto", autoSplit: true,
            onSplit: self => gsap.fromTo(self.lines, { yPercent: 100, clipPath: "inset(0% 0 120% 0)" }, {
              yPercent: 0, clipPath: "inset(-20% -10% -10% 0)", duration: intro ? 1 : .8,
              stagger: intro ? .06 : .1, ease: "power2.out",
              scrollTrigger: { trigger: element, start: intro ? "top center" : "top 80%", end: "bottom 20%", once: true }
            })
          });
          splits.push(split);
        }
        document.querySelectorAll<HTMLElement>("#intro-title, .section-heading h2, .ecosystem-heading h2").forEach(revealHeading);
        document.querySelectorAll<HTMLElement>("#about .intro-grid > div > p").forEach(element => revealParagraph(element, true));
        document.querySelectorAll<HTMLElement>(".section-heading > p, .ecosystem-heading > p, .contact-copy > p, .footer-brand > p").forEach(element => revealParagraph(element));

        const hero = document.querySelector<HTMLElement>(".hero");
        const visual = hero?.querySelector<HTMLElement>(".hero-visual");
        if (hero && visual) {
          gsap.fromTo(visual.querySelectorAll(".diagram-wire path, .diagram-wire circle"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 16, delay: .5, ease: "power2.out" });
          gsap.from(visual.querySelectorAll(".hero-illustration > path"), { opacity: 0, scale: .8, transformOrigin: "50% 50%", duration: .5, ease: "power2.out" });
          gsap.from(hero.querySelectorAll(".hero-actions > *, .hero-scroll"), {
            yPercent: 100, opacity: 0, duration: 1, stagger: .2, ease: "power3.out",
            scrollTrigger: { trigger: ".hero-actions", start: "top 90%", once: true }
          });
          if (matchMedia(motionQueries.pointer).matches) {
            const setX = gsap.quickTo(visual, "x", { duration: .5, ease: "power2.out" });
            const setY = gsap.quickTo(visual, "y", { duration: .5, ease: "power2.out" });
            const move = (event: PointerEvent) => {
              const bounds = hero.getBoundingClientRect();
              setX(((event.clientX - bounds.left) / bounds.width - .5) * 30);
              setY(((event.clientY - bounds.top) / bounds.height - .5) * 30);
            };
            const leave = () => { setX(0); setY(0); };
            hero.addEventListener("pointermove", move);
            hero.addEventListener("pointerleave", leave);
            bindings.push(() => { hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", leave); });
          }
        }

        const approach = document.querySelector<HTMLElement>(".approach-section");
        const heading = approach?.querySelector<HTMLElement>(".approach-statement h2");
        const cta = approach?.querySelector<HTMLElement>(".approach-statement .button");
        if (approach && heading && cta) {
          const headingWords = words(heading);
          gsap.set(headingWords, { autoAlpha: 0, yPercent: 100, rotation: 3, clipPath: "inset(100% 0 0 0)" });
          gsap.set(cta, { scale: 0, filter: "blur(12px)", opacity: 0 });
          const timeline = gsap.timeline({ scrollTrigger: { trigger: approach, start: () => innerWidth < 1024 ? "top 80%" : "top center", end: "bottom center", scrub: 1, invalidateOnRefresh: true } });
          timeline.to(headingWords, { autoAlpha: 1, yPercent: 0, rotation: 0, clipPath: "inset(-20% 0 0 0)", duration: 2, stagger: .15, ease: "power2.out" }, 0)
            .addLabel("heading")
            .to(cta, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 2, ease: "back.out(1.7)" }, "heading-=1")
            .to(cta, { duration: 2 });
          const focus = () => timeline.progress(1);
          cta.addEventListener("focus", focus);
          bindings.push(() => cta.removeEventListener("focus", focus));
        }

        const ecosystem = document.querySelector(".ecosystem-section");
        if (ecosystem) gsap.from(ecosystem.querySelectorAll(".ticker-item"), { scale: 0, opacity: 0, duration: .8, ease: "back.out(1.7)", scrollTrigger: { trigger: ecosystem, start: "top 100%", end: "bottom 0%", toggleActions: "play reverse play reverse" } });

        const buttonState = (event: PointerEvent | FocusEvent, entered: boolean) => {
          const button = event.target instanceof Element ? event.target.closest(".button") : null;
          if (!button || event.relatedTarget instanceof Node && button.contains(event.relatedTarget)) return;
          if (!entered && button.matches(":hover, :focus-within")) return;
          const content = button.querySelector(".button-content");
          const dot = button.querySelector(".button-dot");
          if (!content || !dot) return;
          context.add(() => {
            gsap.to(content, { x: entered ? 8 : 0, duration: .4, ease: entered ? "back.out" : "back.in", overwrite: "auto" });
            gsap.to(dot, { opacity: entered ? 1 : 0, duration: .4, ease: "none", overwrite: "auto" });
          });
        };
        const enter = (event: PointerEvent | FocusEvent) => buttonState(event, true);
        const exit = (event: PointerEvent | FocusEvent) => buttonState(event, false);
        document.addEventListener("pointerover", enter);
        document.addEventListener("pointerout", exit);
        document.addEventListener("focusin", enter);
        document.addEventListener("focusout", exit);
        bindings.push(() => { document.removeEventListener("pointerover", enter); document.removeEventListener("pointerout", exit); document.removeEventListener("focusin", enter); document.removeEventListener("focusout", exit); });
        ScrollTrigger.refresh();
        return () => { bindings.forEach(cleanup => cleanup()); splits.forEach(split => split.revert()); };
      });
    });
    return () => { disposed = true; media?.revert(); };
  }, { dependencies: [pathname], revertOnUpdate: true });
  return null;
}
