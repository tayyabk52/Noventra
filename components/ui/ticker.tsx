"use client";
import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
export interface TickerProps { items: readonly string[]; variant?: "technology" | "statement" }
export function Ticker({ items, variant = "technology" }: Readonly<TickerProps>) {
  const [paused, setPaused] = useState(false);
  return <div className={cn("ticker", `ticker--${variant}`, paused && "is-paused")}>
    <div className="ticker-window"><div className="ticker-track">{[0, 1].map(copy => <div className="ticker-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{items.map(item => <span key={item} className="ticker-item">{item}<span className="ticker-separator" aria-hidden="true">✳</span></span>)}</div>)}</div></div>
    <button className="icon-button ticker-control" onClick={() => setPaused(!paused)} aria-label={`${paused ? "Resume" : "Pause"} ${variant === "technology" ? "technology" : "statement"} animation`} aria-pressed={paused}>{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button>
  </div>;
}
