/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ITableFilter } from '@/types/table-filter.types';
import { CalendarIcon, Download, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DynamicTableFilterBarProps {
  fields: ITableFilter[];
  showExport?: boolean;
  exportText?: string;
  onExport?: () => void;
}

function SearchInput({ field }: { field: ITableFilter }) {
  const [localValue, setLocalValue] = useState(field.value || '');

  useEffect(() => {
    setLocalValue(field.value || '');
  }, [field.value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== (field.value || '')) {
        field.onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, field]);

  return (
    <div className="group relative w-full sm:w-70">
      <Search className="group-focus-within:text-primary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        placeholder={field.placeholder}
        onChange={(e) => setLocalValue(e.target.value)}
        value={localValue}
        className="focus:border-primary/50! h-11 w-full rounded-md border border-[#334155]! bg-[#0B1120] pr-4 pl-9 text-xs text-[#9CA3AF] transition-all focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}

export default function DynamicTableFilterBar({
  fields,
  showExport = false,
  exportText = 'Export CSV',
  onExport,
}: DynamicTableFilterBarProps) {
  const searchField = fields.find((f) => f.type === 'search');
  const otherFields = fields.filter((f) => f.type !== 'search');

  return (
    <div className="flex flex-wrap items-center gap-3 overflow-hidden">
      {/* Search Field */}
      {searchField && <SearchInput field={searchField} />}

      {/* Select & Date Fields */}
      {otherFields.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {otherFields.map((field, index) => {
            if (field.type === 'select') {
              return (
                <div
                  key={`${field.name}-${field.value || index}`}
                  className="w-full min-w-40 sm:w-auto"
                >
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || 'all'}
                    value={field.value || 'all'}
                  >
                    <SelectTrigger className="h-11! w-full cursor-pointer border border-[#334155]! bg-[#0B1120] px-3 py-1 text-xs text-[#9CA3AF] focus:ring-0! focus:ring-offset-0!">
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent className="border-[#334155]! bg-[#0B1222] text-[#9CA3AF]">
                      {field.options?.map((opt) => (
                        <SelectItem
                          key={opt?.value}
                          value={opt?.value}
                          className="cursor-pointer text-sm focus:bg-[#334155]! focus:text-[#FFFFFF]"
                        >
                          {opt?.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            }

            if (field.type === 'date') {
              return (
                <div key={index} className="relative w-full min-w-40 sm:w-auto">
                  <Input
                    type="text"
                    placeholder={field.placeholder || 'mm/dd/yyyy'}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => (e.target.type = 'text')}
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ''}
                    className="h-11 w-full rounded-md border border-[#334155]! bg-[#0B1222] pr-8 text-xs text-[#9CA3AF] focus:ring-0"
                  />
                  <CalendarIcon className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" />
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {/* Export Button */}
      {showExport && (
        <button
          onClick={onExport}
          className="flex h-11 cursor-pointer items-center gap-2 rounded-sm border border-[#334155] bg-[#0B1120] px-4 text-xs font-medium text-[#9CA3AF] transition-all duration-300 hover:bg-[#0B1120]/10 hover:text-white active:scale-[0.98]"
        >
          <Download size={15} className="text-[#9CA3AF]" />
          <span>{exportText}</span>
        </button>
      )}
    </div>
  );
}
