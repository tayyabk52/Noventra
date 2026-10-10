import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ExpoScaleEase } from "gsap/EasePack";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, ExpoScaleEase, useGSAP);

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };
export const motionQueries = {
  allowed: "(prefers-reduced-motion: no-preference)",
  desktop: "(min-width: 1024px)",
  pointer: "(hover: hover) and (pointer: fine)"
} as const;

/** Source Lenis easing, copied by its mathematical definition. */
export function scrollEase(progress: number): number {
  return Math.min(1, 1.001 - Math.pow(2, -10 * progress));
}
