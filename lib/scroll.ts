import type Lenis from "lenis";

let scroller: Lenis | null = null;
type AnchorResolver = (onComplete?: () => void) => void;
const anchorResolvers = new Map<string, AnchorResolver>();
export function registerScrollAnchor(id: string, resolver: AnchorResolver): () => void {
  anchorResolvers.set(id, resolver);
  return () => { if (anchorResolvers.get(id) === resolver) anchorResolvers.delete(id); };
}
export function resolveScrollAnchor(id: string, onComplete?: () => void): boolean {
  const resolver = anchorResolvers.get(id);
  if (!resolver) return false;
  resolver(onComplete);
  return true;
}
export function setSmoothScroller(instance: Lenis | null) { scroller = instance; }
export function scrollToPosition(position: number, immediate = false, onComplete?: () => void) {
  if (scroller && !scroller.isStopped) {
    scroller.scrollTo(position, { immediate, duration: 1, onComplete });
  } else {
    window.scrollTo({ top: position, behavior: immediate || matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    onComplete?.();
  }
}
