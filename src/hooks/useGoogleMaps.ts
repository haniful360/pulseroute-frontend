'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    google?: any;
    __googleMapsLoadingPromise?: Promise<void>;
  }
}

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      'AIzaSyByIQpfN1f9S3Xy58i9u5orxStnnWnbNX0';

    if (!apiKey) {
      setLoadError('Missing Google Maps API key');
      return;
    }

    if (!window.__googleMapsLoadingPromise) {
      window.__googleMapsLoadingPromise = new Promise<void>((resolve, reject) => {
        const existingScript = document.getElementById('google-maps-script');
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve());
          existingScript.addEventListener('error', (e) => reject(e));
          return;
        }

        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,marker&v=weekly`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      });
    }

    window.__googleMapsLoadingPromise
      .then(() => {
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to load Google Maps script:', err);
        setLoadError('Failed to load Google Maps script');
      });
  }, []);

  return { isLoaded, loadError, google: typeof window !== 'undefined' ? window.google : undefined };
}
