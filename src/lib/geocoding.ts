'use client';

export interface GeoLocationResult {
  lat: number;
  lng: number;
  address?: string;
}

/**
 * Gets high-accuracy GPS coordinates from the device browser.
 */
export async function getCurrentDevicePosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        let msg = 'Unable to retrieve location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location access permission was denied. Please allow location access in your browser settings.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Reverse geocodes coordinates (lat, lng) to a human-readable address.
 * Uses Google Maps Geocoder if available; falls back to OpenStreetMap Nominatim.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  // 1. Try Google Maps Geocoder first (most accurate for Bangladesh)
  if (typeof window !== 'undefined' && window.google?.maps?.Geocoder) {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const googleRes = await new Promise<string | null>((resolve) => {
        geocoder.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
          if (status === 'OK' && results?.[0]?.formatted_address) {
            resolve(results[0].formatted_address);
          } else {
            resolve(null);
          }
        });
      });

      if (googleRes) {
        return googleRes;
      }
    } catch {
      // Proceed to fallback
    }
  }

  // 2. Fallback to OpenStreetMap Nominatim
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const building = addr.building || addr.amenity || addr.office || '';
      const road = addr.road || addr.pedestrian || addr.street || '';
      const houseNumber = addr.house_number || '';
      const area =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.city_district ||
        addr.quarter ||
        '';
      const city = addr.city || addr.town || addr.county || 'Dhaka';

      const parts: string[] = [];
      if (building) parts.push(building);
      if (road) {
        parts.push(houseNumber ? `${road}, House ${houseNumber}` : road);
      }
      if (area && !parts.includes(area)) parts.push(area);
      if (city && !parts.includes(city)) parts.push(city);

      const formatted = parts.filter(Boolean).join(', ');
      if (formatted) return formatted;
      if (data.display_name) return data.display_name;
    }
  } catch {
    // Network or rate limit issues
  }

  return `GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

/**
 * Forward geocodes a manually typed address to coordinates.
 * Allows patients to type any address and resolves real lat/lng.
 */
export async function forwardGeocode(
  address: string
): Promise<{ lat: number; lng: number; formattedAddress: string } | null> {
  const clean = address.trim();
  if (!clean) return null;

  const searchTarget =
    clean.toLowerCase().includes('dhaka') || clean.toLowerCase().includes('bangladesh')
      ? clean
      : `${clean}, Dhaka, Bangladesh`;

  // 1. Try Google Maps Geocoder first
  if (typeof window !== 'undefined' && window.google?.maps?.Geocoder) {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const googleRes = await new Promise<{
        lat: number;
        lng: number;
        formattedAddress: string;
      } | null>((resolve) => {
        geocoder.geocode(
          {
            address: searchTarget,
            componentRestrictions: { country: 'BD' },
          },
          (results: any[], status: string) => {
            if (status === 'OK' && results?.[0]?.geometry?.location) {
              resolve({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng(),
                formattedAddress: results[0].formatted_address || clean,
              });
            } else {
              resolve(null);
            }
          }
        );
      });

      if (googleRes) return googleRes;
    } catch {
      // Proceed to fallback
    }
  }

  // 2. Fallback to OpenStreetMap Nominatim
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=bd&q=${encodeURIComponent(
        searchTarget
      )}&limit=1`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          formattedAddress: data[0].display_name || clean,
        };
      }
    }
  } catch {
    // ignore
  }

  return null;
}
