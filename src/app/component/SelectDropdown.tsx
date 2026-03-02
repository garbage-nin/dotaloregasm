"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function SelectDropdown({
  dropdownValues,
  placeholder = "Please select...",
  noFoundText = "No hero found...",
  disabled = false,
  onSelectChange,
}: {
  dropdownValues: [{ id: any; label: string; image: string }];
  placeholder?: string;
  noFoundText?: string;
  disabled?: boolean;
  onSelectChange?: (value: string, image?: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3",
            "bg-obsidian/80 border border-steel rounded-lg",
            "text-frost font-rajdhani text-left text-base",
            "transition-all duration-200",
            "hover:border-immortal/40 hover:bg-obsidian",
            "focus:outline-none focus:ring-2 focus:ring-immortal/20 focus:border-immortal/50",
            disabled && "opacity-40 cursor-not-allowed hover:border-steel"
          )}
        >
          <span className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-mist" />
            <span className={value ? "text-frost" : "text-mist"}>
              {value
                ? dropdownValues.find(
                    (dropdownValue) => dropdownValue.label === value
                  )?.label
                : placeholder}
            </span>
          </span>
          <ChevronsUpDown className="w-4 h-4 text-mist" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)] p-0 aegis-dropdown">
        <Command className="w-full bg-transparent">
          <div className="border-b border-steel/40 p-2">
            <CommandInput
              placeholder={placeholder}
              className="h-9 bg-void/60 border border-steel/50 rounded-md px-3 text-frost placeholder:text-mist focus:border-immortal/40 focus:ring-1 focus:ring-immortal/20 font-rajdhani"
              disabled={disabled}
            />
          </div>
          <CommandList className="w-full max-h-60">
            <CommandEmpty className="w-full px-4 py-6 text-center text-mist text-sm">
              {noFoundText}
            </CommandEmpty>
            <CommandGroup>
              {dropdownValues.map((dropdownValue) => (
                <CommandItem
                  key={dropdownValue.id}
                  value={dropdownValue.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onSelectChange?.(currentValue, dropdownValue.image);
                    setOpen(false);
                  }}
                  disabled={disabled}
                  className="aegis-dropdown-item hover:bg-arcane/5 data-[selected=true]:bg-arcane/10"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-9 h-9 rounded-full border border-steel overflow-hidden bg-void flex-shrink-0">
                      <img
                        src={dropdownValue.image}
                        alt={dropdownValue.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-rajdhani text-frost text-sm">{dropdownValue.label}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto w-4 h-4 text-arcane",
                      value === dropdownValue.label
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
