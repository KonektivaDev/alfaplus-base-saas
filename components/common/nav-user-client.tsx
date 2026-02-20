"use client";

import { User } from "@/generated/prisma/client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  BellIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  ShieldIcon,
  UserCog2Icon,
  UserXIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserInfo } from "./user-info";

export function NavUserClient({
  user,
}: {
  user: Omit<
    User,
    "role" | "banReason" | "banned" | "banExpires" | "activeOrganizationId"
  >;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const [hasAdminPermission, setHasAdminPermission] = useState(false);

  useEffect(() => {
    authClient.admin
      .hasPermission({
        userId: user.id,
        permission: { user: ["list"] },
      })
      .then(({ data }) => {
        setHasAdminPermission(data?.success ?? false);
      });
  }, [user.id]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const { data: session, refetch } = authClient.useSession();
  const isImpersonating = session?.session?.impersonatedBy != null;

  function stopImpersonating() {
    authClient.admin.stopImpersonating(undefined, {
      onSuccess: () => {
        router.push("/admin/users");
        refetch();
        router.refresh();
      },
    });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <UserInfo
                  name={user.name ?? ""}
                  email={user.email ?? ""}
                  image={user.image ?? ""}
                />
                <ChevronsUpDownIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          />

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserInfo
                    name={user.name ?? ""}
                    email={user.email ?? ""}
                    image={user.image ?? ""}
                  />
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {hasAdminPermission && (
                <DropdownMenuItem
                  render={
                    <Link href="/admin/users">
                      <ShieldIcon className="mr-1" />
                      <span>Admin Dashboard</span>
                    </Link>
                  }
                ></DropdownMenuItem>
              )}

              <DropdownMenuItem
                render={
                  <Link href="/user/settings">
                    <UserCog2Icon className="mr-1" />
                    <span>Settings</span>
                  </Link>
                }
              ></DropdownMenuItem>

              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {isImpersonating && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => stopImpersonating()}>
                  <UserXIcon className="mr-1" />
                  Stop impersonating
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleSignOut}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
