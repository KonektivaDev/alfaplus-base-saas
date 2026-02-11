import { Column } from "@tanstack/react-table";
import { Key, ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../ui/command";
import { cn } from "@/lib/utils";

interface DataTableFacetedFilterProps<TData, TValue, OValue> {
  column: Column<TData, TValue>;
  title: string;
  disabled?: boolean;
  options: {
    label: ReactNode;
    value: OValue;
    key: Key;
  }[];
}

export function DataTableFacetedFilter<TData, TValue, OValue>({
  column,
  disabled,
  options,
  title,
}: DataTableFacetedFilterProps<TData, TValue, OValue>) {
  const facets = column.getFacetedUniqueValues();
  const selectedValues = new Set(column.getFilterValue() as OValue[]);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button disabled={disabled} variant="outline">
            {selectedValues.size > 0 && (
              <Badge variant="secondary">{selectedValues.size}</Badge>
            )}
            {title}
            <ChevronDownIcon className="size-4" />
          </Button>
        }
      />
      <PopoverContent className="max-w-[400px] min-w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.key}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = [...selectedValues];
                      column.setFilterValue(
                        filterValues.length > 0 ? filterValues : undefined,
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "flex size-3 items-center justify-center rounded-sm border",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-input",
                      )}
                    >
                      <CheckIcon className="text-primary-foreground size-3.5" />
                    </div>
                    <span className="truncate">{option.label}</span>
                    {facets.get(option.value) && (
                      <CommandShortcut>
                        {facets.get(option.value)}
                      </CommandShortcut>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
