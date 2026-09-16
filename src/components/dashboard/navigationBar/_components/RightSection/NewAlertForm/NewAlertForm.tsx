/* eslint-disable react-hooks/incompatible-library */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, Mail, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import SelectField from '@/components/dashboard/Fields/SelectField/SelectField';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import { useModal } from '@/context/ModalContext';
import { cn } from '@/lib/utils';
import { useCreateAlertMutation } from '@/redux/features/admin/alertManagement/alertManagement.api';
import { TAlertMethod, TAlertType } from '@/types/alert.types';
import { toast } from 'sonner';

// Zod Validation Schema
const alertFormSchema = z.object({
  alertType: z.enum(['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'SYSTEM', 'MAINTENANCE'], {
    message: 'Alert type is required',
  }),
  message: z.string().min(5, { message: 'Message must be at least 5 characters long' }),
  alertMethod: z.enum(['PUSH', 'EMAIL', 'SMS'], {
    message: 'Select a notification method',
  }),
});

type AlertFormValues = z.infer<typeof alertFormSchema>;

const ALERT_TYPE_OPTIONS: { label: string; value: TAlertType }[] = [
  { label: 'Info', value: 'INFO' },
  { label: 'Success', value: 'SUCCESS' },
  { label: 'Warning', value: 'WARNING' },
  { label: 'Error', value: 'ERROR' },
  { label: 'System', value: 'SYSTEM' },
  { label: 'Maintenance', value: 'MAINTENANCE' },
];

const NewAlertForm = () => {
  const { closeModal } = useModal();
  const [createAlert, { isLoading }] = useCreateAlertMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      alertType: 'INFO',
      message: '',
      alertMethod: 'PUSH',
    },
  });

  const selectedMethod = watch('alertMethod');

  const handleSelectMethod = (method: TAlertMethod) => {
    setValue('alertMethod', method, { shouldValidate: true });
  };

  const onFormSubmit = async (data: AlertFormValues) => {
    try {
      await createAlert({
        alertType: data.alertType,
        message: data.message,
        alertMethod: data.alertMethod,
      }).unwrap();

      toast.success('Alert sent successfully!', {
        description: `Type: ${data.alertType} broadcasted via ${data.alertMethod}.`,
      });

      if (closeModal) {
        closeModal();
      }
    } catch (error) {
      console.error('Create alert error:', error);
      toast.error('Failed to send alert', {
        description: 'Please try again.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      {/* 1. ALERT TYPE SELECT FIELD */}
      <SelectField
        label="ALERT TYPE"
        name="alertType"
        control={control}
        options={ALERT_TYPE_OPTIONS}
      />

      {/* 2. MESSAGE TEXTAREA FIELD */}
      <TextAreaField label="MESSAGE" name="message" control={control} placeholder="Add a note..." />

      {/* 3. NOTIFY VIA CUSTOM ROW SELECTION */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[#9CA3AF] uppercase">NOTIFY VIA</label>
        <div className="mt-2 flex items-center gap-3">
          {/* Push Button */}
          <button
            type="button"
            onClick={() => handleSelectMethod('PUSH')}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-sm border px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95',
              selectedMethod === 'PUSH'
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-white/10 bg-[#0B1324] text-[#9CA3AF] hover:border-white/20',
            )}
          >
            <Bell size={16} fill={selectedMethod === 'PUSH' ? 'currentColor' : 'none'} />
            Push
          </button>

          {/* Email Button */}
          <button
            type="button"
            onClick={() => handleSelectMethod('EMAIL')}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-sm border px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95',
              selectedMethod === 'EMAIL'
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-white/10 bg-[#0B1324] text-[#9CA3AF] hover:border-white/20',
            )}
          >
            <Mail size={16} />
            Email
          </button>

          {/* SMS Button */}
          <button
            type="button"
            onClick={() => handleSelectMethod('SMS')}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-sm border px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95',
              selectedMethod === 'SMS'
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-white/10 bg-[#0B1324] text-[#9CA3AF] hover:border-white/20',
            )}
          >
            <MessageSquare size={16} fill={selectedMethod === 'SMS' ? 'currentColor' : 'none'} />
            SMS
          </button>
        </div>

        {/* Zod Validation Error Message */}
        {errors.alertMethod && (
          <p className="text-error mt-1 text-xs font-medium">{errors.alertMethod.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center justify-end gap-3 pt-2">
        {closeModal && (
          <DynamicActionButton
            label="Cancel"
            onClick={closeModal}
            variant="outline"
            className="h-11! border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
          />
        )}
        <DynamicActionButton
          type="submit"
          label={isLoading ? 'Sending...' : 'Send Alert'}
          isLoading={isLoading}
          className="h-11!"
        />
      </div>
    </form>
  );
};

export default NewAlertForm;
