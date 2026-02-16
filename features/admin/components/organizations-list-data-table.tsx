"use client";

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
import { Prisma } from "@/generated/prisma/client";
import { authClient } from "@/lib/auth-client";
import { formatDate } from "@/lib/utils";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import {
  FolderClosedIcon,
  MoreHorizontalIcon,
  PencilIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { toast } from "sonner";

type OrganizationRow = Prisma.OrganizationGetPayload<{
  include: {
    _count: {
      select: { members: true };
    };
  };
}>;

function getColumns({
  canEditOrganization,
  canDeleteOrganization,
  onEditOrganization,
  onDeleteOrganization,
}: {
  canEditOrganization: boolean;
  canDeleteOrganization: boolean;
  onEditOrganization: (organizationId: string) => void;
  onDeleteOrganization: (organizationId: string) => void;
}): ColumnDef<OrganizationRow>[] {
  return [
    {
      id: "name",
      accessorFn: (row) => `${row.name} ${row.slug}`,
      header: "Organization",
      size: 600,
      cell: ({ row }) => {
        return (
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-muted-foreground text-xs">
              {row.original.slug}
            </div>
          </div>
        );
      },
    },
    {
      id: "members",
      accessorKey: "members",
      header: "Members",
      cell: ({ row }) => {
        return (
          <div className="text-center font-mono">
            {row.original._count.members}
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
        return (
          <div
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
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
                  {canEditOrganization && (
                    <DropdownMenuItem
                      onClick={() => onEditOrganization(row.original.id)}
                    >
                      <PencilIcon className="mr-1" />
                      <span>Edit...</span>
                    </DropdownMenuItem>
                  )}

                  {canEditOrganization && canDeleteOrganization && (
                    <DropdownMenuSeparator />
                  )}

                  {canDeleteOrganization && (
                    <AlertDialogTrigger
                      nativeButton={false}
                      render={
                        <DropdownMenuItem variant="destructive">
                          <TrashIcon className="mr-1" />
                          <span>Delete Organization</span>
                        </DropdownMenuItem>
                      }
                    />
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <TrashIcon className="text-destructive size-8" />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Delete Organization</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this organization? All data
                    associated with this organization will be deleted. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDeleteOrganization(row.original.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];
}

export function OrganizationsListDataTable({
  organizations,
  canEditOrganization,
  canDeleteOrganization,
  noResultsMessage,
  disabledToolbar,
}: {
  organizations: OrganizationRow[];
  canEditOrganization: boolean;
  canDeleteOrganization: boolean;
  noResultsMessage?: ReactNode;
  disabledToolbar?: boolean;
}) {
  const router = useRouter();

  function handleDeleteOrganization(organizationId: string) {
    authClient.organization.delete(
      {
        organizationId,
      },
      {
        onError: (error) => {
          toast.error("Error!", {
            description:
              error.error.message ?? "Failed to delete organization.",
          });
        },
        onSuccess: () => {
          toast.success("Organization deleted successfully.");
          router.refresh();
        },
      },
    );
  }
  function handleEditOrganization(organizationId: string) {
    router.push(`/admin/organizations/${organizationId}`);
  }

  function handleRowClick(row: Row<OrganizationRow>) {
    router.push(`/admin/organizations/${row.original.id}`);
  }

  return (
    <DataTable
      columns={getColumns({
        canEditOrganization,
        canDeleteOrganization,
        onEditOrganization: handleEditOrganization,
        onDeleteOrganization: handleDeleteOrganization,
      })}
      data={organizations}
      id="admin-organizations-list-table"
      initialSorting={[{ id: "name", desc: false }]}
      noResultsMessage={noResultsMessage || <NoResultsMessage />}
      ToolbarComponent={disabledToolbar ? DisabledToolbar : Toolbar}
      onRowClick={handleRowClick}
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
            placeholder="Search organizations..."
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

      {hiddenRows > 0 && (
        <div className="text-muted-foreground text-xs">
          {hiddenRows} hidden {hiddenRows === 1 ? "row" : "rows"}
        </div>
      )}
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
        <EmptyTitle>No Organizations</EmptyTitle>
        <EmptyDescription>
          There are no organizations matching your search or database is empty.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent></EmptyContent>
    </Empty>
  );
}
