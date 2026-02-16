"use client";

import { DataTable } from "@/components/data-table/data-table";
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
import {
  FolderClosedIcon,
  MoreHorizontalIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { ReactNode } from "react";
import { CreateInvitationButton } from "./create-invitation-button";

type PendingInvitation = {
  id: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "rejected" | "canceled";
  createdAt: Date;
  expiresAt: Date;
  inviterId: string;
  teamId?: string;
};

function getColumns({
  onCancelInvitation,
}: {
  onCancelInvitation: (invitationId: string) => Promise<void>;
}): ColumnDef<PendingInvitation>[] {
  return [
    {
      id: "email",
      accessorFn: (row) => row.email,
      header: "Email",
      size: 600,
      cell: ({ row }) => {
        return <div>{row.original.email}</div>;
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
      id: "expiresAt",
      accessorKey: "expiresAt",
      header: "Expires",
      cell: ({ row }) => {
        return (
          <div className="text-center font-mono">
            {formatDate(row.original.expiresAt)}
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
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
                variant="destructive"
                onClick={() => onCancelInvitation(row.original.id)}
              >
                <TrashIcon className="mr-1" />
                <span>Cancel</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

export function ManageOrganizationInvitationsDataTable({
  noResultsMessage,
  disabledToolbar,
}: {
  noResultsMessage?: ReactNode;
  disabledToolbar?: boolean;
}) {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const pendingInvitations: PendingInvitation[] =
    activeOrganization?.invitations.filter(
      (invitation) => invitation.status === "pending",
    ) ?? [];

  async function cancelInvitation(invitationId: string): Promise<void> {
    await authClient.organization.cancelInvitation({ invitationId });
  }

  return (
    <DataTable<PendingInvitation, unknown>
      columns={getColumns({
        onCancelInvitation: cancelInvitation,
      })}
      data={pendingInvitations}
      id="manage-organization-invitations-data-table"
      initialSorting={[{ id: "email", desc: false }]}
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
        {table.getColumn("email") && (
          <InputGroup className="max-w-xs">
            <InputGroupInput
              disabled={disabled}
              placeholder="Search invitations..."
              value={
                (table.getColumn("email")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("email")
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
      <CreateInvitationButton />
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
        <EmptyTitle>No Pending Invitations</EmptyTitle>
        <EmptyDescription>
          There are no pending invitations in this organization matching your
          search or database is empty.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <CreateInvitationButton />
      </EmptyContent>
    </Empty>
  );
}
