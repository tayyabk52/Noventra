import { Container } from "@/components/ui/container";
import { Ticker } from "@/components/ui/ticker";
import { ecosystem } from "@/lib/content";
export function Partners() {
  return <section className="ecosystem-section" aria-labelledby="ecosystem-title"><Container className="ecosystem-heading"><h2 id="ecosystem-title">An open ecosystem.<br />Your choice.</h2><p>The right tools for the problem.<br />Designed to work with your world.</p></Container><Ticker items={ecosystem} /></section>;
}
