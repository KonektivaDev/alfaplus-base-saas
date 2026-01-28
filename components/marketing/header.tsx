"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "../icons/brand-logo";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu";
import { cn } from "@/lib/utils";
import ThemeToggle from "../common/theme-toggle";
import { Button } from "../ui/button";
import BrandHomeLink from "../common/brand-home-link";

export default function MarketingHeader() {
  const [showLine, setShowLine] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowLine(window.scrollY > 10);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-10 w-full">
      <header className="bg-background/60 relative backdrop-blur">
        <div className="container mx-auto flex items-center justify-between py-2">
          <BrandHomeLink />
          <div className="z-20 hidden gap-2 md:flex">
            <NavigationMenu >
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    Functions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink render={
                          <Link
                            className="from-muted/50 to-muted flex h-full w-full flex-col justify-start items-start rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                            href="/"
                          >
                            <div className="flex flex-col items-start gap-4 mt-2 mb-4 text-lg font-medium">
                              <span className="text-2xl font-bold">Alfa+</span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-tight">
                              Innovative Case Management solutions for your organization.
                            </p>
                          </Link>
                        }>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/docs" title="Introduction">
                        Re-usable components built using Base UI and Tailwind
                        CSS.
                      </ListItem>
                      <ListItem href="/docs/installation" title="Installation">
                        How to install dependencies and structure your app.
                      </ListItem>
                      <ListItem
                        href="/docs/primitives/typography"
                        title="Typography"
                      >
                        Styles for headings, paragraphs, lists...etc
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <ThemeToggle />

            <div className="flex items-center gap-2">
              <Button nativeButton={false} variant="outline"
                size="sm"
                render={
                  <Link href="/sign-up">
                    <span>Sign Up</span>
                  </Link>
                }
              />
              <Button nativeButton={false} variant="default" size="sm" render={
                <Link href="/login">
                  <span>Login</span>
                </Link>
              } />
            </div>

          </div>
        </div>
        <div
          className={cn(
            "bg-border absolute inset-x-0 bottom-0 h-px",
            showLine ? "opacity-100" : "opacity-0"
          )}
        />
      </header>
    </div>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink render={<Link href={href}><div className="flex flex-col gap-1 text-sm">
        <div className="leading-none font-medium">{title}</div>
        <div className="text-muted-foreground line-clamp-2">{children}</div>
      </div></Link>} />
    </li>
  )
}
