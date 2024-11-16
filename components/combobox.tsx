"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "./ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { CommandList } from "cmdk";

type ComboboxProps<T> = {
  items: { value: T; tag?: string; label: React.ReactNode }[];
  defaultValues?: T[];
  name: string;
  canAdd?: boolean;
  multiple?: boolean;
  emptyLabel?: (input: string) => React.ReactNode;
  popoverClassName?: string;
} & ButtonProps;

const Combobox = <T extends string | number>({
  items,
  defaultValues = [],
  name,
  canAdd = false,
  multiple = false,
  emptyLabel,
  popoverClassName,
  ...buttonProps
}: ComboboxProps<T>) => {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<T[]>(defaultValues);
  const [inputValue, setInputValue] = React.useState("");
  // To track if the default values have been manually changed
  const hasChanged = React.useRef(false);

  React.useEffect(() => {
    if (!hasChanged.current) {
      setValues((oldValues) =>
        JSON.stringify(oldValues) !== JSON.stringify(defaultValues)
          ? defaultValues
          : oldValues,
      );
    }
  }, [defaultValues]);

  const addedValues = values.filter(
    (value) => !items.find((item) => item.value === value),
  );
  const addedInput =
    inputValue &&
    !values.find((value) => value === inputValue) &&
    !items.find((item) => item.value === inputValue);
  const combinedItems = canAdd
    ? [
        ...(addedInput
          ? [{ value: inputValue as T, label: inputValue, tag: undefined }]
          : []),
        ...addedValues.map((value) => ({
          value,
          label: value,
          tag: undefined,
        })),
        ...items,
      ]
    : items;

  const onSelect = (value: T) => {
    if (values.includes(value)) {
      setValues(values.filter((val) => val !== value));
    } else {
      setValues(multiple ? [...values, value] : [value]);
    }
    hasChanged.current = true;

    if (!multiple) {
      setOpen(false);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(newVal) => {
        if (newVal) {
          setInputValue("");
        }
        setOpen(newVal);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          {...buttonProps}
          className={cn(
            "justify-between w-full bg-muted",
            buttonProps.className,
            "truncate [&_svg]:pointer-events-auto",
          )}
        >
          {values.length > 0 ? (
            multiple ? (
              <div className="-ml-4 flex h-[38px] justify-start gap-1 overflow-auto py-2 pl-4">
                {values.map((value) => (
                  <Badge key={value}>
                    {combinedItems.find((item) => item.value === value)?.tag ??
                      value}
                    <X
                      size={10}
                      className="ml-1 opacity-60 transition-opacity duration-200 ease-in-out hover:cursor-pointer hover:opacity-100"
                      onClick={(e) => {
                        e.preventDefault();
                        setValues(values.filter((v) => v !== value));
                        hasChanged.current = true;
                      }}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              combinedItems.find((item) => item.value === values[0])?.label
            )
          ) : (
            <>&nbsp;</>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <input type="hidden" name={name} value={values.join("|")} />
      <PopoverContent className={cn("w-[322px] p-0", popoverClassName)}>
        <Command>
          <CommandInput
            value={inputValue}
            onValueChange={setInputValue}
            placeholder="Search ..."
          />
          <CommandList>
            <CommandEmpty>
              {emptyLabel?.(inputValue) ?? `No entry found.`}
            </CommandEmpty>
            {combinedItems.length > 0 && (
              <CommandGroup className="max-h-[50svh] overflow-auto">
                {combinedItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={String(item.tag ?? item.value)}
                    onSelect={() => onSelect(item.value)}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        values.includes(item.value)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
