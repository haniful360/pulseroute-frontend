/* eslint-disable jsx-a11y/role-has-required-aria-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, X } from 'lucide-react';
import * as React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps<TFieldValues extends FieldValues = FieldValues> {
  label: string;
  name: FieldPath<TFieldValues>;
  options: Option[];
  control: Control<TFieldValues>;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onSearchChange?: (value: string) => void;
}

const SearchableSelect = <TFieldValues extends FieldValues>({
  label,
  name,
  options,
  control,
  error,
  required = false,
  placeholder = 'Select members...',
  disabled = false,
  onSearchChange,
}: SearchableSelectProps<TFieldValues>) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-2">
      <Label className="block text-xs font-medium text-[#9CA3AF]">
        {label} {required && <span className="text-error">*</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedValues: string[] = Array.isArray(field.value)
            ? (field.value as string[])
            : field.value
              ? [String(field.value)]
              : [];

          const handleRemove = (valToRemove: string, e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const newValues = selectedValues.filter((v: string) => v !== valToRemove);
            field.onChange(newValues);
          };

          const handleSelect = (value: string) => {
            const isSelected = selectedValues.includes(value);
            const newValues = isSelected
              ? selectedValues.filter((v: string) => v !== value)
              : [...selectedValues, value];
            field.onChange(newValues);
          };

          return (
            <Popover open={disabled ? false : open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    'flex min-h-12! w-full cursor-pointer items-center justify-between rounded-md border bg-[#0E182B] px-3 py-2 text-sm transition-all',
                    error ? 'border-error' : 'border-mute/10',
                    disabled && 'cursor-not-allowed bg-[#0E182B] opacity-100',
                  )}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {selectedValues.length > 0 ? (
                      selectedValues.map((val: string) => {
                        const option = options.find((o) => o.value === val);
                        return (
                          <span
                            key={val}
                            className="text-muted border-primary/20 flex items-center gap-1 rounded-full border bg-[#0E182B] px-2.5 py-0.5 text-xs font-medium"
                          >
                            {option ? option.label : 'Unknown'}
                            {!disabled && (
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => handleRemove(val, e)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    handleRemove(val, e as any);
                                  }
                                }}
                                className="text-error ml-1 rounded-full p-0.5 outline-none"
                              >
                                <X className="h-3 w-3" />
                              </span>
                            )}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-muted-foreground">{placeholder}</span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </div>
              </PopoverTrigger>
              {!disabled && (
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                  <Command
                    shouldFilter={!onSearchChange}
                    className="overflow-hidden rounded-sm bg-[#0E182B] text-white"
                  >
                    <CommandInput
                      placeholder={`Search ${label}...`}
                      className="h-10"
                      onValueChange={(value) => {
                        if (onSearchChange) onSearchChange(value);
                      }}
                    />
                    <CommandList>
                      <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
                            onSelect={() => handleSelect(option.value)}
                            className="data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary cursor-pointer text-white"
                          >
                            {option.label}
                            <Check
                              className={cn(
                                'text-primary ml-auto h-4 w-4',
                                selectedValues.includes(option.value) ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              )}
            </Popover>
          );
        }}
      />
      {error && <p className="text-error mt-1 text-xs">{error}</p>}
    </div>
  );
};

export default SearchableSelect;
