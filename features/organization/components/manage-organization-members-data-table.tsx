"use client";

import { UserInfo } from "@/components/common/user-info";
import { DataTable } from "@/components/data-table/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { authClient } from "@/lib/auth-client";
import { formatDate } from "@/lib/utils";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Member } from "better-auth/plugins";
import {
  FolderClosedIcon,
  MoreHorizontalIcon,
  SearchIcon,
  UserRoundMinus,
  UserRoundMinusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { toast } from "sonner";

type MemberWithUser = Member & {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
};

function getColumns(
  currentUserId: string,
  {
    onRemoveMember,
  }: {
    onRemoveMember: (memberId: string) => void;
  },
): ColumnDef<MemberWithUser>[] {
  return [
    {
      id: "name",
      accessorFn: (row) => `${row.user.name} ${row.user.email}`,
      header: "Member",
      size: 600,
      cell: ({ row }) => {
        return (
          <UserInfo
            name={row.original.user.name}
            email={row.original.user.email}
            image={row.original.user.image ?? null}
          />
        );
      },
    },

    {
      id: "role",
      accessorKey: "role",
      header: "Roles",
      cell: ({ row }) => {
        const roles = row.original.role.split(",");
        return (
          <div className="flex items-center gap-2">
            {roles.map((role) => (
              <Badge
                key={role}
                variant={
                  role === "owner"
                    ? "default"
                    : role === "admin"
                      ? "secondary"
                      : "outline"
                }
              >
                {role}
              </Badge>
            ))}
          </div>
        );
      },
    },

    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        return (
          <div className="text-center font-mono">
            {formatDate(row.original.createdAt)}
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        if (row.original.userId === currentUserId) return null;
        return (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger
                nativeButton={true}
                render={
                  <Button variant="ghost" size="icon">
                    <MoreHorizontalIcon />
                  </Button>
                }
              />
              <DropdownMenuContent className="w-48">
                <AlertDialogTrigger
                  nativeButton={false}
                  render={
                    <DropdownMenuItem variant="destructive">
                      <UserRoundMinusIcon className="mr-1" />
                      <span>Remove Member</span>
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <UserRoundMinus className="text-destructive size-8" />
                </AlertDialogMedia>
                <AlertDialogTitle>Remove Member</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove this member from the
                  organization? New invitations will be needed to be sent to the
                  member to join the organization again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onRemoveMember(row.original.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];
}

export function ManageOrganizationMembersDataTable({
  members,
  noResultsMessage,
  disabledToolbar,
}: {
  members: MemberWithUser[];
  noResultsMessage?: ReactNode;
  disabledToolbar?: boolean;
}) {
  const router = useRouter();

  const currentUserId = authClient.useSession().data?.user.id;
  if (!currentUserId) return null;

  function handleRemoveMember(memberId: string): void {
    authClient.organization.removeMember(
      { memberIdOrEmail: memberId },
      {
        onError: (error) => {
          toast.error("Error!", {
            description: error.error.message ?? "Failed to remove member.",
          });
        },
        onSuccess: () => {
          toast.success("Member removed successfully.");
          router.refresh();
        },
      },
    );
  }

  return (
    <DataTable
      columns={getColumns(currentUserId, {
        onRemoveMember: handleRemoveMember,
      })}
      data={members}
      id="manage-organization-members-data-table"
      initialSorting={[{ id: "name", desc: false }]}
      noResultsMessage={noResultsMessage || <NoResultsMessage />}
      ToolbarComponent={disabledToolbar ? DisabledToolbar : Toolbar}
    />
  );
}

function DisabledToolbar<T>({ table }: { table: Table<T> }) {
  return <Toolbar table={table} disabled />;
}

function Toolbar<T>({
  table,
  disabled = false,
}: {
  table: Table<T>;
  disabled?: boolean;
}) {
  const hiddenRows = table.getCoreRowModel().rows.length - table.getRowCount();
  return (
    <div className="flex w-full items-center justify-between gap-2 p-1">
      <div className="flex items-center gap-2">
        {table.getColumn("name") && (
          <InputGroup className="max-w-xs">
            <InputGroupInput
              disabled={disabled}
              placeholder="Search members..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("name")
                  ?.setFilterValue(event.currentTarget.value)
              }
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              {table.getRowCount()} results
            </InputGroupAddon>
          </InputGroup>
        )}
        {hiddenRows > 0 && (
          <div className="text-muted-foreground text-xs">
            {hiddenRows} hidden {hiddenRows === 1 ? "row" : "rows"}
          </div>
        )}
      </div>
    </div>
  );
}

export function NoResultsMessage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderClosedIcon />
        </EmptyMedia>
        <EmptyTitle>No Members</EmptyTitle>
        <EmptyDescription>
          There are no members in this organization matching your search or
          database is empty.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent></EmptyContent>
    </Empty>
  );
}
