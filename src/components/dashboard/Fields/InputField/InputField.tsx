/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { useRef, useState } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';

interface InputFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T, any>;
  type?: string;
  placeholder?: string;
  error?: any;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
}

const InputField = <T extends FieldValues>({
  label,
  name,
  control,
  type = 'text',
  placeholder,
  error,
  required = false,
  readOnly = false,
  className,
}: InputFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    field: { onChange, onBlur, value, ref: controllerRef },
  } = useController({ name, control });

  const isPassword = type === 'password';
  const isDate = type === 'date' || type === 'datetime-local';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      <Label className="block text-xs font-medium text-[#9CA3AF]">
        {label} {required && <span className="text-error">*</span>}
      </Label>

      <div className="relative">
        <Input
          type={inputType}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={onChange}
          onBlur={onBlur}
          value={(value as any) ?? ''}
          ref={(e) => {
            controllerRef(e);
            inputRef.current = e;
          }}
          onClick={() => !readOnly && isDate && inputRef.current?.showPicker()}
          className={cn(
            'h-auto w-full resize-none rounded-md p-3 shadow-none transition-all duration-300',
            'border placeholder:text-slate-500/60',
            'focus-visible:border-primary/60 focus-visible:ring-0 focus-visible:ring-offset-0',
            'text-white',
            {
              'focus-visible:border-primary/60 cursor-default border-0 bg-[#0E182B] opacity-60':
                readOnly,
              'bg-[#0E182B]': !readOnly,
              'border-error focus-visible:border-error': error,
              'border-primary/10': !error,
              'cursor-pointer': !readOnly && isDate,
            },
            className,
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-primary hover:text-primary/80 absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
        )}
      </div>

      {error && <p className="text-error text-xs font-medium">{error}</p>}
    </div>
  );
};

export default InputField;
