import { authClient } from "@/lib/auth-client";
import {
  ColumnPinningState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useEffect, useState, useRef } from "react";

interface TableState {
  sorting: SortingState;
  columnOrder: string[];
  columnSizing: Record<string, number>;
  columnPinning: ColumnPinningState;
  pagination: PaginationState;
}

interface UseTableStateOptions {
  tableId: string;
  defaultState: TableState;
}

export function useTableState({ tableId, defaultState }: UseTableStateOptions) {
  const { data: session, isPending } = authClient.useSession();
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // State for table configuration
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [],
    right: [],
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Load from localStorage when tableId, user, or defaults change
  useEffect(() => {
    // Wait for session to load
    if (isPending) return;

    // Determine user ID - use actual user ID when signed in, 'anonymous' when not
    const userId = session?.user?.id ?? "anonymous";
    const storageKey = `data-table-${tableId}-${userId}`;

    // Reset to defaults first
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSorting(defaultState.sorting);
    setColumnOrder(defaultState.columnOrder);
    setColumnSizing(defaultState.columnSizing);
    setColumnPinning(defaultState.columnPinning);
    setPagination(defaultState.pagination);

    // Then try to load from localStorage
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsedState: TableState = JSON.parse(saved);

        if (parsedState.sorting) setSorting(parsedState.sorting);
        if (parsedState.columnOrder) setColumnOrder(parsedState.columnOrder);
        if (parsedState.columnSizing) setColumnSizing(parsedState.columnSizing);
        if (parsedState.columnPinning)
          setColumnPinning(parsedState.columnPinning);
        if (parsedState.pagination) setPagination(parsedState.pagination);
      }
    } catch (error) {
      console.warn("Failed to load table state from localStorage:", error);
    }

    setIsLoaded(true);
  }, [tableId, isPending, session?.user?.id, defaultState]);

  // Immediate save for less frequent actions (sorting, pagination, pinning)
  useEffect(() => {
    if (!isLoaded || isPending) return;

    const userId = session?.user?.id ?? "anonymous";
    const storageKey = `data-table-${tableId}-${userId}`;

    try {
      // Get current state and only update immediate-change properties
      const currentSaved = localStorage.getItem(storageKey);
      const currentState = currentSaved ? JSON.parse(currentSaved) : {};

      const state: TableState = {
        ...currentState,
        sorting,
        columnPinning,
        pagination,
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn("Failed to save table state to localStorage:", error);
    }
  }, [
    sorting,
    columnPinning,
    pagination,
    isLoaded,
    isPending,
    tableId,
    session?.user?.id,
  ]);

  // Debounced save for frequent actions (column sizing, order during drag)
  useEffect(() => {
    if (!isLoaded || isPending) return;

    // Clear previous timeout
    if (saveTimeoutRef.current !== null) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(() => {
      const userId = session?.user?.id ?? "anonymous";
      const storageKey = `data-table-${tableId}-${userId}`;

      try {
        // Get current state from localStorage and only update frequent change properties
        const currentSaved = localStorage.getItem(storageKey);
        const currentState = currentSaved ? JSON.parse(currentSaved) : {};

        const state: TableState = {
          ...currentState,
          columnOrder,
          columnSizing,
        };
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (error) {
        console.warn("Failed to save table state to localStorage:", error);
      }
    }, 300); // 300ms debounce for frequent actions

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current !== null) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    columnSizing,
    columnOrder,
    isLoaded,
    isPending,
    tableId,
    session?.user?.id,
  ]);

  return {
    // State values
    sorting,
    columnOrder,
    columnSizing,
    columnPinning,
    pagination,

    // State setters
    setSorting,
    setColumnOrder,
    setColumnSizing,
    setColumnPinning,
    setPagination,

    // Utility
    isLoaded,
  };
}
