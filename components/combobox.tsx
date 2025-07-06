"use client";

import * as React from "react";
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
import { Badge } from "./ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";

type ComboboxProps<T> = {
  items: { value: T; tag?: string; label: React.ReactNode }[];
  defaultValue?: T[] | T;
  name: string;
  canAdd?: boolean;
  multiple?: boolean;
  emptyLabel?: (input: string) => React.ReactNode;
  popoverClassName?: string;
  value?: T[] | T;
  onChange?: (value: T[] | T) => void;
} & React.ComponentProps<typeof Button>;

const Combobox = <T extends string | number>({
  items,
  defaultValue = [],
  name,
  canAdd = false,
  multiple = false,
  emptyLabel,
  popoverClassName,
  value,
  onChange,
  ...buttonProps
}: ComboboxProps<T>) => {
  const [controlled] = React.useState(value !== undefined);

  if (!controlled && value !== undefined) {
    console.error(
      `Warning: A component is changing from uncontrolled to controlled. ` +
        `This may be caused by the value changing from undefined to a defined value, ` +
        `which should not happen. Decide between using a controlled or uncontrolled ` +
        `input element for the lifetime of the component.`,
    );
  }

  if (controlled && value === undefined) {
    console.error(
      `Warning: A component is changing from controlled to uncontrolled. ` +
        `This may be caused by the value changing from a defined value to undefined, ` +
        `which should not happen. Decide between using a controlled or uncontrolled ` +
        `input element for the lifetime of the component.`,
    );
  }

  const [open, setOpen] = React.useState(false);
  const [values, setValues] = controlled
    ? ([Array.isArray(value) ? value : value ? [value] : [], () => {}] as [
        T[],
        React.Dispatch<React.SetStateAction<T[]>>,
      ])
    : React.useState<T[]>(
        Array.isArray(defaultValue)
          ? defaultValue
          : defaultValue
            ? [defaultValue]
            : [],
      );
  const [inputValue, setInputValue] = React.useState("");
  // To track if the default values have been manually changed
  const [hasChanged, setHasChanged] = React.useState(false);

  if (
    !controlled &&
    !hasChanged &&
    JSON.stringify(values) !== JSON.stringify(defaultValue)
  ) {
    setValues(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
  }

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
      const newValues = values.filter((val) => val !== value);
      // Noop on controlled.
      setValues(newValues);
      onChange?.(multiple ? newValues : (newValues[0] ?? ""));
    } else {
      const newValues = multiple ? [...values, value] : [value];
      setValues(newValues);
      onChange?.(multiple ? newValues : (newValues[0] ?? ""));
    }
    setHasChanged(true);

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
            "w-full justify-between truncate",
            buttonProps.className,
          )}
        >
          {values.length > 0 ? (
            multiple ? (
              <div className="-ml-4 flex gap-1 overflow-auto pl-4">
                {values.map((value) => (
                  <Badge variant="default" className="bg-zinc-600" key={value}>
                    {combinedItems.find((item) => item.value === value)?.tag ??
                      value}
                    <X
                      className="pointer-events-auto! ml-1 cursor-pointer opacity-70 transition-opacity hover:opacity-100"
                      onClick={(e) => {
                        e.preventDefault();
                        const newValues = values.filter((v) => v !== value);
                        setValues(newValues);
                        onChange?.(multiple ? newValues : (newValues[0] ?? ""));
                        setHasChanged(true);
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
          <ChevronsUpDown className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      {values.map((value) => (
        <input
          key={value}
          type="hidden"
          name={name + (multiple ? "[]" : "")}
          value={value}
          readOnly
          disabled
        />
      ))}
      <PopoverContent className={cn("w-[318px] p-0", popoverClassName)}>
        <Command>
          <CommandInput
            value={inputValue}
            onValueChange={setInputValue}
            placeholder={canAdd ? "Search or create new ..." : "Search ..."}
          />
          <CommandList>
            <CommandEmpty>
              {emptyLabel?.(inputValue) ?? `No entry found.`}
            </CommandEmpty>
            {combinedItems.length > 0 && (
              <CommandGroup>
                {combinedItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={String(item.tag ?? item.value)}
                    onSelect={() => onSelect(item.value)}
                  >
                    {item.label}
                    <Check
                      className="ml-auto opacity-0 data-[selected=true]:opacity-100"
                      data-selected={values.includes(item.value)}
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
