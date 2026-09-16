/* eslint-disable jsx-a11y/role-has-required-aria-props */
/* eslint-disable no-unused-vars */
'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, Search } from 'lucide-react';
import * as React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface SingleSearchableSelectProps<TFieldValues extends FieldValues = FieldValues> {
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

const SingleSearchableSelect = <TFieldValues extends FieldValues>({
  label,
  name,
  options,
  control,
  error,
  required = false,
  placeholder = 'Select option...',
  disabled = false,
  onSearchChange,
}: SingleSearchableSelectProps<TFieldValues>) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [searchVal, setSearchVal] = React.useState('');

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  // Filter options internally if onSearchChange is not provided (as fallback)
  const filteredOptions = React.useMemo(() => {
    if (onSearchChange) return options;
    if (!searchVal) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(searchVal.toLowerCase()));
  }, [options, searchVal, onSearchChange]);

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label className="block text-xs font-medium text-[#9CA3AF]">
        {label} {required && <span className="text-error">*</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedValue = field.value ? String(field.value) : '';
          const selectedOption = options.find((o) => o.value === selectedValue);

          const handleSelect = (value: string) => {
            field.onChange(value);
            setOpen(false);
            setSearchVal('');
          };

          return (
            <div className="relative w-full">
              {/* Trigger */}
              <div
                role="combobox"
                aria-expanded={open}
                onClick={() => !disabled && setOpen(!open)}
                className={cn(
                  'flex min-h-12! w-full cursor-pointer items-center justify-between rounded-md border bg-[#0E182B] px-3 py-2.5 text-sm transition-all',
                  error ? 'border-error' : 'border-mute/10',
                  disabled && 'cursor-not-allowed bg-[#0E182B] opacity-60',
                )}
              >
                <span className={cn('text-white', !selectedValue && 'text-muted-foreground')}>
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-white opacity-50" />
              </div>

              {/* Dropdown Menu */}
              {open && !disabled && (
                <div className="border-mute/10 absolute right-0 left-0 z-50 mt-1.5 flex flex-col overflow-hidden rounded-md border bg-[#0E182B] shadow-xl">
                  {/* Search Input */}
                  <div className="border-mute/10 flex items-center border-b bg-[#0E182B] px-3 py-2">
                    <Search className="text-muted-foreground mr-2 h-4 w-4 shrink-0" />
                    <input
                      type="text"
                      value={searchVal}
                      onChange={handleInputChange}
                      placeholder={`Search ${label.toLowerCase()}...`}
                      className="placeholder:text-muted-foreground w-full bg-transparent text-sm text-white outline-none"
                      autoFocus
                    />
                  </div>

                  {/* List of Options */}
                  <div className="scrollbar max-h-45 overflow-y-auto bg-[#0E182B] p-1">
                    {filteredOptions.length === 0 ? (
                      <div className="text-muted-foreground py-3 text-center text-xs">
                        No {label.toLowerCase()} found.
                      </div>
                    ) : (
                      filteredOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => handleSelect(option.value)}
                          className={cn(
                            'hover:bg-primary/20 flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-xs text-white transition-colors md:text-sm',
                            selectedValue === option.value &&
                              'bg-primary/10 text-primary font-medium',
                          )}
                        >
                          <span>{option.label}</span>
                          {selectedValue === option.value && (
                            <Check className="text-primary h-4 w-4 shrink-0" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        }}
      />
      {error && <p className="text-error mt-1 text-xs">{error}</p>}
    </div>
  );
};

export default SingleSearchableSelect;
