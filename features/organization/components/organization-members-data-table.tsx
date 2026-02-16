"use client";

import { UserInfo } from "@/components/common/user-info";
import { DataTable } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
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
import { formatDate } from "@/lib/utils";
import { ColumnDef, Table } from "@tanstack/react-table";
import { FolderClosedIcon, SearchIcon } from "lucide-react";
import { ReactNode } from "react";

type OrganizationMember = {
  role: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
    image: string | null;
  };
};

function getColumns(): ColumnDef<OrganizationMember>[] {
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
            image={row.original.user.image}
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
                variant={role === "owner" ? "default" : "secondary"}
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
      cell: ({ row }) => {},
    },
  ];
}

export function OrganizationMembersDataTable({
  members,
  noResultsMessage,
  disabledToolbar,
}: {
  members: OrganizationMember[];
  noResultsMessage?: ReactNode;
  disabledToolbar?: boolean;
}) {
  return (
    <DataTable
      columns={getColumns()}
      data={members}
      id="admin-organization-members-data-table"
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
