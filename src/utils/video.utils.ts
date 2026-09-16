export const DEFAULT_FALLBACK_VIDEO_URL = 'https://www.youtube.com/embed/duzIkACRny8';

/**
 * Utility function to convert external video URLs (YouTube, Vimeo, etc.)
 * into proper embeddable iframe URLs.
 * If no external URL is provided, falls back to DEFAULT_FALLBACK_VIDEO_URL.
 */
export const getEmbedVideoUrl = (url?: string): string => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return DEFAULT_FALLBACK_VIDEO_URL;
  }

  const trimmed = url.trim();

  // YouTube watch format: https://www.youtube.com/watch?v=duzIkACRny8
  // YouTube short format: https://youtu.be/duzIkACRny8
  // YouTube embed format: https://www.youtube.com/embed/duzIkACRny8
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
  }

  // Vimeo format: https://vimeo.com/123456789
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return DEFAULT_FALLBACK_VIDEO_URL;
};
