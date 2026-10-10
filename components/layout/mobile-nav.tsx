"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation } from "@/lib/content";
import { gsap } from "@/lib/motion";
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element?.showModal();
    if (element && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animation.current = gsap.timeline()
        .fromTo(element.querySelector(".drawer-inner"), { opacity: 0, scale: .85, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: .6, ease: "power2.out" })
        .fromTo(element.querySelectorAll(".drawer-links a svg"), { opacity: 0, scale: .5, rotation: -10 }, { opacity: 1, scale: 1, rotation: 0, duration: .7, stagger: .08, ease: "back.out(1.5)" });
    }
    return () => { document.body.style.overflow = previous; animation.current?.kill(); };
  }, [open]);
  function close(immediate = false) {
    const finish = () => { dialog.current?.close(); setOpen(false); trigger.current?.focus({ preventScroll: true }); };
    animation.current?.kill();
    if (immediate || matchMedia("(prefers-reduced-motion: reduce)").matches) { finish(); return; }
    animation.current = gsap.timeline({ onComplete: finish })
      .to(dialog.current?.querySelector(".drawer-inner") || [], { scale: 1.05, duration: .12, ease: "power2.in" })
      .to(dialog.current?.querySelector(".drawer-inner") || [], { opacity: 0, scale: .85, y: 20, duration: .25, ease: "power2.in" });
  }
  return <div className="mobile-navigation">
    <button ref={trigger} className="icon-button menu-toggle" aria-label="Open navigation" aria-expanded={open} aria-controls="mobile-drawer" onClick={() => setOpen(true)}><Menu size={24} aria-hidden="true" /></button>
    <dialog ref={dialog} id="mobile-drawer" className="mobile-drawer" data-lenis-prevent aria-labelledby="drawer-title" onCancel={event => { event.preventDefault(); close(); }} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="drawer-inner">
        <div className="flex items-center justify-between"><p id="drawer-title" className="drawer-brand">NOVENTRA</p><button className="icon-button" aria-label="Close navigation" onClick={() => close()}><X size={24} aria-hidden="true" /></button></div>
        <nav aria-label="Mobile navigation" className="drawer-links">{[...navigation, { label: "Our process", href: "/#process" }, { label: "AI readiness", href: "/resources/ai-readiness" }].map(item => <Link key={item.href} href={item.href} onClick={() => close(true)}>{item.label}<ArrowUpRight size={22} aria-hidden="true" /></Link>)}</nav>
        <div className="drawer-bottom"><p>AI that moves<br />business forward.</p><Link href="/#contact" className="button button--primary" onClick={() => close(true)}><span className="button-dot" aria-hidden="true" /><span className="button-content">Let’s talk<ArrowUpRight size={18} aria-hidden="true" /></span></Link></div>
      </div>
    </dialog>
  </div>;
}
