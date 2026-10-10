import type { BrandConfig, MetricItem, ServiceItem, TestimonialItem } from "@/types/content";
import type { NavigationItem } from "@/types/navigation";

export const brand: BrandConfig = {
  name: "Noventra",
  tagline: "AI that moves business forward.",
  logo: { src: "/brand/noventra-logo.webp", alt: "Noventra", width: 1275, height: 230 },
  contact: {}
};
export const navigation: NavigationItem[] = [
  { label: "Our approach", href: "/#approach" },
  { label: "Solutions", href: "/#solutions" }
];
export const metrics: MetricItem[] = [
  { id: "discover", value: "01", numericValue: 1, label: "Discover", description: "Find the opportunity. Understand your people, processes, and the work that matters." },
  { id: "design", value: "02", numericValue: 2, label: "Design", description: "Make a clear plan. Connect the right technology to a defined business outcome." },
  { id: "deliver", value: "03", numericValue: 3, label: "Deliver", description: "Build with purpose. Test in the real world and put useful AI into your team's hands." },
  { id: "evolve", value: "04", numericValue: 4, label: "Evolve", description: "Keep moving forward. Measure what works and improve as your business grows." }
];
export const perspectives: TestimonialItem[] = [
  { id: "purpose", quote: "The best AI starts with a business problem worth solving. We begin with your goals, then build the technology around them.", author: "Purpose before technology", role: "The Noventra approach", company: "Noventra" },
  { id: "people", quote: "AI should give your people more room to think, create, and make decisions. We design for the team who will use it every day.", author: "Built around people", role: "The Noventra approach", company: "Noventra" },
  { id: "progress", quote: "Progress is something you can see. Start with a focused use case, learn from real usage, and expand when the value is clear.", author: "Practical progress", role: "The Noventra approach", company: "Noventra" }
];
export const services: ServiceItem[] = [
  { id: "automation", category: "Intelligent automation", title: "Less busywork. More possibility.", description: "Connect your tools and turn repetitive workflows into reliable, intelligent processes.", features: ["Workflow discovery and process design", "AI agents with human approval", "Connected systems and integrations"], ctaLabel: "Explore automation", ctaHref: "/#contact", illustration: "automation" },
  { id: "intelligence", category: "Data & intelligence", title: "Turn information into direction.", description: "Make your business knowledge useful, accessible, and ready to support better decisions.", features: ["Knowledge search and retrieval", "Data foundations and quality", "Decision support and analytics"], ctaLabel: "Put data to work", ctaHref: "/#contact", illustration: "intelligence" },
  { id: "applications", category: "Custom AI applications", title: "Your next idea. Built for real life.", description: "Create AI-powered products and internal tools that fit the way your business works.", features: ["AI copilots and assistants", "Custom web applications", "Evaluation, guardrails, and testing"], ctaLabel: "Build with AI", ctaHref: "/#contact", illustration: "applications" },
  { id: "cloud", category: "Cloud & engineering", title: "A stronger foundation for what’s next.", description: "Build the architecture, delivery pipelines, and operational clarity your AI needs to grow.", features: ["Cloud architecture and integration", "Deployment and observability", "Security-minded delivery"], ctaLabel: "Plan your foundation", ctaHref: "/#contact", illustration: "cloud" }
];
export const ecosystem = ["OpenAI", "Microsoft Azure", "Python", "PostgreSQL", "Next.js", "AWS"] as const;
