'use client';

import { Image as ImageIcon } from 'lucide-react';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  className?: string;
  iconSize?: number;
}

export default function SafeImage({
  src,
  alt = 'Image',
  className = '',
  iconSize = 20,
  fill,
  width,
  height,
  ...props
}: SafeImageProps) {
  const isValidSrc =
    Boolean(src) &&
    typeof src === 'string' &&
    src.trim() !== '' &&
    src !== 'null' &&
    src !== 'undefined';

  const [hasError, setHasError] = useState(!isValidSrc);

  if (hasError || !isValidSrc) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center rounded border border-white/5 bg-slate-800/80 ${className}`}
      >
        <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
          <ImageIcon size={iconSize} className="opacity-50" />
        </div>
      </div>
    );
  }

  return (
    <Image
      {...props}
      fill={fill}
      width={width}
      height={height}
      src={src as string}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
