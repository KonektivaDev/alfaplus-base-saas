"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    label: "Users",
    href: "/admin/users",
  },
  {
    label: "Organizations",
    href: "/admin/organizations",
  },
];

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <div className="bg-background">
      <nav className="border-border mb-6 border-b">
        <div className="container mx-auto flex overflow-x-auto px-4 lg:px-3">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-foreground shrink-0 py-1.5 text-sm",
                pathname.startsWith(item.href) && "border-primary border-b-2",
              )}
            >
              <span className="hover:bg-muted block rounded-md px-2.5 py-2">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
