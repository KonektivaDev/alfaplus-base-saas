"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ActivityIcon,
  FilesIcon,
  HomeIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const modulesSidebarItems = [
  {
    href: "/dashboard",
    icon: <HomeIcon />,
    label: "Dashboard",
  },
  {
    href: "/cases",
    icon: <FilesIcon />,
    label: "Cases",
  },
  {
    href: "/activities",
    icon: <ActivityIcon />,
    label: "Activities",
  },
  {
    href: "/parties",
    icon: <UsersIcon />,
    label: "Parties",
  }
];

export function ModulesSidebar() {
  const pathname = usePathname();
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Modules</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {modulesSidebarItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton tooltip={item.label} isActive={item.href === pathname}
                  render={
                    <Link href={item.href}>
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  }>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
