export interface BrandConfig {
  name: string;
  tagline: string;
  logo: { src: string; alt: string; width: number; height: number };
  contact: { email?: string; phone?: string; address?: string };
}
export interface MetricItem {
  id: string;
  value: string;
  numericValue: number;
  unit?: string;
  label: string;
  description: string;
}
export interface ServiceItem {
  id: string;
  category: string;
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  illustration: "automation" | "intelligence" | "applications" | "cloud";
}
export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl?: string;
}
