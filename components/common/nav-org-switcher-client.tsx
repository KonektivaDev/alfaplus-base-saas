"use client";

import z from "zod";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronsUpDownIcon, PlusIcon, ShieldUserIcon } from "lucide-react";
import Link from "next/link";
import { Field, FieldGroup } from "../ui/field";
import { FormInput } from "./form";
import { Button } from "../ui/button";
import { LoadingSwap } from "../ui/loading-swap";

type NavOrgSwitcherClientProps = {
  isOwner: boolean;
};

const organizationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export function NavOrgSwitcherClient({ isOwner }: NavOrgSwitcherClientProps) {
  const { isMobile } = useSidebar();
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
    },
  });

  async function handleCreateOrganization(
    data: z.infer<typeof organizationSchema>,
  ) {
    const slug = data.name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-");
    const res = await authClient.organization.create({
      name: data.name,
      slug,
    });

    if (res.error) {
      toast.error("Error creating organization", {
        description: res.error.message || "Failed to create organization",
      });
    } else {
      form.reset();
      setOpen(false);
      await authClient.organization.setActive({
        organizationId: res.data.id,
      });
    }
  }

  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  if (organizations == null || organizations.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={activeOrganization?.logo ?? undefined}
                      alt={activeOrganization?.name ?? ""}
                    />
                    <AvatarFallback>
                      {activeOrganization?.name
                        .split(" ")
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {activeOrganization?.name}
                    </span>
                    <span className="truncate text-xs">
                      {activeOrganization?.slug}
                    </span>
                  </div>
                  <ChevronsUpDownIcon className="ml-auto" />
                </SidebarMenuButton>
              }
            />

            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  Organizations
                </DropdownMenuLabel>
                {organizations.map((organization) => (
                  <DropdownMenuItem
                    key={organization.id}
                    onClick={() => {
                      authClient.organization.setActive(
                        {
                          organizationId: organization.id,
                        },
                        {
                          onError: (error) => {
                            toast.error("Error setting active organization", {
                              description:
                                error.error.message ||
                                "Failed to set active organization",
                            });
                          },
                          onSuccess: () => {
                            router.refresh();
                          },
                        },
                      );
                    }}
                  >
                    <Avatar className="h-7 w-7 rounded-lg">
                      <AvatarImage
                        src={organization.logo ?? undefined}
                        alt={organization.name ?? ""}
                      />
                      <AvatarFallback>
                        <span className="text-xs">
                          {organization.name
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-xs leading-tight">
                      <span className="truncate font-medium">
                        {organization.name}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              {isOwner && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    render={
                      <div className="flex items-center gap-2">
                        <ShieldUserIcon className="size-4" />
                        <Link href="/organizations/manage">
                          Manage Active Organization
                        </Link>
                      </div>
                    }
                  />
                </>
              )}
              <DropdownMenuSeparator />
              <DialogTrigger
                nativeButton={false}
                render={
                  <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                      <PlusIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground font-medium">
                      Create organization
                    </div>
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to manage your teams and cases.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-6"
          id="create-organization-form"
          onSubmit={form.handleSubmit(handleCreateOrganization)}
        >
          <FieldGroup>
            <FormInput
              control={form.control}
              name="name"
              label="Name"
              autoComplete="organization-name"
            />
          </FieldGroup>

          <Field>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                }}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <LoadingSwap isLoading={form.formState.isSubmitting}>
                  Create
                </LoadingSwap>
              </Button>
            </DialogFooter>
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
}
