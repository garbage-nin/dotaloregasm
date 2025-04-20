"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export function SelectDropdown({
  dropdownValues,
  placeholder = "Please select...",
  noFoundText = "No results found",
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
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100%] justify-between"
          disabled={disabled}
        >
          {value
            ? dropdownValues.find(
                (dropdownValue) => dropdownValue.label === value
              )?.label
            : `${placeholder}`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)] p-0">
        <Command className="w-full">
          <CommandInput
            placeholder={placeholder}
            className="h-9"
            disabled={disabled}
          />
          <CommandList className="w-full">
            <CommandEmpty className="w-full px-2">{noFoundText}</CommandEmpty>
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
                >
                  <div className="flex items-center">
                    <img
                      src={dropdownValue.image}
                      alt={dropdownValue.label}
                      className="w-8 h-8 mr-2"
                    />
                  </div>
                  {dropdownValue.label}
                  <Check
                    className={cn(
                      "ml-auto",
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
