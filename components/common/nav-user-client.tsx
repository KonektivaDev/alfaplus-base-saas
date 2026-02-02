"use client";

import { User } from "@/generated/prisma/client";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { BellIcon, ChevronsUpDownIcon, LogOutIcon, UserCog2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";


export function NavUserClient({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <UserInfo {...user} />
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          } />

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserInfo {...user} />
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem render={
                <Link href="/user/settings">
                  <UserCog2Icon className="mr-1" />
                  <span>Settings</span>
                </Link>
              }>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {/* {isImpersonating && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => stopImpersonating()}>
                  <UserXIcon className="mr-1" />
                  Stop impersonating
                </DropdownMenuItem>
              </>
            )} */}

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleSignOut}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function UserInfo({ name, email, image }: User) {
  const nameInitials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={image ?? undefined} alt={name} />
        <AvatarFallback className="rounded-lg">{nameInitials}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{name}</span>
        <span className="truncate text-xs">{email}</span>
      </div>
    </>
  );
}