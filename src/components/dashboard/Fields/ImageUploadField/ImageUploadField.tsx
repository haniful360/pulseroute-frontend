/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Label } from '@/components/ui/label';
import { useUploadFilesMutation } from '@/redux/features/fileUpload/fileUpload.api';
import { Camera, ImageIcon, Loader2, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface ImageUploadFieldProps {
  label: string;
  subLabel?: string;
  icon?: React.ReactNode;
  value?: any;
  // eslint-disable-next-line no-unused-vars
  onChange: (fileUrl: string | null) => void;
  error?: string;
  required?: boolean;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  subLabel = 'PNG, JPG up to 10MB',
  icon,
  value,
  onChange,
  error,
  required = false,
}) => {
  const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation();

  const previewUrl = useMemo(() => {
    if (!value) return null;
    return typeof value === 'string' ? value : value?.url || null;
  }, [value]);

  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    const formData = new FormData();
    formData.append('files', file);

    try {
      const res = await uploadFiles(formData).unwrap();
      const uploadedUrl = res?.[0]?.url || res?.data?.[0]?.url;

      if (uploadedUrl) {
        onChange(uploadedUrl);
        toast.success(`${label} uploaded successfully!`);
      } else {
        toast.error('Failed to get uploaded file URL from server response.');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err?.data?.message || 'Failed to upload image.');
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'],
    },
    maxFiles: 1,
    multiple: false,
    disabled: isUploading,
    maxSize: 10 * 1024 * 1024,
    noClick: !!previewUrl,
    noKeyboard: !!previewUrl,
    onDrop: async (acceptedFiles, fileRejections) => {
      if (fileRejections && fileRejections.length > 0) {
        const fileErr = fileRejections[0]?.errors[0];
        if (fileErr?.code === 'file-too-large') {
          toast.error('Image size must be less than 10MB');
        } else if (fileErr?.code === 'file-invalid-type') {
          toast.error('Please upload a valid image file (PNG, JPG, WEBP, etc.)');
        } else {
          toast.error(fileErr?.message || 'Invalid image file');
        }
        return;
      }
      if (acceptedFiles && acceptedFiles[0]) {
        await handleUploadFile(acceptedFiles[0]);
      }
    },
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <Label className="block text-xs font-medium text-[#9CA3AF]">
        {label} {required && <span className="text-error">*</span>}
      </Label>

      <div className="relative">
        {!previewUrl ? (
          <div
            {...getRootProps()}
            className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-10 transition-all duration-300 ${
              isDragActive
                ? isDragReject
                  ? 'border-error bg-red-500/10 ring-2 ring-red-500/20'
                  : 'border-primary bg-primary/10 ring-primary/20 scale-[1.01] ring-2'
                : error
                  ? 'border-error bg-[#0E182B]'
                  : 'hover:border-primary/40 border-primary/10 bg-[#0E182B]'
            }`}
          >
            <input {...getInputProps()} />

            <div className="bg-primary/10 rounded-full p-3 shadow-sm transition-transform duration-300 group-hover:scale-110">
              {isUploading ? (
                <Loader2 className="text-primary h-6 w-6 animate-spin" />
              ) : isDragActive ? (
                <UploadCloud
                  className={`h-6 w-6 animate-bounce ${
                    isDragReject ? 'text-error' : 'text-primary'
                  }`}
                />
              ) : (
                icon || <ImageIcon className="text-primary h-6 w-6" />
              )}
            </div>

            <p className="mt-4 text-sm font-medium text-[#B4B4B8]">
              {isUploading
                ? 'Uploading file, please wait...'
                : isDragActive
                  ? isDragReject
                    ? 'Only image files are supported'
                    : 'Drop image here to upload'
                  : 'Click to upload or drag and drop'}
            </p>
            <p className="text-secondary mt-1 text-xs">
              {isDragActive && !isDragReject ? 'Release to upload image' : subLabel}
            </p>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`group border-primary/10 relative h-56 w-full overflow-hidden rounded-xl border bg-[#0E182B] transition-all duration-300 ${
              isDragActive
                ? isDragReject
                  ? 'border-error border-dashed bg-red-500/10 ring-2 ring-red-500/20'
                  : 'border-primary bg-primary/10 ring-primary/20 border-dashed ring-2'
                : 'hover:border-primary/30'
            }`}
          >
            <input {...getInputProps()} />

            {/* Drag overlay when dragging a new image over existing preview */}
            {isDragActive && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0E182B]/90 backdrop-blur-xs">
                <UploadCloud
                  className={`h-8 w-8 animate-bounce ${
                    isDragReject ? 'text-error' : 'text-primary'
                  }`}
                />
                <p className="mt-2 text-sm font-medium text-white">
                  {isDragReject ? 'Only image files are supported' : 'Drop new image to replace'}
                </p>
                <p className="text-secondary text-xs">{subLabel}</p>
              </div>
            )}

            {/* Uploading overlay during replacement upload */}
            {isUploading && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0E182B]/85 backdrop-blur-xs">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
                <p className="mt-2 text-sm font-medium text-white">Uploading new image...</p>
              </div>
            )}

            <Image
              src={previewUrl}
              alt={label || 'Preview'}
              fill
              unoptimized={previewUrl.startsWith('blob:') || previewUrl.startsWith('data:')}
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
            />

            {/* Top Action Buttons */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
                className="flex h-7 cursor-pointer items-center gap-1 rounded-md bg-black/60 px-2 text-xs font-medium text-white backdrop-blur-xs transition-all hover:bg-black/80 hover:text-blue-400"
                title="Replace image"
              >
                <Camera size={14} />
                <span>Replace</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="bg-error flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-white shadow-xl transition-all hover:bg-red-600 active:scale-90"
                title="Remove image"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <div className="bg-primary/20 absolute right-0 bottom-0 left-0 overflow-hidden p-2 text-center text-xs text-ellipsis whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
              Current {label} • Drop new image or click Replace to update
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-error text-xs font-medium italic">{error}</p>}
    </div>
  );
};

export default ImageUploadField;
