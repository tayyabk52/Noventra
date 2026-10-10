export const COUNTER_DURATION_MS = 1500;
export const SWIPE_THRESHOLD_PX = 50;
export function counterEase(progress: number): number { return 1 - Math.pow(1 - progress, 3); }
