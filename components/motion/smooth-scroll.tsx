"use client";
import Lenis from "lenis";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, scrollEase } from "@/lib/motion";
import { setSmoothScroller, scrollToPosition, resolveScrollAnchor } from "@/lib/scroll";

export function SmoothScroll() {
  const pathname = usePathname();
  useEffect(() => {
    let lenis: Lenis | null = null;
    let modalObserver: MutationObserver | null = null;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(min-width: 769px) and (hover: hover) and (pointer: fine)");
    const tick = (time: number) => lenis?.raf(time * 1000);
    function configure() {
      gsap.ticker.remove(tick);
      modalObserver?.disconnect();
      lenis?.destroy();
      lenis = null;
      setSmoothScroller(null);
      if (motion.matches || !desktop.matches || navigator.maxTouchPoints > 0) return;
      lenis = new Lenis({
        lerp: .1, duration: 1, easing: scrollEase,
        smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 2,
        orientation: "vertical", gestureOrientation: "vertical", infinite: false,
        syncTouch: true, syncTouchLerp: .1, touchInertiaMultiplier: 50,
        prevent: node => !!node.closest("dialog, [data-lenis-prevent], textarea")
      });
      setSmoothScroller(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      const synchronizeModal = () => document.querySelector("dialog[open]") ? lenis?.stop() : lenis?.start();
      modalObserver = new MutationObserver(synchronizeModal);
      modalObserver.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
      synchronizeModal();
    }
    function anchorClick(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      let target: HTMLElement | null;
      try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
      if (!target) return;
      const destination = target;
      event.preventDefault();
      if (location.hash !== url.hash) history.pushState(null, "", url.hash);
      // Let a mobile drawer's own onClick close its native dialog first.
      requestAnimationFrame(() => {
        const header = document.querySelector(".header-inner")?.getBoundingClientRect().height || 90;
        const focus = () => {
          const hadTabIndex = destination.hasAttribute("tabindex");
          if (!hadTabIndex) destination.setAttribute("tabindex", "-1");
          destination.focus({ preventScroll: true });
          if (!hadTabIndex) destination.addEventListener("blur", () => destination.removeAttribute("tabindex"), { once: true });
        };
        if (!resolveScrollAnchor(destination.id, focus)) scrollToPosition(Math.max(0, destination.getBoundingClientRect().top + scrollY - header - 10), false, focus);
      });
    }
    configure();
    motion.addEventListener("change", configure);
    desktop.addEventListener("change", configure);
    document.addEventListener("click", anchorClick, true);
    return () => {
      document.removeEventListener("click", anchorClick, true);
      motion.removeEventListener("change", configure);
      desktop.removeEventListener("change", configure);
      modalObserver?.disconnect();
      gsap.ticker.remove(tick);
      lenis?.destroy();
      setSmoothScroller(null);
    };
  }, [pathname]);
  return null;
}
