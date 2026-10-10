"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/motion";

export function RouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  useEffect(() => {
    function uncover() {
      if (fallback.current) clearTimeout(fallback.current);
      animation.current?.kill();
      animation.current = gsap.timeline({ onComplete: () => { pending.current = false; } })
        .to([curtain.current, backdrop.current], { opacity: 0, duration: .5, ease: "power2.inOut" })
        .set([curtain.current, backdrop.current], { visibility: "hidden", pointerEvents: "none" });
    }
    function navigate(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const destination = new URL(link.href, location.href);
      if (destination.origin !== location.origin || destination.pathname === location.pathname) return;
      event.preventDefault();
      if (pending.current) return;
      pending.current = true;
      animation.current?.kill();
      gsap.set(backdrop.current, { visibility: "visible", opacity: 0 });
      gsap.set(curtain.current, { visibility: "visible", opacity: 1, y: -100, rotation: 15, rotationX: 45, scale: .3, clipPath: "inset(0 25% 75% 25%)", transformPerspective: 1000 });
      animation.current = gsap.timeline()
        .to(backdrop.current, { opacity: 1, duration: .2, ease: "power2.out" })
        .to(curtain.current, { y: 0, rotation: 0, rotationX: 0, scale: 1, clipPath: "inset(0 0 0 0)", duration: .6, ease: "power2.in", onComplete: () => router.push(`${destination.pathname}${destination.search}${destination.hash}`) }, "-=.1");
      fallback.current = setTimeout(uncover, 5000);
    }
    if (pending.current) uncover();
    document.addEventListener("click", navigate, true);
    return () => { document.removeEventListener("click", navigate, true); };
  }, [pathname, router]);
  useEffect(() => () => { if (fallback.current) clearTimeout(fallback.current); animation.current?.kill(); }, []);
  return <><div ref={backdrop} className="route-backdrop" aria-hidden="true" /><div ref={curtain} className="route-curtain" aria-hidden="true" /></>;
}
