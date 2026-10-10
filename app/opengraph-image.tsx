import { ImageResponse } from "next/og";
import { brandColors } from "@/lib/brand-colors";
export const alt = "Noventra. AI that moves business forward.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ background: brandColors.hero, color: brandColors.ink, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80 }}><div style={{ display: "flex", fontSize: 26, letterSpacing: 4, marginBottom: 45 }}>NOVENTRA</div><div style={{ display: "flex", flexDirection: "column", fontSize: 78, fontWeight: 800, lineHeight: 1.05 }}><div style={{ display: "flex" }}>AI THAT MOVES</div><div style={{ display: "flex" }}>BUSINESS</div><div style={{ display: "flex", color: brandColors.accentStrong }}>FORWARD.</div></div><div style={{ display: "flex", fontSize: 24, marginTop: 40 }}>Practical intelligence. Built around your business.</div></div>, size);
}
