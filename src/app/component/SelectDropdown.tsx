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
  noFoundText = "No hero found in the tome...",
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
            "bg-parchment border-2 border-wood rounded",
            "text-ink font-crimson text-left",
            "transition-all duration-200",
            "hover:border-gold/50 hover:shadow-md",
            "focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold",
            disabled && "opacity-50 cursor-not-allowed hover:border-wood"
          )}
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-ink-faded" />
            {value
              ? dropdownValues.find(
                  (dropdownValue) => dropdownValue.label === value
                )?.label
              : placeholder}
          </span>
          <ChevronsUpDown className="w-4 h-4 text-ink-faded" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)] p-0 dropdown-tome">
        <Command className="w-full bg-transparent">
          <div className="border-b border-wood/30 p-2">
            <CommandInput
              placeholder={placeholder}
              className="h-9 bg-parchment-light border border-wood/50 rounded px-3 text-ink placeholder:text-ink-faded focus:border-gold focus:ring-1 focus:ring-gold/30"
              disabled={disabled}
            />
          </div>
          <CommandList className="w-full max-h-60">
            <CommandEmpty className="w-full px-4 py-6 text-center text-ink-faded italic">
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
                  className="dropdown-tome-item cursor-pointer hover:bg-gold/10 data-[selected=true]:bg-gold/20"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {/* Hero portrait in medallion style */}
                    <div className="w-10 h-10 rounded-full border-2 border-bronze overflow-hidden bg-leather flex-shrink-0">
                      <img
                        src={dropdownValue.image}
                        alt={dropdownValue.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-crimson text-ink">{dropdownValue.label}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto w-4 h-4 text-gold",
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
