import Link from "next/link";
import { BrandLogo } from "../icons/brand-logo";
import { cn } from "@/lib/utils";

export default function BrandHomeLink(
  { link = "/", className }: { link?: string, className?: string }
) {
  return (
    <Link href={link} title="Alfa+ logo" className={cn("flex items-center gap-2 font-medium", className)}>
      <BrandLogo className="stroke-foreground h-8 w-8" />
      <span className="text-xl font-bold">Alfa+</span>
    </Link>
  )
}