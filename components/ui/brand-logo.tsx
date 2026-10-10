import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/content";
export interface BrandLogoProps { footer?: boolean }
export function BrandLogo({ footer = false }: Readonly<BrandLogoProps>) {
  return <Link href="/" aria-label="Noventra home" className={`brand-logo${footer ? " brand-logo--footer" : ""}`}><Image src={brand.logo.src} alt={brand.logo.alt} width={brand.logo.width} height={brand.logo.height} preload={!footer} sizes="(max-width: 640px) 180px, 220px" /></Link>;
}
