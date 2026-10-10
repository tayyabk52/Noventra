import type { ServiceItem } from "@/types/content";
export interface IllustrationProps { kind: ServiceItem["illustration"] | "hero" }
export function Illustration({ kind }: Readonly<IllustrationProps>) {
  if (kind === "hero") return <svg viewBox="0 0 600 680" className="hero-illustration" aria-hidden="true" focusable="false">
    <defs><linearGradient id="hero-ribbon" x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--color-secondary)" /><stop offset="1" stopColor="var(--color-accent)" /></linearGradient><linearGradient id="hero-depth" x1="0" y1="1" x2="1" y2="0"><stop stopColor="var(--color-ink)" /><stop offset="1" stopColor="var(--color-accent-strong)" /></linearGradient></defs>
    <g className="diagram-wire" fill="none" strokeWidth="1"><path d="M20 390 300 230 580 390 300 550Z M20 425 300 265 580 425 300 585Z M20 460 300 300 580 460 300 620Z" /><path d="m90 350 280 160m-210-200 280 160m-210-200 280 160M90 430l280-160m-210 200 280-160m-210 200 280-160" /></g>
    <path d="m113 342 82-48v-158l-82 48Z" fill="url(#hero-depth)" />
    <path d="m113 184 82-48 210 242-82 48Z" fill="url(#hero-ribbon)" />
    <path d="m323 426 82-48V150l-82 48Z" fill="url(#hero-depth)" />
    <path d="m323 198 82-48 73 42-82 48Z" fill="var(--color-accent)" />
    <path d="m396 240 82-48v237l-82 48Z" fill="url(#hero-ribbon)" />
    <path d="m113 342 82-48 128 132 73 51-82 48Z" fill="var(--color-ink)" opacity=".08" />
    <g className="diagram-wire" fill="none" strokeWidth="1"><path d="M58 155v100m-30-50h60M503 310v85m-28-42h56" /><circle cx="510" cy="130" r="35" /><circle cx="80" cy="480" r="9" /><path d="M510 465v100h-72M300 80v-25h100" /></g>
  </svg>;
  return <svg viewBox="0 0 600 360" className={`service-illustration service-illustration--${kind}`} aria-hidden="true" focusable="false">
    <g className="diagram-wire" fill="none" strokeWidth="1"><path d="m40 280 260-150 260 150-260 150Z" /><path d="m110 240 260 150m-200-185 260 150m-200-185 260 150m-380-5 260-150m-200 185 260-150m-200 185 260-150" /></g>
    {kind === "automation" && <g><g className="diagram-wire" fill="none" strokeWidth="2"><path d="M130 190h85l55-55h70l60 55h70M300 135V65" /></g><rect x="95" y="160" width="70" height="70" rx="10" className="diagram-fill-secondary" /><rect x="265" y="95" width="70" height="70" rx="10" className="diagram-fill-accent" /><rect x="435" y="160" width="70" height="70" rx="10" className="diagram-fill-ink" /><g fill="none" stroke="var(--color-paper)" strokeWidth="2"><path d="m118 195 10 10 19-24m140-56h25m-25 12h25m-25 12h16m158 49 10 10 19-24" /></g><circle cx="300" cy="65" r="8" className="diagram-fill-ink" /></g>}
    {kind === "intelligence" && <g><path d="m160 205 60-35v100l-60 35Z" className="diagram-fill-secondary" /><path d="m160 205-55-32 60-35 55 32Z" className="diagram-fill-accent" /><path d="m160 205-55-32v100l55 32Z" className="diagram-fill-ink" /><path d="m300 145 60-35v165l-60 35Z" className="diagram-fill-secondary" /><path d="m300 145-55-32 60-35 55 32Z" className="diagram-fill-accent" /><path d="m300 145-55-32v165l55 32Z" className="diagram-fill-ink" /><path d="m440 85 60-35v220l-60 35Z" className="diagram-fill-secondary" /><path d="m440 85-55-32 60-35 55 32Z" className="diagram-fill-accent" /><path d="m440 85-55-32v220l55 32Z" className="diagram-fill-ink" /></g>}
    {kind === "applications" && <g><path d="m140 200 160-92 160 92-160 92Z" className="diagram-fill-ink" /><path d="m140 155 160-92 160 92-160 92Z" className="diagram-fill-secondary" /><path d="m140 110 160-92 160 92-160 92Z" className="diagram-fill-accent" /><g fill="none" stroke="var(--color-paper)" strokeWidth="2"><path d="m266 75-28 17 28 17m68-34 28 17-28 17m-27-34-14 34" /></g></g>}
    {kind === "cloud" && <g><path d="m150 205 150-87 150 87-150 87Z" className="diagram-fill-secondary" /><path d="m150 250 150-87 150 87-150 87Z" className="diagram-fill-ink" /><g fill="var(--color-accent)"><rect x="245" y="72" width="140" height="83" rx="40" /><circle cx="274" cy="82" r="42" /><circle cx="325" cy="57" r="45" /></g><path d="M300 155v48m-12-12 12 12 12-12" fill="none" stroke="var(--color-paper)" strokeWidth="2" /></g>}
  </svg>;
}
