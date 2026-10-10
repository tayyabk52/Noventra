import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ContactForm } from "./contact-form";
export function CTABanner() {
  return <section className="contact-section" id="contact" aria-labelledby="contact-title"><Container className="contact-grid"><div className="contact-copy"><h2 id="contact-title">What’s your<br /><span>next move?</span></h2><p>Bring the challenge. We’ll help you find a practical starting point for AI in your business.</p><Link href="/resources/ai-readiness" className="text-link">Start with our AI readiness guide<ArrowUpRight size={18} aria-hidden="true" /></Link></div><ContactForm /></Container></section>;
}
