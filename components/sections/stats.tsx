import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Counter } from "@/components/ui/counter";
import { metrics } from "@/lib/content";
import { MetricsCarousel } from "./metrics-carousel";
export function Stats() {
  return <section className="process-section" id="process" aria-labelledby="process-title"><Container><div className="section-heading process-heading"><h2 id="process-title">A clear process.<br />A purposeful next step.</h2><p>Four stages that connect your ambition<br className="desktop-break" /> to something your team can use.</p></div><MetricsCarousel labels={metrics.map(metric => metric.label)}>{metrics.map((metric, index) => <Card key={metric.id} className="metric-card"><Counter value={metric.numericValue} label={metric.label} delayMs={index * 200} /><div><h3>{metric.label}</h3><p>{metric.description}</p></div></Card>)}</MetricsCarousel></Container></section>;
}
