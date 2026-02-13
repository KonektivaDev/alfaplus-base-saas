"use client";

import { useTableState } from "@/hooks/use-table-state";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  type Table as TableType,
  Row,
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getExpandedRowModel,
  flexRender,
  Header,
  Column,
  Cell,
} from "@tanstack/react-table";
import {
  ComponentType,
  CSSProperties,
  Fragment,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import {
  ArrowDownUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GripVerticalIcon,
  PinIcon,
  PinOffIcon,
} from "lucide-react";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  id: string;
  pageSize?: number;
  className?: string;
  initialSorting?: SortingState;
  initialFilters?: ColumnFiltersState;
  noResultsMessage?: ReactNode;
  ToolbarComponent?: ComponentType<{
    table: TableType<TData>;
    canCreate?: boolean;
  }>;
  toolbarProps?: Record<string, string>;
  canCreate?: boolean;
  showPagination?: boolean;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  ExpandedContentComponent?: ComponentType<{
    row: Row<TData>;
  }>;
  onRowClick?: (row: Row<TData>) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  id,
  pageSize = 10,
  className,
  initialSorting,
  initialFilters,
  noResultsMessage = "No results",
  ToolbarComponent,
  toolbarProps,
  canCreate,
  showPagination = true,
  getRowCanExpand,
  ExpandedContentComponent,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const columnIds = useMemo(
    () => columns.map((column) => column.id as string),
    [columns],
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialFilters || [],
  );

  const [expanded, setExpanded] = useState<ExpandedState>({});

  const defaultState = useMemo(
    () => ({
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
      sorting: initialSorting || [],
      columnOrder: columnIds,
      columnSizing: {},
      columnPinning: { left: [], right: [] },
    }),
    [pageSize, initialSorting, columnIds],
  );

  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
    columnOrder,
    setColumnOrder,
    columnSizing,
    setColumnSizing,
    columnPinning,
    setColumnPinning,
    isLoaded,
  } = useTableState({
    tableId: id,
    defaultState,
  });

  const dndId = useId();

  // Update column order when columns definition changes (but only after localStorage is loaded)
  useEffect(() => {
    if (!isLoaded) return;

    const currentColumnIds = new Set(columnOrder);
    const newColumnIds = new Set(columnIds);

    // Check if columns have changed
    const hasChanges =
      columnIds.length !== columnOrder.length ||
      columnIds.some((id) => !currentColumnIds.has(id)) ||
      columnOrder.some((id) => !newColumnIds.has(id));

    if (hasChanges) {
      // Preserve existing order for columns that still exist, add new columns at the end
      const preservedOrder = columnOrder.filter((id) => newColumnIds.has(id));
      const newColumns = columnIds.filter((id) => !currentColumnIds.has(id));
      setColumnOrder([...preservedOrder, ...newColumns]);
    }
  }, [columnIds, columnOrder, setColumnOrder, isLoaded]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    onColumnPinningChange: setColumnPinning,
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    getRowCanExpand: getRowCanExpand,
    state: {
      sorting,
      columnOrder,
      columnSizing,
      columnPinning,
      pagination,
      columnFilters,
      expanded,
    },
    enableSortingRemoval: false,
  });

  useEffect(() => {
    if (data.length === 0) return;

    // When pagination is disabled, always show all rows
    if (!showPagination && pagination.pageSize !== data.length) {
      setPagination((current) => ({
        ...current,
        pageSize: data.length,
        pageIndex: 0,
      }));
      return;
    }

    if (pagination.pageSize <= 0) {
      setPagination((current) => ({
        ...current,
        pageSize: data.length,
        pageIndex: 0,
      }));
      return;
    }

    const totalPages = Math.ceil(data.length / pagination.pageSize);
    if (totalPages > 0 && pagination.pageIndex > totalPages - 1) {
      setPagination((current) => ({
        ...current,
        pageIndex: totalPages - 1,
      }));
    }
  }, [
    data.length,
    pagination.pageIndex,
    pagination.pageSize,
    setPagination,
    showPagination,
  ]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex);
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  // Show nothing while localStorage is being read
  if (!isLoaded) {
    return null;
  }

  return (
    <DndContext
      id={dndId}
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div
        className={cn(
          "flex flex-col space-y-4 [&>div]:max-h-[calc(100vh-16rem)]",
          className,
        )}
      >
        {ToolbarComponent && (
          <ToolbarComponent
            table={table}
            {...toolbarProps}
            canCreate={canCreate}
          />
        )}

        {table.getRowModel().rows?.length ? (
          <div>
            <Table
              className="table-fixed"
              style={{ width: table.getCenterTotalSize() }}
            >
              <TableHeader className="sticky top-0 z-10 backdrop-blur-xs">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-muted/50">
                    <SortableContext
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {headerGroup.headers.map((header) => (
                        <DataTableHeader key={header.id} header={header} />
                      ))}
                    </SortableContext>
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => onRowClick?.(row)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <SortableContext
                          key={cell.id}
                          items={columnOrder}
                          strategy={horizontalListSortingStrategy}
                        >
                          <DataTableCell key={cell.id} cell={cell} />
                        </SortableContext>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && ExpandedContentComponent && (
                      <TableRow>
                        <TableCell
                          colSpan={row.getAllCells().length}
                          className="p-0"
                        >
                          <ExpandedContentComponent row={row} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
            {showPagination && (
              <div className="mt-4">
                <DataTablePagination table={table} pageSize={pageSize} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex max-h-[calc(100vh-16rem)] w-full items-center justify-center">
            {noResultsMessage}
          </div>
        )}
      </div>
    </DndContext>
  );
}

const getPinningStyles = <TData,>(column: Column<TData>): CSSProperties => {
  const isPinned = column.getIsPinned();
  if (isPinned) {
    return {
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
    };
  }
  return {};
};

const DataTableHeader = <TData, TValue>({
  header,
}: {
  header: Header<TData, TValue>;
}) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: header.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition,
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
    ...getPinningStyles(header.column),
  };

  const { column } = header;
  const isPinned = column.getIsPinned();
  const isLastLeftPinned =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinned =
    isPinned === "right" && column.getIsFirstColumn("right");

  return (
    <TableHead
      ref={setNodeRef}
      className="[&[data-pinned][data-last-col]]:border-border data-pinned:bg-muted/90 before:bg-border relative h-10 truncate border-t before:absolute before:inset-y-0 before:start-0 before:w-px first:before:bg-transparent data-pinned:backdrop-blur-xs [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l"
      colSpan={header.colSpan}
      style={style}
      data-pinned={isPinned || undefined}
      data-last-col={
        isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
      }
      aria-sort={
        header.column.getIsSorted() === "asc"
          ? "ascending"
          : header.column.getIsSorted() === "desc"
            ? "descending"
            : "none"
      }
    >
      <div className="group flex items-center justify-start gap-0.5">
        <Button
          size="icon"
          variant="ghost"
          className="-ml-2 size-7 cursor-grab shadow-none"
          {...attributes}
          {...listeners}
          aria-label="Drag to change order"
        >
          <GripVerticalIcon
            className="opacity-60"
            size={16}
            aria-hidden="true"
          />
        </Button>

        <span
          className={cn(
            "grow truncate text-xs font-medium uppercase",
            header.column.columnDef.meta?.headerClassName,
          )}
        >
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </span>

        {header.column.getCanSort() && (
          <Button
            size="icon"
            variant="ghost"
            className="-mr-1 size-7 shadow-none"
            onClick={header.column.getToggleSortingHandler()}
            onKeyDown={(e) => {
              // Enhanced keyboard handling for sorting
              if (
                header.column.getCanSort() &&
                (e.key === "Enter" || e.key === " ")
              ) {
                e.preventDefault();
                header.column.getToggleSortingHandler()?.(e);
              }
            }}
          >
            {{
              asc: (
                <ChevronUpIcon
                  className="shrink-0 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
              ),
              desc: (
                <ChevronDownIcon
                  className="shrink-0 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
              ),
            }[header.column.getIsSorted() as string] ?? (
              <ArrowDownUpIcon
                className="shrink-0 opacity-0 group-hover:opacity-60"
                size={16}
                aria-hidden="true"
              />
            )}
          </Button>
        )}

        {header.column.getCanPin() &&
          (header.column.getIsPinned() ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="icon"
                    variant="ghost"
                    className="-mr-1 size-7 shadow-none"
                    onClick={() => header.column.pin(false)}
                    aria-label={`Unpin column ${
                      header.column.columnDef.header as string
                    }`}
                  >
                    <PinOffIcon
                      className="opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                  </Button>
                }
              ></TooltipTrigger>
              <TooltipContent>
                Unpin column {header.column.columnDef.header as string}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="icon"
                    variant="ghost"
                    className="-mr-1 size-7 shadow-none"
                    onClick={() => header.column.pin("left")}
                    aria-label={`Pin column ${
                      header.column.columnDef.header as string
                    } `}
                  >
                    <PinIcon
                      className="opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                  </Button>
                }
              ></TooltipTrigger>
              <TooltipContent>
                Pin column {header.column.columnDef.header as string} to left
              </TooltipContent>
            </Tooltip>
          ))}

        {header.column.getCanResize() && (
          <div
            {...{
              onDoubleClick: () => header.column.resetSize(),
              onMouseDown: header.getResizeHandler(),
              onTouchStart: header.getResizeHandler(),
              className:
                "absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:translate-x-px",
            }}
          />
        )}
      </div>
    </TableHead>
  );
};

const DataTableCell = <TData, TValue>({
  cell,
}: {
  cell: Cell<TData, TValue>;
}) => {
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: cell.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition,
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
    ...getPinningStyles(cell.column),
  };

  const { column } = cell;
  const isPinned = column.getIsPinned();
  const isLastLeftPinned =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinned =
    isPinned === "right" && column.getIsFirstColumn("right");
  const cellClassName = column.columnDef.meta?.cellClassName;

  return (
    <TableCell
      ref={setNodeRef}
      className={cn(
        "[&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/90 truncate data-pinned:backdrop-blur-xs [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l",
        cellClassName,
      )}
      style={style}
      data-pinned={isPinned || undefined}
      data-last-col={
        isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
      }
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};
