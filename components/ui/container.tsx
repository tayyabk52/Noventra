import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
export interface ContainerProps { children: ReactNode; className?: string }
export function Container({ children, className }: Readonly<ContainerProps>) { return <div className={cn("container", className)}>{children}</div>; }
