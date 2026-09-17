/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { forwardRef, useRef, useState } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface InputFieldProps<T extends FieldValues = any> {
  label?: string;
  name?: Path<T>;
  control?: Control<T, any>;
  type?: string;
  placeholder?: string;
  error?: any;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  variant?: 'light' | 'dark';
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
  rightElement?: React.ReactNode;
  helperText?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  id?: string;
  autoComplete?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
}

interface BaseProps extends Omit<InputFieldProps, 'control' | 'name'> {
  name?: string;
}

const InputFieldBase = forwardRef<HTMLInputElement, BaseProps>(
  (
    {
      label,
      name,
      type = 'text',
      placeholder,
      error,
      required = false,
      readOnly = false,
      disabled = false,
      className,
      containerClassName,
      labelClassName,
      variant = 'light',
      icon,
      prefix,
      rightElement,
      helperText,
      value,
      onChange,
      onBlur,
      id,
      autoComplete,
      min,
      max,
      step,
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const internalInputRef = useRef<HTMLInputElement | null>(null);

    const isPassword = type === 'password';
    const isDate = type === 'date' || type === 'datetime-local';
    const inputType = isPassword && showPassword ? 'text' : type;
    const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const isDark = variant === 'dark';

    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        {/* Label & Right Element */}
        {(label || rightElement) && (
          <div className="flex items-center justify-between">
            {label && (
              <Label
                htmlFor={inputId}
                className={cn(
                  'block text-xs select-none',
                  isDark ? 'font-medium text-[#9CA3AF]' : 'font-semibold text-slate-700',
                  labelClassName,
                )}
              >
                {label}{' '}
                {required && <span className={isDark ? 'text-error' : 'text-red-600'}>*</span>}
              </Label>
            )}
            {rightElement}
          </div>
        )}

        {/* Input Wrapper */}
        <div
          className={cn(
            'relative flex items-center overflow-hidden transition-all',
            isDark
              ? 'rounded-md bg-[#0E182B]'
              : 'rounded-xl border border-slate-200 bg-slate-50/50 focus-within:border-red-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-red-500',
            error && (isDark ? 'border-error' : 'border-red-500 ring-1 ring-red-500'),
          )}
        >
          {/* Prefix (e.g. Flag + +880) */}
          {prefix && (
            <div
              className={cn(
                'flex shrink-0 items-center border-r select-none',
                isDark
                  ? 'border-slate-800 bg-[#0A1120] text-slate-300'
                  : 'border-slate-200 bg-slate-100/70 text-slate-700',
              )}
            >
              {prefix}
            </div>
          )}

          {/* Left Icon */}
          {icon && !prefix && (
            <div className="pointer-events-none absolute top-1/2 left-3.5 z-10 flex -translate-y-1/2 items-center justify-center text-slate-400">
              {icon}
            </div>
          )}

          <Input
            id={inputId}
            name={name}
            type={inputType}
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={disabled}
            value={value ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete={autoComplete}
            min={min}
            max={max}
            step={step}
            ref={(node) => {
              internalInputRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            onClick={() => !readOnly && isDate && internalInputRef.current?.showPicker()}
            className={cn(
              'w-full border-0 shadow-none transition-all focus-visible:ring-0 focus-visible:ring-offset-0',
              isDark
                ? 'h-auto p-3 text-white placeholder:text-slate-500/60'
                : 'h-11 bg-transparent text-sm text-slate-900 placeholder:text-slate-400',
              icon && !prefix && 'pl-10',
              isPassword && 'pr-10',
              readOnly && 'cursor-default opacity-60',
              isDate && !readOnly && 'cursor-pointer',
              className,
            )}
          />

          {/* Password Toggle Button */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                'absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1 transition-colors',
                isDark
                  ? 'text-primary hover:text-primary/80'
                  : 'text-slate-400 hover:text-slate-600',
              )}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Helper text */}
        {helperText && !error && (
          <p className={cn('text-[11px]', isDark ? 'text-slate-400' : 'text-slate-400')}>
            {helperText}
          </p>
        )}

        {/* Error message */}
        {error && (
          <p className={cn('text-xs font-medium', isDark ? 'text-error' : 'text-red-600')}>
            {typeof error === 'string' ? error : error.message}
          </p>
        )}
      </div>
    );
  },
);

InputFieldBase.displayName = 'InputFieldBase';

const ControlledInputField = <T extends FieldValues>({
  control,
  name,
  ...rest
}: InputFieldProps<T> & { control: Control<T, any>; name: Path<T> }) => {
  const {
    field: { onChange, onBlur, value, ref: controllerRef },
  } = useController({ name, control });

  return (
    <InputFieldBase
      {...rest}
      name={name}
      value={(value as any) ?? ''}
      onChange={onChange}
      onBlur={onBlur}
      ref={controllerRef}
    />
  );
};

export const InputField = <T extends FieldValues = any>(props: InputFieldProps<T>) => {
  if (props.control && props.name) {
    return <ControlledInputField {...(props as any)} />;
  }
  return <InputFieldBase {...(props as any)} />;
};

export default InputField;
