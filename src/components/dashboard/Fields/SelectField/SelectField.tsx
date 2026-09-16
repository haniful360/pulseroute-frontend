'use client';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Control, FieldValues, Path, useController } from 'react-hook-form';

interface SelectFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  options: { value: string; label: string }[];
  error?: string;
  control: Control<T>;
  required?: boolean;
  placeholder?: string;
  maxHeight?: string;
  readOnly?: boolean;
}

const SelectField = <T extends FieldValues>({
  label,
  name,
  options,
  error,
  control,
  required,
  maxHeight,
  placeholder = 'Select an option',
  readOnly = false,
}: SelectFieldProps<T>) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
  });

  const safeValue = value === undefined || value === null ? '' : String(value);

  return (
    <div className="space-y-2">
      <Label className="block text-xs font-medium text-[#9CA3AF]">
        {label} {required && <span className="text-error">*</span>}
      </Label>

      <Select
        key={`${name}-${safeValue}`}
        onValueChange={onChange}
        value={safeValue || undefined}
        defaultValue={safeValue || undefined}
        disabled={readOnly}
      >
        <SelectTrigger
          className={cn(
            'focus-visible:border-primary/60 h-auto w-full p-3 py-6 text-white shadow-none transition-all focus-visible:ring-0',
            {
              'border-error': error,
              'border-primary/10': !error,
              'cursor-pointer bg-[#0E182B]': !readOnly,
              'cursor-default bg-[#0E182B] opacity-60': readOnly,
            },
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-[#0E182B] text-white">
          <div style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}>
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="hover:bg-primary/20! cursor-pointer hover:text-white!"
              >
                {opt.label}
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
      {error && <p className="text-error mt-1 text-xs">{error}</p>}
    </div>
  );
};

export default SelectField;
