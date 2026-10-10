import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
export interface CardProps { children: ReactNode; className?: string; id?: string }
export function Card({ children, className, id }: Readonly<CardProps>) { return <article id={id} className={cn("card", className)}>{children}</article>; }
