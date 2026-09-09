import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Map as MapIcon, 
  Layers, 
  AlertTriangle, 
  ShieldCheck, 
  Navigation, 
  Info, 
  X, 
  Compass, 
  PhoneCall, 
  CheckCircle2, 
  FileText,
  Hospital,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { 
  MonitoringZone, 
  RoadHazard, 
  VerifiedEmergencyFacility, 
  CitizenReport,
  UserLocationState 
} from '../types';
import { NER_STATES, ROAD_HAZARDS, VERIFIED_EMERGENCY_FACILITIES } from './data/nerData.ts';

interface InteractiveRiskMapProps {
  monitoringZones: MonitoringZone[];
  selectedZoneFromParent?: MonitoringZone | null;
  userLocation: UserLocationState;
  citizenReports: CitizenReport[];
  facilities?: VerifiedEmergencyFacility[];
  onSelectZone: (zone: MonitoringZone) => void;
  onNavigateToReport: () => void;
  onNavigateToAlerts: () => void;
}

export const InteractiveRiskMap: React.FC<InteractiveRiskMapProps> = ({
  monitoringZones,
  selectedZoneFromParent,
  userLocation,
  citizenReports,
  facilities = VERIFIED_EMERGENCY_FACILITIES,
  onSelectZone,
  onNavigateToReport,
  onNavigateToAlerts
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedZone, setSelectedZone] = useState<MonitoringZone | null>(
    selectedZoneFromParent || monitoringZones[0]
  );
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [showRoadHazards, setShowRoadHazards] = useState(true);
  const [showSheltersAndHospitals, setShowSheltersAndHospitals] = useState(true);
  const [showCitizenReports, setShowCitizenReports] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on North East India (Assam / Meghalaya border ~26.0° N, 92.5° E)
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.latitude || 26.0, userLocation.longitude || 92.5],
        zoom: 7,
        minZoom: 5,
        maxZoom: 16,
        zoomControl: true,
      });

      // CartoDB Voyager Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO &copy; IMD / GSI NER',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map markers when filters or data change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    // 1. Plot User Location (🔵 Blue Pulse Marker)
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="position: relative; width: 26px; height: 26px;">
            <div style="position: absolute; width: 26px; height: 26px; border-radius: 50%; background: rgba(14, 165, 233, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; top: 4px; left: 4px; width: 18px; height: 18px; border-radius: 50%; background: #0284c7; border: 3px solid #ffffff; box-shadow: 0 0 10px rgba(2, 132, 199, 0.8);"></div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const userMarker = L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon });
      userMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; padding: 4px;">
          <b style="color: #0284c7;">📍 YOU ARE HERE (GPS)</b><br/>
          <span>${userLocation.locationName}</span><br/>
          <span style="font-size: 10px; color: #64748b;">${userLocation.latitude.toFixed(4)}° N, ${userLocation.longitude.toFixed(4)}° E</span>
        </div>
      `);
      markersGroup.addLayer(userMarker);
    }

    // 2. Plot Landslide Monitoring Risk Zones (0-30 Low 🟢, 31-60 Moderate 🟡, 61-80 High 🟠, 81-100 Critical 🔴)
    const filteredZones = monitoringZones.filter(
      z => selectedState === 'All States' || z.state === selectedState
    );

    filteredZones.forEach((zone) => {
      let colorHex = '#10b981'; // low
      let bgClass = 'bg-emerald-500';
      if (zone.riskLevel === 'critical') {
        colorHex = '#ef4444';
        bgClass = 'bg-red-600';
      } else if (zone.riskLevel === 'high') {
        colorHex = '#f97316';
        bgClass = 'bg-orange-500';
      } else if (zone.riskLevel === 'moderate') {
        colorHex = '#f59e0b';
        bgClass = 'bg-amber-400';
      }

      // Circle buffer indicating hazard envelope (350m - 800m)
      const bufferCircle = L.circle(zone.coordinates, {
        color: colorHex,
        fillColor: colorHex,
        fillOpacity: zone.riskLevel === 'critical' ? 0.28 : 0.16,
        radius: zone.riskLevel === 'critical' ? 800 : zone.riskLevel === 'high' ? 600 : 450,
        weight: 2
      });
      bufferCircle.on('click', () => {
        setSelectedZone(zone);
        onSelectZone(zone);
      });
      markersGroup.addLayer(bufferCircle);

      // Icon Pin
      const zoneIcon = L.divIcon({
        className: 'custom-zone-marker',
        html: `
          <div style="background-color: ${colorHex}; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4); cursor: pointer;">
            ${zone.riskScore}
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const zoneMarker = L.marker(zone.coordinates, { icon: zoneIcon });
      zoneMarker.on('click', () => {
        setSelectedZone(zone);
        onSelectZone(zone);
      });
      zoneMarker.bindTooltip(`
        <b>${zone.name}</b><br/>
        Risk: ${zone.riskLevel.toUpperCase()} (${zone.riskScore}/100)<br/>
        Trend: ${zone.trend}
      `);
      markersGroup.addLayer(zoneMarker);
    });

    // 3. Plot Road Hazards if enabled
    if (showRoadHazards) {
      ROAD_HAZARDS.forEach((hazard) => {
        const hazardIcon = L.divIcon({
          className: 'custom-hazard-marker',
          html: `
            <div style="background: #dc2626; color: white; padding: 4px 6px; border-radius: 6px; font-size: 10px; font-weight: bold; border: 1.5px solid white; display: flex; align-items: center; gap: 3px; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">
              ⚠️ <span>${hazard.status === 'Blocked' ? 'ROAD BLOCKED' : 'CAUTION'}</span>
            </div>
          `,
          iconSize: [85, 24],
          iconAnchor: [42, 12]
        });

        const hazardMarker = L.marker(hazard.coordinates, { icon: hazardIcon });
        hazardMarker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 11px;">
            <b style="color: #dc2626;">🚧 ${hazard.name} (${hazard.highway})</b><br/>
            <span>Status: <b>${hazard.status}</b></span><br/>
            <span>Clearance: ${hazard.estimatedClearanceTime || 'Pending'}</span><br/>
            <span style="color: #64748b;">Source: ${hazard.source}</span>
          </div>
        `);
        markersGroup.addLayer(hazardMarker);
      });
    }

    // 4. Plot Verified Facilities (Shelters, Hospitals, NDRF) if enabled
    if (showSheltersAndHospitals) {
      facilities.forEach((fac) => {
        const isShelter = fac.isVerifiedShelter;
        const facIcon = L.divIcon({
          className: 'custom-fac-marker',
          html: `
            <div style="background: ${isShelter ? '#059669' : '#0284c7'}; color: white; width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
              ${isShelter ? '⛺' : '🏥'}
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const facMarker = L.marker(fac.coordinates, { icon: facIcon });
        facMarker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 11px;">
            <b style="color: ${isShelter ? '#059669' : '#0284c7'};">${fac.name}</b><br/>
            <span>Type: <b>${fac.type}</b></span><br/>
            <span>Official Phone: <b>${fac.officialContact}</b></span><br/>
            <span style="color: #64748b;">Authority: ${fac.officialSource}</span>
          </div>
        `);
        markersGroup.addLayer(facMarker);
      });
    }

    // 5. Plot Citizen Reports if enabled
    if (showCitizenReports) {
      citizenReports.forEach((rep) => {
        const isVerified = rep.verificationStatus === 'Verified';
        const repIcon = L.divIcon({
          className: 'custom-rep-marker',
          html: `
            <div style="background: ${isVerified ? '#2563eb' : '#d97706'}; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; border: 1.5px solid white;">
              📢
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const repMarker = L.marker([rep.latitude, rep.longitude], { icon: repIcon });
        repMarker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 11px;">
            <b>📢 Citizen Report (${rep.reportType.toUpperCase()})</b><br/>
            <span style="color: ${isVerified ? '#2563eb' : '#d97706'}; font-weight: bold;">[${rep.verificationStatus}]</span><br/>
            <span>${rep.description}</span><br/>
            <span style="color: #64748b;">${rep.timestamp} by ${rep.reportedByName}</span>
          </div>
        `);
        markersGroup.addLayer(repMarker);
      });
    }

    // If selected zone, pan smoothly
    if (selectedZone && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedZone.coordinates, 10, { duration: 1.2 });
    }
  }, [selectedZone, selectedState, showRoadHazards, showSheltersAndHospitals, showCitizenReports, userLocation, monitoringZones, citizenReports, facilities]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Map Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <MapIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-heading">
              GIS Landslide Hazard & Infrastructure Map
            </h1>
            <p className="text-xs text-slate-400">
              North East India • Real-Time Spatial Risk Layers (GSI & ISRO Bhuvan Integration)
            </p>
          </div>
        </div>

        {/* State Filter */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400 font-medium hidden sm:inline">Filter Region:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
          >
            {NER_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Map + Inspector Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative min-h-[520px] flex flex-col">
          
          {/* Layer toggles floating pill */}
          <div className="absolute top-4 right-4 z-[400] bg-slate-950/90 backdrop-blur-md border border-slate-800 p-2 rounded-xl text-xs space-y-1.5 shadow-xl hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
              Map Layers
            </span>
            <label className="flex items-center gap-2 px-1 text-slate-300 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={showRoadHazards}
                onChange={(e) => setShowRoadHazards(e.target.checked)}
                className="rounded text-cyan-500"
              />
              <span>Road Blockages (BRO)</span>
            </label>
            <label className="flex items-center gap-2 px-1 text-slate-300 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={showSheltersAndHospitals}
                onChange={(e) => setShowSheltersAndHospitals(e.target.checked)}
                className="rounded text-cyan-500"
              />
              <span>Verified Shelters & Hospitals</span>
            </label>
            <label className="flex items-center gap-2 px-1 text-slate-300 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={showCitizenReports}
                onChange={(e) => setShowCitizenReports(e.target.checked)}
                className="rounded text-cyan-500"
              />
              <span>Citizen Evidence</span>
            </label>
          </div>

          {/* Leaflet DOM Anchor */}
          <div ref={mapContainerRef} className="w-full flex-grow min-h-[520px] z-0" />

          {/* Map Legend Footer */}
          <div className="bg-slate-950/95 border-t border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-slate-400 font-medium">Risk Score:</span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> 0–30 Low
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400" /> 31–60 Moderate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-500" /> 61–80 High
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" /> 81–100 Critical
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
              <span>🔵 User GPS</span>
              <span>⚠️ Road Cut Blocked</span>
              <span>⛺ Verified Shelter</span>
            </div>
          </div>
        </div>

        {/* Right Col: Zone Inspector Card */}
        <div className="lg:col-span-4 space-y-4">
          {selectedZone ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
              
              {/* Zone Title & Severity */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono block">
                    {selectedZone.state} • {selectedZone.district}
                  </span>
                  <h2 className="text-lg font-bold text-white font-heading mt-0.5">
                    {selectedZone.name}
                  </h2>
                </div>

                <div className={`px-3 py-1.5 rounded-xl border text-center font-mono ${
                  selectedZone.riskLevel === 'critical'
                    ? 'bg-red-500/15 border-red-500/40 text-red-400'
                    : selectedZone.riskLevel === 'high'
                    ? 'bg-orange-500/15 border-orange-500/40 text-orange-400'
                    : selectedZone.riskLevel === 'moderate'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                }`}>
                  <span className="text-xl font-black block">{selectedZone.riskScore}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider block">
                    {selectedZone.riskLevel}
                  </span>
                </div>
              </div>

              {/* Terrain & Geo Factors */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-slate-500 text-[10px] block">Elevation</span>
                  <span className="font-bold text-white text-sm">{selectedZone.elevationM} m</span>
                </div>
                <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-slate-500 text-[10px] block">Slope Gradient</span>
                  <span className="font-bold text-white text-sm">{selectedZone.slopeAngleDeg}°</span>
                </div>
                <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-slate-500 text-[10px] block">Rainfall (24h)</span>
                  <span className="font-bold text-white text-sm">{selectedZone.rainfall24hMm} mm</span>
                </div>
                <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-slate-500 text-[10px] block">Forecast (12h)</span>
                  <span className="font-bold text-white text-sm">+{selectedZone.forecastRainfallMm} mm</span>
                </div>
              </div>

              {/* Geological Formation */}
              <div className="text-xs space-y-1">
                <span className="text-slate-400 font-medium">Lithology / Formation:</span>
                <p className="text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800 font-mono text-[11px]">
                  {selectedZone.geologicalFormation}
                </p>
              </div>

              {/* Satellite / GIS Indicator */}
              <div className="text-xs space-y-1">
                <span className="text-slate-400 font-medium">Satellite Indicator:</span>
                <p className="text-cyan-300 bg-cyan-950/40 p-2 rounded-lg border border-cyan-900/50 text-[11px]">
                  {selectedZone.satelliteIndicator}
                </p>
              </div>

              {/* Emergency Shelter Availability Check */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Designated Safe Evacuation Facility:
                </span>
                {selectedZone.verifiedShelterAvailable && selectedZone.safeEvacuationPoint ? (
                  <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{selectedZone.safeEvacuationPoint} (~{selectedZone.evacuationDistanceKm} km)</span>
                  </div>
                ) : (
                  <div className="text-amber-400 font-semibold">
                    No verified shelter data available nearby.
                  </div>
                )}
                <div className="text-slate-400 text-[11px] pt-1">
                  Official Control: <span className="text-white font-mono">{selectedZone.officialEmergencyContact}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={onNavigateToReport}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Report Here</span>
                </button>
                <button
                  onClick={onNavigateToAlerts}
                  className="py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Alert Bulletins</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center text-slate-400 text-xs space-y-2">
              <Info className="w-8 h-8 mx-auto text-slate-600" />
              <p>Click on any risk zone marker or buffer circle on the map to inspect its geotechnical risk factors and emergency relief points.</p>
            </div>
          )}

          {/* Quick Region Selector list */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-heading">
              Monitored Corridors ({monitoringZones.length})
            </span>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {monitoringZones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => { setSelectedZone(z); onSelectZone(z); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    selectedZone?.id === z.id
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{z.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    z.riskLevel === 'critical' ? 'text-red-400' : z.riskLevel === 'high' ? 'text-orange-400' : 'text-amber-400'
                  }`}>
                    {z.riskScore}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
