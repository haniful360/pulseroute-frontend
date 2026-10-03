'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { Ambulance, MapPin, Navigation, ShieldAlert, Layers, Info, Check, RefreshCw } from 'lucide-react';
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
  center = { lat: 23.75, lng: 90.38 }, // Default to central Dhaka
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
  const leafletContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletMapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const leafletMarkersRef = useRef<any[]>([]);
  const leafletRouteLayerRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const trafficLayerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);

  const { isLoaded, loadError, authError } = useGoogleMaps();
  const [engine, setEngine] = useState<'google' | 'osm'>('google');
  const [hasAuthFailed, setHasAuthFailed] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // If Google Maps fails authentication (e.g. BillingNotEnabledMapError), automatically fall back to OpenStreetMap
  useEffect(() => {
    if (authError || loadError) {
      setHasAuthFailed(true);
      setEngine('osm');
    }
  }, [authError, loadError]);

  // Clean up any Google Maps error banners injected into DOM
  useEffect(() => {
    if (engine === 'osm') {
      const gmMessages = document.querySelectorAll('.gm-err-container, [aria-label="Google Maps Error"]');
      gmMessages.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
    }
  }, [engine]);

  // ==========================================
  // 1. GOOGLE MAPS ENGINE INITIALIZATION
  // ==========================================
  useEffect(() => {
    if (engine !== 'google' || !isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const google = window.google;
    if (!google?.maps) return;

    try {
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
    } catch (err) {
      console.warn('Google Maps initialization failed, switching to OpenStreetMap:', err);
      setEngine('osm');
    }
  }, [isLoaded, interactive, engine]);

  // Update Google Maps center & zoom
  useEffect(() => {
    if (engine === 'google' && mapInstanceRef.current && center) {
      mapInstanceRef.current.setCenter(center);
      if (zoom) mapInstanceRef.current.setZoom(zoom);
    }
  }, [center.lat, center.lng, zoom, engine]);

  // Traffic Layer for Google Maps
  const isTraffic = traffic ?? showTraffic;
  useEffect(() => {
    if (engine !== 'google' || !mapInstanceRef.current || !window.google?.maps) return;
    const google = window.google;

    if (isTraffic) {
      if (!trafficLayerRef.current) {
        trafficLayerRef.current = new google.maps.TrafficLayer();
      }
      trafficLayerRef.current.setMap(mapInstanceRef.current);
    } else if (trafficLayerRef.current) {
      trafficLayerRef.current.setMap(null);
    }
  }, [isTraffic, isLoaded, engine]);

  // Google Maps Markers
  useEffect(() => {
    if (engine !== 'google' || !mapInstanceRef.current || !window.google?.maps) return;
    const google = window.google;

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
  }, [markers, isLoaded, engine]);

  // Google Maps Directions Route
  useEffect(() => {
    if (engine !== 'google' || !mapInstanceRef.current || !window.google?.maps) return;
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
        suppressMarkers: true,
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
  }, [route, isLoaded, engine]);

  // ==========================================
  // 2. OPENSTREETMAP (LEAFLET) FALLBACK ENGINE
  // ==========================================
  useEffect(() => {
    if (engine !== 'osm' || !leafletContainerRef.current) return;
    let isCancelled = false;

    async function initLeaflet() {
      if (typeof window === 'undefined') return;

      const L = (await import('leaflet')).default;

      if (isCancelled || !leafletContainerRef.current) return;

      if (!leafletMapInstanceRef.current) {
        const map = L.map(leafletContainerRef.current, {
          center: [center.lat, center.lng],
          zoom,
          zoomControl: interactive,
          dragging: interactive,
          scrollWheelZoom: interactive,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        if (onLocationSelect) {
          map.on('click', async (e: any) => {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;

            let address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
              );
              if (res.ok) {
                const data = await res.json();
                if (data.display_name) {
                  address = data.display_name;
                }
              }
            } catch {
              // fallback to coords
            }

            onLocationSelect({ lat, lng, address });
          });
        }

        leafletMapInstanceRef.current = map;
      } else {
        leafletMapInstanceRef.current.setView([center.lat, center.lng], zoom);
      }

      const map = leafletMapInstanceRef.current;

      // Clear previous Leaflet markers
      leafletMarkersRef.current.forEach((m) => m.remove());
      leafletMarkersRef.current = [];

      // Add markers
      markers.forEach((item) => {
        const mLat = item.lat ?? item.position?.lat ?? 0;
        const mLng = item.lng ?? item.position?.lng ?? 0;
        const markerType = item.iconType || item.type || 'default';

        let customIcon: any;

        if (markerType === 'ambulance') {
          customIcon = L.divIcon({
            className: 'custom-osm-marker',
            html: `
              <div style="display:flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:50%;background:#e63946;border:3px solid #ffffff;box-shadow:0 4px 14px rgba(230,57,70,0.6);animation:pulse 2s infinite;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 17h4V5H10v12z"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h2"/><path d="M14 17h-4"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
                </svg>
              </div>
            `,
            iconSize: [42, 42],
            iconAnchor: [21, 21],
          });
        } else if (markerType === 'pickup') {
          customIcon = L.divIcon({
            className: 'custom-osm-marker',
            html: `
              <div style="display:flex;align-items:center;justify-content:center;width:34px;height:44px;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
                <svg width="34" height="44" viewBox="0 0 38 48">
                  <path d="M19 0C8.5 0 0 8.5 0 19c0 14.2 19 29 19 29s19-14.8 19-29C38 8.5 29.5 0 19 0z" fill="#10B981"/>
                  <circle cx="19" cy="19" r="8" fill="#FFFFFF"/>
                  <circle cx="19" cy="19" r="4" fill="#10B981"/>
                </svg>
              </div>
            `,
            iconSize: [34, 44],
            iconAnchor: [17, 44],
          });
        } else if (markerType === 'destination' || markerType === 'hospital') {
          customIcon = L.divIcon({
            className: 'custom-osm-marker',
            html: `
              <div style="display:flex;align-items:center;justify-content:center;width:34px;height:44px;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
                <svg width="34" height="44" viewBox="0 0 38 48">
                  <path d="M19 0C8.5 0 0 8.5 0 19c0 14.2 19 29 19 29s19-14.8 19-29C38 8.5 29.5 0 19 0z" fill="#2563EB"/>
                  <circle cx="19" cy="19" r="9" fill="#FFFFFF"/>
                  <path d="M17 13h4v4h4v4h-4v4h-4v-4h-4v-4h4v-4z" fill="#2563EB"/>
                </svg>
              </div>
            `,
            iconSize: [34, 44],
            iconAnchor: [17, 44],
          });
        } else {
          customIcon = L.divIcon({
            className: 'custom-osm-marker',
            html: `
              <div style="width:16px;height:16px;border-radius:50%;background:#e63946;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });
        }

        const marker = L.marker([mLat, mLng], { icon: customIcon }).addTo(map);

        if (item.label || item.title) {
          marker.bindPopup(
            `<div style="font-family:sans-serif;font-size:12px;font-weight:700;color:#0b132b;padding:2px 4px;">${item.label || item.title}</div>`
          );
        }

        leafletMarkersRef.current.push(marker);
      });

      // Clear previous route
      if (leafletRouteLayerRef.current) {
        leafletRouteLayerRef.current.remove();
        leafletRouteLayerRef.current = null;
      }

      // Render Route (with OSRM road driving fallback)
      if (route && route.origin && route.destination) {
        try {
          const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${route.origin.lng},${route.origin.lat};${route.destination.lng},${route.destination.lat}?overview=full&geometries=geojson`;
          const osrmRes = await fetch(osrmUrl);

          if (osrmRes.ok && !isCancelled) {
            const osrmData = await osrmRes.json();
            const coordinates = osrmData.routes?.[0]?.geometry?.coordinates;

            if (coordinates && coordinates.length > 0) {
              const latLngs = coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
              const polyline = L.polyline(latLngs, {
                color: '#E63946',
                weight: 5,
                opacity: 0.9,
              }).addTo(map);

              leafletRouteLayerRef.current = polyline;
              map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
              return;
            }
          }
        } catch {
          // OSRM failed, draw straight path
        }

        if (!isCancelled) {
          const directPolyline = L.polyline(
            [
              [route.origin.lat, route.origin.lng],
              [route.destination.lat, route.destination.lng],
            ],
            {
              color: '#E63946',
              weight: 5,
              opacity: 0.85,
              dashArray: '8, 8',
            }
          ).addTo(map);

          leafletRouteLayerRef.current = directPolyline;
          map.fitBounds(directPolyline.getBounds(), { padding: [50, 50] });
        }
      }
    }

    initLeaflet();

    return () => {
      isCancelled = true;
    };
  }, [engine, center.lat, center.lng, zoom, markers, route, interactive, onLocationSelect]);

  // Clean up Leaflet on component unmount
  useEffect(() => {
    return () => {
      if (leafletMapInstanceRef.current) {
        leafletMapInstanceRef.current.remove();
        leafletMapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={cn("relative w-full h-full min-h-[350px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100", className)}>
      {/* 1. Google Maps Container */}
      <div
        ref={mapRef}
        className={cn(
          "w-full h-full min-h-[350px] transition-opacity duration-300",
          engine === 'google' ? 'block opacity-100' : 'hidden opacity-0'
        )}
      />

      {/* 2. OpenStreetMap (Leaflet) Container */}
      <div
        ref={leafletContainerRef}
        className={cn(
          "w-full h-full min-h-[350px] transition-opacity duration-300",
          engine === 'osm' ? 'block opacity-100' : 'hidden opacity-0'
        )}
      />

      {/* 3. Loading Spinner */}
      {engine === 'google' && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 backdrop-blur-xs z-10 text-slate-500">
          <div className="flex flex-col items-center gap-2">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            <span className="text-xs font-semibold">Initializing Maps Engine...</span>
          </div>
        </div>
      )}

      {/* 4. Engine Indicator & Switcher Pill */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-md border border-slate-200/80 backdrop-blur-md text-[11px] font-semibold text-slate-700">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            engine === 'google' ? "bg-emerald-500" : "bg-blue-500 animate-pulse"
          )}
        />
        <span>{engine === 'google' ? 'Google Maps Engine' : 'OpenStreetMap Engine'}</span>

        {hasAuthFailed && (
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
            title="Google Maps Billing Notice"
          >
            <Info className="h-2.5 w-2.5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => setEngine((prev) => (prev === 'google' ? 'osm' : 'google'))}
          className="ml-2 rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition flex items-center gap-1"
        >
          <RefreshCw className="h-2.5 w-2.5" />
          Switch
        </button>
      </div>

      {/* 5. Google Maps Billing Notice Modal */}
      {showInfoModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm mb-2">
              <ShieldAlert className="h-5 w-5" />
              <span>Google Cloud Billing Required</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Google Maps returned: <b className="text-slate-800">BillingNotEnabledMapError</b>. Google requires an active Billing Account attached to your Google Cloud project to serve Google Maps tiles.
            </p>
            <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-[11px] text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Automatic Fallback Active:</p>
              <p>PulseRoute has switched to <b>OpenStreetMap &amp; OSRM Dispatch Routing</b> so you can book ambulances and track live dispatches seamlessly without interruptions.</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <a
                href="https://console.cloud.google.com/project/_/billing/enable"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Enable Billing on Google Cloud
              </a>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
