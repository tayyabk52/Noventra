import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Container } from "@/components/ui/container";
import { services } from "@/lib/content";
export function Footer() {
  const year = new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Asia/Karachi" }).format(new Date());
  return <footer className="site-footer"><Container><div className="footer-grid"><div className="footer-brand"><BrandLogo footer /><p>Practical AI, thoughtful engineering, and a clear path forward for your business.</p></div><div><h2>Solutions</h2><ul>{services.map(service => <li key={service.id}><Link href={`/#${service.id}`}>{service.category}</Link></li>)}</ul></div><div><h2>Company</h2><ul><li><Link href="/#about">About Noventra</Link></li><li><Link href="/#approach">Our approach</Link></li><li><Link href="/#process">Our process</Link></li><li><Link href="/#contact">Start a conversation</Link></li></ul></div><div><h2>Resources</h2><ul><li><Link href="/resources/ai-readiness">AI readiness guide</Link></li><li><Link href="/privacy">Privacy policy</Link></li><li><Link href="/terms">Terms of use</Link></li></ul></div></div><div className="footer-bottom"><p>© {year} Noventra. All rights reserved.</p><span>Built to move you forward.</span><a href="#main" className="back-top" aria-label="Back to top"><ArrowUp size={18} aria-hidden="true" />Back to top</a></div></Container></footer>;
}
