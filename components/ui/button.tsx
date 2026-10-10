import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  children: ReactNode;
  arrow?: boolean;
}
export function Button({ variant = "primary", children, arrow = true, className, ...props }: Readonly<ButtonProps>) {
  return <button className={cn("button", `button--${variant}`, className)} {...props}><span className="button-dot" aria-hidden="true" /><span className="button-content">{children}{arrow && <ArrowUpRight size={18} aria-hidden="true" />}</span></button>;
}
export interface ButtonLinkProps { href: string; children: ReactNode; variant?: ButtonProps["variant"]; className?: string; arrow?: boolean }
export function ButtonLink({ href, children, variant = "primary", className, arrow = true }: Readonly<ButtonLinkProps>) {
  return <Link href={href} className={cn("button", `button--${variant}`, className)}><span className="button-dot" aria-hidden="true" /><span className="button-content">{children}{arrow && <ArrowUpRight size={18} aria-hidden="true" />}</span></Link>;
}
