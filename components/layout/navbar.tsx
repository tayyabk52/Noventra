import Link from "next/link";
import { navigation } from "@/lib/content";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeaderSurface } from "./header-surface";
import { MobileNav } from "./mobile-nav";
import { MobileContact } from "./mobile-contact";
export function Navbar() {
  return <><a href="#main" className="skip-link">Skip to content</a><HeaderSurface><Container className="header-inner"><BrandLogo /><nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <Link href={item.href} key={item.href}>{item.label}</Link>)}</nav><div className="header-actions"><ButtonLink href="/#contact" variant="outline">Let’s talk</ButtonLink><MobileNav /></div></Container></HeaderSurface><MobileContact /></>;
}
