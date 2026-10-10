"use client";
import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
function subscribe(callback: () => void) {
  const media = matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => matchMedia(query).matches, () => false);
}
