"use client";

import { LoadingSpinner } from "@/components/common/loading-spinner";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { roles } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";
import { ColumnDef, Table } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins/admin";
import {
  CircleUserRoundIcon,
  FolderClosedIcon,
  MoreHorizontalIcon,
  SearchIcon,
  ShieldMinusIcon,
  ShieldUserIcon,
  ShieldXIcon,
  TrashIcon,
  UserIcon,
  UserLockIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { toast } from "sonner";

function getColumns(
  currentUserId: string,
  {
    onImpersonateUser,
    onBanUser,
    onUnbanUser,
    onRevokeSessions,
    onDeleteUser,
    onRemoveAdmin,
    onMakeAdmin,
  }: {
    onImpersonateUser: (userId: string) => void;
    onBanUser: (userId: string) => void;
    onUnbanUser: (userId: string) => void;
    onRevokeSessions: (userId: string) => void;
    onDeleteUser: (userId: string) => void;
    onRemoveAdmin: (userId: string) => void;
    onMakeAdmin: (userId: string) => void;
  },
): ColumnDef<UserWithRole>[] {
  return [
    {
      id: "name",
      accessorFn: (row) => `${row.name ?? ""} ${row.email ?? ""}`,
      header: "User",
      size: 600,
      cell: ({ row }) => {
        return (
          <div>
            <div className="font-medium">{row.original.name || "No name"}</div>
            <div className="text-muted-foreground text-sm">
              {row.original.email}
            </div>
            <div className="itmes-center flex gap-2 not-empty:mt-2">
              {row.original.banned && (
                <Badge variant="destructive">Banned</Badge>
              )}
              {!row.original.emailVerified && (
                <Badge variant="outline">Unverified</Badge>
              )}
              {row.original.id === currentUserId && <Badge>You</Badge>}
            </div>
          </div>
        );
      },
    },

    {
      id: "role",
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        return (
          <Badge
            variant={row.original.role === "admin" ? "default" : "secondary"}
          >
            {row.original.role}
          </Badge>
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
        if (row.original.id === currentUserId) return null;
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
                <DropdownMenuItem
                  onClick={() => onImpersonateUser(row.original.id)}
                >
                  <CircleUserRoundIcon className="mr-1" />
                  <span>Impersonate</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onRevokeSessions(row.original.id)}
                >
                  <ShieldXIcon className="mr-1" />
                  <span>Revoke Sessions</span>
                </DropdownMenuItem>
                {row.original.banned ? (
                  <DropdownMenuItem
                    onClick={() => onUnbanUser(row.original.id)}
                  >
                    <UserIcon className="mr-1" />
                    <span>Unban</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onBanUser(row.original.id)}>
                    <UserLockIcon className="mr-1" />
                    <span>Ban</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />

                {row.original.role === "admin" ? (
                  <DropdownMenuItem
                    onClick={() => onRemoveAdmin(row.original.id)}
                  >
                    <ShieldMinusIcon className="mr-1" />
                    <span>Remove Admin</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onMakeAdmin(row.original.id)}
                  >
                    <ShieldUserIcon className="mr-1" />
                    <span>Make Admin</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <AlertDialogTrigger
                  nativeButton={false}
                  render={
                    <DropdownMenuItem variant="destructive">
                      <TrashIcon className="mr-1" />
                      <span>Delete User</span>
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this user? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDeleteUser(row.original.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
      size: 120,
      enableResizing: false,
      enableHiding: false,
    },
  ];
}

export function UsersListTable({
  users,
  currentUserId,
  noResultsMessage,
  disabledToolbar,
}: {
  users: UserWithRole[];
  currentUserId: string;
  noResultsMessage?: ReactNode;
  disabledToolbar?: boolean;
}) {
  const router = useRouter();
  const { refetch } = authClient.useSession();

  function handleRemoveAdmin(userId: string) {
    authClient.admin.setRole(
      { userId, role: "user" },
      {
        onError: (error) => {
          toast.error("Error!", {
            description: error.error.message ?? "Failed to remove admin.",
          });
        },
        onSuccess: () => {
          toast.success("Admin removed successfully.");
          router.refresh();
        },
      },
    );
  }

  function handleMakeAdmin(userId: string) {
    authClient.admin.setRole(
      { userId, role: "admin" },
      {
        onError: (error) => {
          toast.error("Error!", {
            description: error.error.message ?? "Failed to make admin.",
          });
        },
        onSuccess: () => {
          toast.success("Admin made successfully.");
          router.refresh();
        },
      },
    );
  }

  function handleBanUser(userId: string) {
    authClient.admin.banUser(
      { userId },
      {
        onError: (error) => {
          toast.error("Error!", {
            description: error.error.message ?? "Failed to ban user.",
          });
        },
        onSuccess: () => {
          toast.success("User banned successfully.");
          router.refresh();
        },
      },
    );
  }

  function handleUnbanUser(userId: string) {
    authClient.admin.unbanUser(
      { userId },
      {
        onError: (error) => {
          toast.error("Error!", {
            description: error.error.message ?? "Failed to unban user.",
          });
        },
        onSuccess: () => {
          toast.success("User unbanned successfully.");
          router.refresh();
        },
      },
    );
  }

  function handleRevokeSessions(userId: string) {
    authClient.admin.revokeUserSessions(
      { userId },
      {
        onError: (error) => {
          toast.error("Error!", {
            description: error.error.message ?? "Failed to revoke sessions.",
          });
        },
        onSuccess: () => {
          toast.success("Sessions revoked successfully.");
        },
      },
    );
  }

  function handleDeleteUser(userId: string) {
    authClient.admin.removeUser(
      { userId },
      {
        onError: (error) => {
          toast.error("Error!", {
            description: error.error.message ?? "Failed to delete user.",
          });
        },
        onSuccess: () => {
          toast.success("User deleted successfully.");
          router.refresh();
        },
      },
    );
  }

  function handleImpersonateUser(userId: string) {
    authClient.admin.impersonateUser(
      { userId },
      {
        onError: (error) => {
          toast.error("Error!", {
            description: error.error.message ?? "Failed to impersonate user.",
          });
        },
        onSuccess: () => {
          refetch();
          router.push("/dashboard");
          router.refresh();
        },
      },
    );
  }

  return (
    <DataTable
      columns={getColumns(currentUserId, {
        onImpersonateUser: handleImpersonateUser,
        onBanUser: handleBanUser,
        onUnbanUser: handleUnbanUser,
        onRevokeSessions: handleRevokeSessions,
        onDeleteUser: handleDeleteUser,
        onRemoveAdmin: handleRemoveAdmin,
        onMakeAdmin: handleMakeAdmin,
      })}
      data={users}
      id="admin-users-list-table"
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
    <div className="flex w-full items-center gap-2 p-1">
      {table.getColumn("name") && (
        <InputGroup className="max-w-xs">
          <InputGroupInput
            disabled={disabled}
            placeholder="Search users..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.currentTarget.value)
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
      {table.getColumn("role") && (
        <DataTableFacetedFilter
          column={table.getColumn("role")!}
          title="Role"
          disabled={disabled}
          options={Object.keys(roles).map((role) => ({
            label: role,
            value: role,
            key: role,
          }))}
        />
      )}
      {hiddenRows > 0 && (
        <div className="text-muted-foreground text-xs">
          {hiddenRows} hidden {hiddenRows === 1 ? "row" : "rows"}
        </div>
      )}
    </div>
  );
}

export function SkeletonUsersListTable() {
  return (
    <UsersListTable
      users={[]}
      currentUserId={""}
      noResultsMessage={<LoadingSpinner className="size-12" />}
    />
  );
}

export function NoResultsMessage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderClosedIcon />
        </EmptyMedia>
        <EmptyTitle>No Users</EmptyTitle>
        <EmptyDescription>
          There are no users matching your search or database is empty.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent></EmptyContent>
    </Empty>
  );
}
