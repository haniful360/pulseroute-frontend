/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  useUploadFilesMutation,
  useUploadSingleFileMutation,
} from '@/redux/features/fileUpload/fileUpload.api';
import { ExternalLink, FileText, Loader2, Upload, UploadCloud, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { toast } from 'sonner';

interface FileUploadFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T, any>;
  placeholder?: string;
  error?: any;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
  accept?: string;
}

const extractUploadedUrl = (res: any): string | null => {
  if (!res) return null;
  if (typeof res === 'string') return res;
  if (Array.isArray(res) && res[0]?.url) return res[0].url;
  if (Array.isArray(res) && typeof res[0] === 'string') return res[0];
  if (res?.data && Array.isArray(res.data) && res.data[0]?.url) return res.data[0].url;
  if (typeof res?.url === 'string' && res.url) return res.url;
  if (typeof res?.data?.url === 'string' && res.data.url) return res.data.url;
  if (typeof res?.fileUrl === 'string' && res.fileUrl) return res.fileUrl;
  if (typeof res?.data?.fileUrl === 'string' && res.data.fileUrl) return res.data.fileUrl;
  return null;
};

const FileUploadField = <T extends FieldValues>({
  label,
  name,
  control,
  placeholder = 'Enter file URL or click upload...',
  error,
  required = false,
  readOnly = false,
  className,
}: FileUploadFieldProps<T>) => {
  const [uploadSingleFile, { isLoading: isUploadingSingle }] = useUploadSingleFileMutation();
  const [uploadFiles, { isLoading: isUploadingFiles }] = useUploadFilesMutation();

  const isUploading = isUploadingSingle || isUploadingFiles;

  const {
    field: { onChange, onBlur, value, ref: controllerRef },
  } = useController({ name, control });

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('files', file);

    try {
      let res: any;

      try {
        // Primary: use existing working /files/upload API mutation
        res = await uploadFiles(formData).unwrap();
      } catch (filesErr) {
        console.warn(
          'Primary file upload (/files/upload) failed, trying fallback (/file/upload):',
          filesErr,
        );
        // Fallback: try /file/upload
        const fallbackFormData = new FormData();
        fallbackFormData.append('file', file);
        fallbackFormData.append('files', file);
        res = await uploadSingleFile(fallbackFormData).unwrap();
      }

      const serverUrl = extractUploadedUrl(res);

      if (serverUrl) {
        onChange(serverUrl);
        toast.success(`${file.name} uploaded successfully!`);
      } else {
        toast.error('Failed to parse uploaded file URL from server response.');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      toast.error(err?.data?.message || err?.message || 'Failed to upload file.');
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    disabled: isUploading || readOnly,
    maxFiles: 1,
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles[0]) {
        await uploadFile(acceptedFiles[0]);
      }
    },
  });

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      <Label className="block text-xs font-medium text-[#9CA3AF]">
        {label} {required && <span className="text-error">*</span>}
      </Label>

      <div className="space-y-2">
        <div
          {...getRootProps()}
          className={cn(
            'relative flex items-center rounded-md transition-all duration-200',
            isDragActive && 'ring-2 ring-blue-500/80',
          )}
        >
          <input {...getInputProps()} />

          {/* Drag Overlay indicator */}
          {isDragActive && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-md border border-dashed border-blue-500 bg-[#0E182B]/95 text-xs font-medium text-blue-400 backdrop-blur-xs">
              <UploadCloud className="mr-2 h-4 w-4 animate-bounce text-blue-400" />
              Drop file here to upload
            </div>
          )}

          <Input
            type="text"
            placeholder={placeholder}
            readOnly={readOnly}
            onChange={onChange}
            onBlur={onBlur}
            value={(value as any) ?? ''}
            ref={controllerRef}
            className={cn(
              'h-auto w-full resize-none rounded-md p-3 pr-28 shadow-none transition-all duration-300',
              'border placeholder:text-slate-500/60',
              'focus-visible:border-primary/60 focus-visible:ring-0 focus-visible:ring-offset-0',
              'bg-[#0E182B] text-white',
              error ? 'border-error focus-visible:border-error' : 'border-primary/10',
              className,
            )}
          />

          <div className="absolute right-2.5 z-10 flex items-center gap-1.5">
            {value && (
              <>
                <a
                  href={String(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                  title="Open file in new tab"
                >
                  <ExternalLink size={14} />
                </a>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400"
                  title="Clear file URL"
                >
                  <X size={14} />
                </button>
              </>
            )}

            {!readOnly && (
              <button
                type="button"
                disabled={isUploading}
                onClick={open}
                className="flex cursor-pointer items-center gap-1.5 rounded-md bg-blue-600/20 px-2.5 py-1.5 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-600/30 hover:text-blue-300 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-blue-400" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={13} />
                    <span>Upload</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {value && (
          <div className="flex items-center gap-2 px-1 text-xs text-slate-400">
            <FileText size={12} className="shrink-0 text-blue-400" />
            <span className="max-w-md truncate font-mono text-[11px] text-slate-300">
              {String(value)}
            </span>
          </div>
        )}
      </div>

      {error && <p className="text-error text-xs font-medium">{error}</p>}
    </div>
  );
};

export default FileUploadField;
