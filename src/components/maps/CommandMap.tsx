import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useEmergency } from '../../context/EmergencyContext';
import { Incident, ResponderUnit, Hospital, LocationCoord } from '../../types';
import { Crosshair, Layers, Navigation, Shield, AlertTriangle } from 'lucide-react';

interface CommandMapProps {
  onSelectIncident?: (id: string) => void;
  filterType?: string;
  className?: string;
}

export const CommandMap: React.FC<CommandMapProps> = ({
  onSelectIncident,
  filterType = 'ALL',
  className = 'h-full w-full'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);

  const {
    incidents,
    responders,
    hospitals,
    selectedIncidentId,
    setSelectedIncidentId,
    userLocation
  } = useEmergency();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on user's real GPS or default
    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    // Dark OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: 'dark-tiles'
    }).addTo(map);

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    routesLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Run once on mount

  // Center on user location when user location changes significantly
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    // Keep map centered if first load or manually requested
  }, [userLocation]);

  // Recenter map on selected incident when selected incident changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedIncidentId) return;
    const inc = incidents.find(i => i.id === selectedIncidentId);
    if (inc) {
      mapInstanceRef.current.panTo([inc.location.lat, inc.location.lng], {
        animate: true,
        duration: 0.8
      });
    }
  }, [selectedIncidentId, incidents]);

  // Update Markers & Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const routesLayer = routesLayerRef.current;
    if (!map || !markersLayer || !routesLayer) return;

    markersLayer.clearLayers();
    routesLayer.clearLayers();

    // 1. User's Real Location Marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-gps-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-cyan-400/30 animate-ping"></div>
            <div class="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_12px_#00E5FF]"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
      userMarker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif;">
          <div style="font-weight: 700; color: #00E5FF; font-size: 13px; margin-bottom: 2px;">Your GPS Location</div>
          <div style="color: #94A3B8; font-size: 11px;">Accuracy: ±${userLocation.accuracy || 15}m</div>
          <div style="color: #CBD5E1; font-size: 11px; margin-top: 4px;">${userLocation.address || 'Detected by browser'}</div>
        </div>
      `);
      markersLayer.addLayer(userMarker);
    }

    // 2. Incident Markers
    const filteredIncidents = incidents.filter(inc => {
      if (filterType === 'ALL') return true;
      if (filterType === 'ACCIDENTS') return inc.type === 'accident';
      if (filterType === 'MEDICAL') return inc.type === 'medical';
      if (filterType === 'FIRE') return inc.type === 'fire';
      if (filterType === 'POLICE') return inc.type === 'police';
      if (filterType === 'CRITICAL') return inc.aiAnalysis?.priority === 'CRITICAL';
      if (filterType === 'RESPONDING') return inc.overallStatus === 'RESPONDING';
      return true;
    });

    filteredIncidents.forEach(inc => {
      const isSelected = inc.id === selectedIncidentId;
      const isCritical = inc.aiAnalysis?.priority === 'CRITICAL';
      const isFalse = inc.humanStatus === 'FALSE_REPORT';

      let emoji = '🚨';
      let ringColor = 'rgba(255, 51, 75, 0.4)';
      let badgeBg = 'bg-red-600';

      if (inc.type === 'accident') {
        emoji = '🚗';
      } else if (inc.type === 'fire') {
        emoji = '🔥';
        badgeBg = 'bg-orange-600';
      } else if (inc.type === 'medical') {
        emoji = '🏥';
        badgeBg = 'bg-rose-600';
      } else if (inc.type === 'police') {
        emoji = '👮';
        badgeBg = 'bg-blue-600';
      } else if (inc.type === 'hazard') {
        emoji = '🚧';
        badgeBg = 'bg-amber-600';
      }

      if (isFalse) {
        emoji = '⚠';
        badgeBg = 'bg-slate-700';
      }

      const incidentIcon = L.divIcon({
        className: 'incident-marker',
        html: `
          <div class="relative cursor-pointer group">
            ${isCritical ? `<div class="absolute -inset-2 rounded-full pulse-critical"></div>` : ''}
            <div class="relative flex items-center justify-center w-9 h-9 rounded-xl ${badgeBg} border-2 ${
              isSelected ? 'border-cyan-400 scale-110 shadow-[0_0_20px_#00E5FF]' : 'border-white/80 shadow-lg'
            } transition-all duration-200">
              <span class="text-base">${emoji}</span>
              <span class="absolute -bottom-2 font-mono text-[9px] font-bold px-1 rounded bg-[#07111F] text-white border border-slate-700">
                #${inc.displayNumber}
              </span>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([inc.location.lat, inc.location.lng], { icon: incidentIcon });
      marker.on('click', () => {
        setSelectedIncidentId(inc.id);
        if (onSelectIncident) onSelectIncident(inc.id);
      });

      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-weight: 800; color: #FFFFFF; font-size: 13px;">Incident #${inc.displayNumber}</span>
            <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: ${
              inc.aiAnalysis?.priority === 'CRITICAL' ? '#991B1B' : '#1E3A8A'
            }; color: #FFFFFF;">${inc.aiAnalysis?.priority || 'HIGH'}</span>
          </div>
          <div style="color: #00E5FF; font-weight: 600; font-size: 12px; margin-bottom: 4px;">${inc.title}</div>
          <div style="color: #CBD5E1; font-size: 11px; margin-bottom: 6px;">${inc.description.slice(0, 75)}...</div>
          <div style="color: #94A3B8; font-size: 10px;">Status: <strong style="color: #38BDF8;">${inc.overallStatus}</strong></div>
        </div>
      `);

      markersLayer.addLayer(marker);
    });

    // 3. Hospital Markers
    hospitals.forEach(hosp => {
      const hospIcon = L.divIcon({
        className: 'hospital-marker',
        html: `
          <div class="relative cursor-pointer">
            <div class="flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-950/90 border border-teal-500/60 shadow-lg text-teal-300">
              <span class="text-xs">🏥</span>
              <span class="text-[10px] font-bold font-mono">${hosp.availableBeds} beds</span>
            </div>
          </div>
        `,
        iconSize: [60, 24],
        iconAnchor: [30, 12]
      });

      const marker = L.marker([hosp.location.lat, hosp.location.lng], { icon: hospIcon });
      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif;">
          <div style="font-weight: 800; color: #2DD4BF; font-size: 13px; margin-bottom: 2px;">🏥 ${hosp.name}</div>
          <div style="color: #94A3B8; font-size: 11px;">Status: ${hosp.status}</div>
          <div style="color: #E2E8F0; font-size: 11px; margin-top: 4px;">Available Beds: <strong>${hosp.availableBeds} / ${hosp.totalBeds}</strong></div>
          <div style="color: #94A3B8; font-size: 11px;">Trauma Unit: ${hosp.traumaCenterAvailable ? '✓ Ready' : 'Standard Care'}</div>
        </div>
      `);
      markersLayer.addLayer(marker);
    });

    // 4. Simulated Responders & Animated Route Lines
    responders.forEach(unit => {
      let iconEmoji = '🚑';
      let bgColor = 'bg-cyan-600';
      if (unit.type === 'POLICE') {
        iconEmoji = '🚓';
        bgColor = 'bg-blue-600';
      } else if (unit.type === 'FIRE') {
        iconEmoji = '🚒';
        bgColor = 'bg-red-600';
      } else if (unit.type === 'TRAFFIC') {
        iconEmoji = '🚧';
        bgColor = 'bg-amber-600';
      }

      const isResponding = unit.status === 'RESPONDING';
      const isOnScene = unit.status === 'ON_SCENE';

      const responderIcon = L.divIcon({
        className: 'responder-marker',
        html: `
          <div class="relative cursor-pointer">
            ${isResponding ? '<div class="absolute -inset-2 rounded-full pulse-cyan"></div>' : ''}
            <div class="relative flex items-center gap-1.5 px-2 py-1 rounded-lg ${bgColor} text-white border border-white/60 shadow-md">
              <span class="text-xs">${iconEmoji}</span>
              <span class="text-[10px] font-mono font-bold tracking-tight">${unit.id}</span>
              ${
                isResponding
                  ? '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>'
                  : ''
              }
            </div>
          </div>
        `,
        iconSize: [70, 26],
        iconAnchor: [35, 13]
      });

      const marker = L.marker([unit.currentLocation.lat, unit.currentLocation.lng], { icon: responderIcon });
      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif;">
          <div style="font-weight: 800; color: #FFFFFF; font-size: 12px; margin-bottom: 2px;">
            ${unit.name} <span style="font-size: 10px; color: #38BDF8;">(${unit.id})</span>
          </div>
          <div style="color: #94A3B8; font-size: 11px;">Status: <strong style="color: ${isResponding ? '#4ADE80' : '#E2E8F0'}">${unit.status}</strong></div>
          ${
            isResponding && unit.etaSeconds
              ? `<div style="color: #FACC15; font-size: 11px; margin-top: 3px;">ETA: <strong>${Math.ceil(
                  unit.etaSeconds / 60
                )} min</strong> (${unit.distanceKm || 1.2} km)</div>`
              : ''
          }
        </div>
      `);
      markersLayer.addLayer(marker);

      // Draw polyline route if responding
      if (isResponding && unit.routePolyline && unit.routePolyline.length > 1) {
        const polyline = L.polyline(unit.routePolyline, {
          color: '#00E5FF',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 8',
          lineCap: 'round'
        });
        routesLayer.addLayer(polyline);
      }
    });
  }, [incidents, responders, hospitals, selectedIncidentId, filterType, userLocation, setSelectedIncidentId, onSelectIncident]);

  const recenterToUser = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 14, { animate: true });
    }
  };

  return (
    <div className={`relative ${className} bg-[#07111F] rounded-xl overflow-hidden border border-[#1E344F]`}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Controls & Indicators */}
      <div className="absolute top-3 left-3 z-[400] flex flex-col gap-2 pointer-events-none">
        <div className="pointer-events-auto bg-[#0A1420]/90 backdrop-blur-md border border-[#1E344F] rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white tracking-wide">LIVE COMMAND MAP</span>
          <span className="text-[10px] text-cyan-400 font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
            OSM TILES
          </span>
        </div>
      </div>

      {/* Quick Recenter Button */}
      <div className="absolute bottom-3 left-3 z-[400] flex items-center gap-2">
        <button
          onClick={recenterToUser}
          className="bg-[#101C2B]/90 hover:bg-[#162536] text-slate-200 hover:text-cyan-400 border border-[#1E344F] rounded-lg px-3 py-2 text-xs font-semibold shadow-xl flex items-center gap-1.5 transition-all backdrop-blur-md"
          title="Center on your real GPS location"
        >
          <Crosshair className="w-4 h-4 text-cyan-400" />
          <span>My GPS</span>
        </button>
      </div>

      {/* Legend at Bottom Right */}
      <div className="absolute bottom-10 right-3 z-[400] hidden md:flex items-center gap-2 bg-[#0A1420]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#1E344F] text-[11px] text-slate-300">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span> Incident
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Ambulance
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> Police
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span> Hospital
        </span>
      </div>
    </div>
  );
};
