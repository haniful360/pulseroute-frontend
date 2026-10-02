'use client';

import React, { useEffect, useRef } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { Ambulance, MapPin, Navigation, ShieldAlert, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MapMarkerItem {
  id: string;
  lat?: number;
  lng?: number;
  position?: { lat: number; lng: number };
  title?: string;
  iconType?: 'ambulance' | 'pickup' | 'destination' | 'hospital' | 'default';
  type?: 'ambulance' | 'pickup' | 'destination' | 'hospital' | 'default';
  label?: string;
}

export interface GoogleMapViewProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarkerItem[];
  route?: {
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
  } | null;
  onLocationSelect?: (location: { lat: number; lng: number; address?: string }) => void;
  showTraffic?: boolean;
  traffic?: boolean;
  className?: string;
  interactive?: boolean;
}

export default function GoogleMapView({
  center = { lat: 23.7500, lng: 90.3800 }, // Default to central Dhaka
  zoom = 13,
  markers = [],
  route = null,
  onLocationSelect,
  showTraffic = false,
  traffic,
  className,
  interactive = true,
}: GoogleMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const directionsRendererRef = useRef<any>(null);
  const trafficLayerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);

  const { isLoaded, loadError } = useGoogleMaps();

  // Initialize Map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const google = window.google;
    if (!google?.maps) return;

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: !interactive,
      zoomControl: interactive,
      fullscreenControl: interactive,
      streetViewControl: false,
      mapTypeControl: false,
      styles: [
        {
          featureType: 'poi.business',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'transit.station',
          stylers: [{ visibility: 'simplified' }],
        },
      ],
    });

    mapInstanceRef.current = map;
    geocoderRef.current = new google.maps.Geocoder();

    // Map click handler for location selection
    if (onLocationSelect) {
      map.addListener('click', (e: any) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        if (geocoderRef.current) {
          geocoderRef.current.geocode(
            { location: { lat, lng } },
            (results: any[], status: string) => {
              const address =
                status === 'OK' && results?.[0]
                  ? results[0].formatted_address
                  : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
              onLocationSelect({ lat, lng, address });
            }
          );
        } else {
          onLocationSelect({ lat, lng });
        }
      });
    }
  }, [isLoaded, interactive]);

  // Update center & zoom if changed
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setCenter(center);
      if (zoom) mapInstanceRef.current.setZoom(zoom);
    }
  }, [center.lat, center.lng, zoom]);

  // Traffic Layer
  const isTraffic = traffic ?? showTraffic;

  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return;
    const google = window.google;

    if (isTraffic) {
      if (!trafficLayerRef.current) {
        trafficLayerRef.current = new google.maps.TrafficLayer();
      }
      trafficLayerRef.current.setMap(mapInstanceRef.current);
    } else if (trafficLayerRef.current) {
      trafficLayerRef.current.setMap(null);
    }
  }, [isTraffic, isLoaded]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return;
    const google = window.google;

    // Clear previous markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    markers.forEach((item) => {
      let iconConfig: any = undefined;
      const markerType = item.iconType || item.type || 'default';

      if (markerType === 'ambulance') {
        iconConfig = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="20" fill="#E63946" stroke="#FFFFFF" stroke-width="3"/>
              <path d="M12 18h14l4 4v8h-3a3 3 0 1 1-6 0h-6a3 3 0 1 1-6 0h-3v-9a3 3 0 0 1 3-3z" fill="#FFFFFF"/>
              <circle cx="16" cy="30" r="2" fill="#0B132B"/>
              <circle cx="28" cy="30" r="2" fill="#0B132B"/>
              <path d="M17 19v3h3v2h-3v3h-2v-3h-3v-2h3v-3h2z" fill="#E63946"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(44, 44),
          anchor: new google.maps.Point(22, 22),
        };
      } else if (markerType === 'pickup') {
        iconConfig = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="48" viewBox="0 0 38 48">
              <path d="M19 0C8.5 0 0 8.5 0 19c0 14.2 19 29 19 29s19-14.8 19-29C38 8.5 29.5 0 19 0z" fill="#E63946"/>
              <circle cx="19" cy="19" r="8" fill="#FFFFFF"/>
              <circle cx="19" cy="19" r="4" fill="#E63946"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(34, 44),
          anchor: new google.maps.Point(17, 44),
        };
      } else if (markerType === 'destination' || markerType === 'hospital') {
        iconConfig = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="48" viewBox="0 0 38 48">
              <path d="M19 0C8.5 0 0 8.5 0 19c0 14.2 19 29 19 29s19-14.8 19-29C38 8.5 29.5 0 19 0z" fill="#2563EB"/>
              <circle cx="19" cy="19" r="9" fill="#FFFFFF"/>
              <path d="M17 13h4v4h4v4h-4v4h-4v-4h-4v-4h4v-4z" fill="#2563EB"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(34, 44),
          anchor: new google.maps.Point(17, 44),
        };
      }

      const mLat = item.lat ?? item.position?.lat ?? 0;
      const mLng = item.lng ?? item.position?.lng ?? 0;

      const marker = new google.maps.Marker({
        position: { lat: mLat, lng: mLng },
        map: mapInstanceRef.current,
        title: item.title,
        icon: iconConfig,
      });

      if (item.label || item.title) {
        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="font-family:sans-serif;font-size:12px;font-weight:bold;color:#0b132b;padding:2px 4px;">${item.label || item.title}</div>`,
        });
        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });
      }

      markersRef.current.push(marker);
    });
  }, [markers, isLoaded]);

  // Directions Route
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return;
    const google = window.google;

    if (!route || !route.origin || !route.destination) {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
      return;
    }

    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: mapInstanceRef.current,
        suppressMarkers: true, // We render our own high-res custom emergency markers
        polylineOptions: {
          strokeColor: '#E63946',
          strokeOpacity: 0.9,
          strokeWeight: 5,
        },
      });
    }

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: route.origin,
        destination: route.destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result: any, status: string) => {
        if (status === 'OK' && result && directionsRendererRef.current) {
          directionsRendererRef.current.setDirections(result);
        } else {
          console.warn('Google Maps Directions request failed with status:', status);
        }
      }
    );
  }, [route, isLoaded]);

  if (loadError) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 bg-slate-100 text-slate-500 rounded-3xl", className)}>
        <ShieldAlert className="h-8 w-8 text-amber-500 mb-2" />
        <p className="text-sm font-semibold">Google Maps failed to load</p>
        <p className="text-xs text-slate-400 mt-1">{loadError}</p>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-full min-h-[350px] overflow-hidden rounded-3xl", className)}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 backdrop-blur-xs z-10 text-slate-500">
          <div className="flex flex-col items-center gap-2">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            <span className="text-xs font-semibold">Initializing Google Maps Engine...</span>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full min-h-[350px]" />
    </div>
  );
}
