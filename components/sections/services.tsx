import { ArrowUpRight, Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Illustration } from "@/components/ui/illustration";
import { services } from "@/lib/content";
import { ServiceScenes } from "@/components/sections/service-scenes";
export function Services() {
  return <section className="services-section" id="solutions" aria-labelledby="solutions-title"><Container><div className="section-heading"><h2 id="solutions-title">Intelligence,<br /><span>put to work.</span></h2><p>From a better workflow to your next product,<br className="desktop-break" /> build the solution your business needs.</p></div><ServiceScenes labels={services.map(service => service.category)}>{services.map((service, index) => <Card key={service.id} id={service.id} className={`service-card service-card--${service.illustration}`}><div className="service-art"><span className="service-index" aria-hidden="true">0{index + 1}</span><Illustration kind={service.illustration} /></div><div className="service-body"><p className="service-category">{service.category}</p><div className="service-title-motion"><h3>{service.title}</h3></div><p>{service.description}</p><details className="service-details"><summary>What we can build<Plus size={18} aria-hidden="true" /></summary><ul>{service.features.map(feature => <li key={feature}>{feature}</li>)}</ul></details><a className="text-link service-cta" href={service.ctaHref}>{service.ctaLabel}<ArrowUpRight size={18} aria-hidden="true" /></a></div></Card>)}</ServiceScenes></Container></section>;
}
