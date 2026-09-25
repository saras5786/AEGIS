import { LocationCoord } from '../types';

// Default Demo City Center (Hyderabad/Kakinada region coordinates or user's real location)
export const DEFAULT_DEMO_CENTER: LocationCoord = {
  lat: 17.385044,
  lng: 78.486671,
  address: 'Central Command Zone, Hyderabad',
  accuracy: 15
};

// Real Browser Geolocation
export function getBrowserCurrentPosition(): Promise<LocationCoord> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy || 20);

        let address = `GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        try {
          // Attempt reverse geocoding via OpenStreetMap Nominatim (Free, no key needed)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`,
            { headers: { 'User-Agent': 'AEGIS-Simulation-App' } }
          );
          if (response.ok) {
            const data = await response.json();
            if (data.display_name) {
              const parts = data.display_name.split(',').slice(0, 3);
              address = parts.join(', ');
            }
          }
        } catch {
          // If network reverse geocode fails, use coordinate string
          address = `Location near ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
        }

        resolve({
          lat,
          lng,
          accuracy,
          address
        });
      },
      (error) => {
        let msg = 'Failed to get location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Location permission was denied. You can still pick a spot on the map.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Location information is unavailable. Using manual map selection.';
            break;
          case error.TIMEOUT:
            msg = 'Location request timed out. Please select on map.';
            break;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000
      }
    );
  });
}

// Haversine distance in Kilometers
export function calculateDistanceKm(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

function toRad(val: number): number {
  return (val * Math.PI) / 180;
}

// Generate realistic polyline waypoints along simulated streets between 2 points
export function generateRoutePoints(from: LocationCoord, to: LocationCoord, steps = 8): [number, number][] {
  const points: [number, number][] = [];
  points.push([from.lat, from.lng]);

  const dLat = (to.lat - from.lat) / steps;
  const dLng = (to.lng - from.lng) / steps;

  // Add slight jitter to simulate following city road blocks
  for (let i = 1; i < steps; i++) {
    const progress = i / steps;
    // create a realistic turn or slight bend
    const jitterFactor = Math.sin(progress * Math.PI) * 0.0015;
    const lat = from.lat + dLat * i + (i % 2 === 0 ? jitterFactor : -jitterFactor * 0.5);
    const lng = from.lng + dLng * i + (i % 2 === 1 ? jitterFactor : -jitterFactor * 0.5);
    points.push([lat, lng]);
  }

  points.push([to.lat, to.lng]);
  return points;
}
