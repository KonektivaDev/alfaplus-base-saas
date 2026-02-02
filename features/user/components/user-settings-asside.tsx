"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function UserSettingsAside(
  { pages }: { pages: { title: string; href: string }[] }
) {
  const pathname = usePathname();

  return (
    <aside className="border-border hidden w-64 border-r py-6 pr-6 md:block">
      <ul className="-ml-3 space-y-1">
        {pages.map((page) => (
          <li key={page.href}
            className={cn(page.href === pathname
              ? "bg-accent-foreground/5 text-accent-foreground hover:bg-accent-foreground/10 cursor-pointer rounded-md px-2 py-2 text-xs font-medium"
              : "text-muted-foreground hover:bg-accent-foreground/10 cursor-pointer rounded-md px-2 py-2 text-xs font-medium")}>
            <Link href={page.href}>
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}