/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface TextAreaFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  placeholder?: string;
  error?: any;
  control: Control<T>;
  required?: boolean;
  readOnly?: boolean;
  rows?: number;
}

const TextAreaField = <T extends FieldValues>({
  label,
  name,
  placeholder,
  error,
  control,
  required = false,
  readOnly = false,
  rows,
}: TextAreaFieldProps<T>) => {
  return (
    <div className="space-y-2">
      <Label className="block text-xs font-medium text-[#9CA3AF]">
        {label} {required && <span className="text-error">*</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder={placeholder}
            readOnly={readOnly}
            rows={rows}
            className={cn(
              'max-h-75 min-h-30 w-full overflow-y-auto rounded-md p-3 shadow-none transition-all duration-300',
              'resize-none border leading-relaxed placeholder:text-slate-500/60',
              'focus-visible:border-primary/50 focus-visible:ring-0 focus-visible:ring-offset-0',
              'custom-scrollbar text-white',
              {
                'cursor-default bg-[#0E182B] opacity-60': readOnly,
                'bg-[#0E182B]': !readOnly,
                'border-error focus-visible:border-error': error,
                'border-primary/10': !error,
              },
            )}
          />
        )}
      />

      {error && <p className="text-error text-xs font-medium">{error}</p>}
    </div>
  );
};

export default TextAreaField;
