import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { perspectives } from "@/lib/content";
import { ApproachCarousel } from "./approach-carousel";
export function Testimonials() {
  return <section className="approach-section" id="approach" aria-labelledby="approach-title"><Container className="approach-grid"><ApproachCarousel items={perspectives} /><div className="approach-statement"><span className="section-label">The Noventra approach</span><h2 id="approach-title">Big thinking.<br />Practical AI.<br /><span>Real purpose.</span></h2><ButtonLink href="#contact" variant="outline">Talk about your idea</ButtonLink></div></Container></section>;
}
