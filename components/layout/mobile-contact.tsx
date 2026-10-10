"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

export function MobileContact() {
  const pathname = usePathname();
  const [contactInView, setContactInView] = useState(false);
  useEffect(() => {
    const section = document.getElementById("contact");
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setContactInView(entry.isIntersecting));
    observer.observe(section);
    return () => observer.disconnect();
  }, [pathname]);
  return <Link className="mobile-contact" hidden={pathname === "/" && contactInView} href="/#contact">Let’s talk<ArrowUpRight size={18} aria-hidden="true" /></Link>;
}
