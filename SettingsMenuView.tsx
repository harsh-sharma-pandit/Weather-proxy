import React, { useState } from 'react';
import { 
  Sliders, 
  User, 
  MapPin, 
  Compass, 
  Wifi, 
  WifiOff, 
  RotateCw, 
  CheckCircle2, 
  ShieldAlert, 
  Database, 
  CloudRain, 
  Info, 
  Layers,
  ArrowRight,
  ExternalLink,
  Trash2,
  Sparkles,
  Navigation,
  Radio,
  BarChart2,
  ShieldCheck,
  Building2,
  Cpu,
  LogIn
} from 'lucide-react';
import { UserLocationState, MonitoringZone } from '../types';
import { NORTH_EAST_CITIES } from './data/nerData.ts';

interface SettingsMenuViewProps {
  localUserName: string;
  onUpdateUserName: (name: string) => void;
  userLocation: UserLocationState;
  onSelectCityLocation: (city: { name: string; state: string; coordinates: [number, number] }) => void;
  onRequestDeviceGps: () => void;
  isOnline: boolean;
  onToggleSimulatedNetwork: () => void;
  onForceSync: () => void;
  lastSyncTime: string;
  onSimulateApproach: () => void;
  onSimulateEntered: () => void;
  onSimulateHeavyRain: () => void;
  onResetSimulation: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const SettingsMenuView: React.FC<SettingsMenuViewProps> = ({
  localUserName,
  onUpdateUserName,
  userLocation,
  onSelectCityLocation,
  onRequestDeviceGps,
  isOnline,
  onToggleSimulatedNetwork,
  onForceSync,
  lastSyncTime,
  onSimulateApproach,
  onSimulateEntered,
  onSimulateHeavyRain,
  onResetSimulation,
  onNavigateToTab
}) => {
  const [nameInput, setNameInput] = useState(localUserName);
  const [savedNameSuccess, setSavedNameSuccess] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState(userLocation.locationName);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUserName(nameInput.trim());
    setSavedNameSuccess(true);
    setTimeout(() => setSavedNameSuccess(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Sliders className="w-4 h-4" />
          <span>SYSTEM SETTINGS & HACKATHON DEMO ENGINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
          Tiptide Preferences & Simulation Controls
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
          Configure local identification, calibrate GPS location tracking across the 8 North Eastern States, 
          manage IndexedDB offline caching, or simulate changing field conditions for hackathon demonstrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Local Identity (No sign-in required) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-heading">
              Local Identity (No Sign-In Required)
            </h2>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Tiptide does not require account creation or personal data harvesting. 
            If you provide a name, it is stored locally on your device to personalize urgent distance and safety advisories (e.g., <em className="text-cyan-300">"{localUserName || 'Harsh'}, you are approaching a high-risk landslide zone"</em>).
          </p>

          <form onSubmit={handleSaveName} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                placeholder="Enter your name (e.g. Harsh Sharma)"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-600/20"
              >
                Save Name Locally
              </button>
              {savedNameSuccess && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* 2. Location & GPS Configuration */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white font-heading">
                Location & GPS Settings
              </h2>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
              userLocation.permissionStatus === 'granted'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {userLocation.permissionStatus === 'granted' ? 'GPS Granted' : 'Manual Location'}
            </span>
          </div>

          <div className="text-xs text-slate-300 space-y-1">
            <div>Current: <strong className="text-white">{userLocation.locationName}</strong></div>
            <div className="font-mono text-slate-400 text-[11px]">
              Coordinates: {userLocation.latitude.toFixed(4)}° N, {userLocation.longitude.toFixed(4)}° E
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400">
              Switch Location (North East India Cities & Hazard Corridors):
            </label>
            <select
              value={selectedCityName}
              onChange={(e) => {
                const city = NORTH_EAST_CITIES.find(c => c.name === e.target.value);
                if (city) {
                  setSelectedCityName(city.name);
                  onSelectCityLocation(city);
                }
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
            >
              {NORTH_EAST_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} — {c.state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={onRequestDeviceGps}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Acquire Real Device GPS Position</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. Interactive Hackathon Demo Engine (12-Step Testbed) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Interactive Hackathon Demonstration Controls
              </h2>
              <p className="text-xs text-slate-400">
                Instantly simulate real-world emergency scenarios without waiting for monsoonal weather events
              </p>
            </div>
          </div>

          <button
            onClick={onResetSimulation}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700 transition-colors"
          >
            Reset to Baseline
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Action 1: Simulate Approaching */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-bold text-white text-xs block mb-1">
                1. Test Approaching State
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Moves GPS toward Dikchu risk zone (1.8km → 650m), triggering the <strong className="text-orange-400">APPROACHING</strong> alert state.
              </p>
            </div>
            <button
              onClick={onSimulateApproach}
              className="w-full py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/40 rounded-xl font-bold transition-all text-xs"
            >
              Simulate Approaching
            </button>
          </div>

          {/* Action 2: Simulate Entering Hazard Zone */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-bold text-white text-xs block mb-1">
                2. Test Entering Zone
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Positions user 150m inside the hazard zone, triggering <strong className="text-red-400">ENTERED</strong> state & Emergency Assistance.
              </p>
            </div>
            <button
              onClick={onSimulateEntered}
              className="w-full py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 rounded-xl font-bold transition-all text-xs"
            >
              Simulate Entering Zone
            </button>
          </div>

          {/* Action 3: Simulate Cloudburst Rainfall Surge */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-bold text-white text-xs block mb-1">
                3. Heavy Rain Surge
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Increases 24h precipitation to 240mm to demonstrate real-time Random Forest risk escalation.
              </p>
            </div>
            <button
              onClick={onSimulateHeavyRain}
              className="w-full py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 rounded-xl font-bold transition-all text-xs"
            >
              Trigger Cloudburst Rain
            </button>
          </div>

          {/* Action 4: Simulate Offline Mode */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-bold text-white text-xs block mb-1">
                4. Toggle Offline Mode
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Cuts simulated connection to demonstrate IndexedDB cache, offline distance checks, and report queueing.
              </p>
            </div>
            <button
              onClick={onToggleSimulatedNetwork}
              className={`w-full py-2 rounded-xl font-bold transition-all text-xs border ${
                isOnline
                  ? 'bg-amber-600/20 text-amber-300 border-amber-500/40 hover:bg-amber-600/30'
                  : 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30'
              }`}
            >
              {isOnline ? 'Cut Network (Go Offline)' : 'Reconnect & Auto-Sync'}
            </button>
          </div>

        </div>
      </div>

      {/* 4. Offline Storage, IndexedDB & Sync Metadata */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-heading">
              Offline-First Storage & Synchronization Status
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onForceSync}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Force Sync</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Network State</span>
            <span className={`font-bold text-sm flex items-center gap-1.5 mt-0.5 ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              {isOnline ? '🟢 Connected (Online)' : '🟠 Disconnected (Offline)'}
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Last Synchronized</span>
            <span className="font-bold text-white text-sm font-mono mt-0.5 block">
              {lastSyncTime}
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Local Database</span>
            <span className="font-bold text-cyan-400 text-sm mt-0.5 block">
              IndexedDB (tiptide_offline_db)
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Master Rule Compliance: In offline conditions, Tiptide uses cached risk-zone geometries and last-known risk data. 
          GPS continues to calculate distance and inside-zone alerts locally. Any citizen incident reports created offline are stored in a local queue and automatically uploaded when reconnection occurs.
        </p>
      </div>

      {/* 5. Disaster Operations & Specialty Modules Suite */}
      {onNavigateToTab && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-heading">
              Disaster Management & Specialty Operations Suite
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Launch specialized command dashboards, IoT telemetry feeds, safe route navigators, and relief camp registries.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'routes', label: 'Dual-Route Planner', desc: 'Fastest vs Safest Bedrock Corridor', icon: Navigation, color: 'text-cyan-400' },
              { id: 'emergency', label: 'Emergency Response', desc: 'NDRF / SDRF Evacuation Command', icon: ShieldAlert, color: 'text-red-400' },
              { id: 'telemetry', label: 'Live IoT Telemetry', desc: 'Pore pressure & displacement stream', icon: Radio, color: 'text-teal-400' },
              { id: 'sensors', label: 'Sensor Management', desc: 'Inclinometers & Rain Gauges registry', icon: Cpu, color: 'text-blue-400' },
              { id: 'analytics', label: 'Risk Analytics', desc: 'Monsoonal rainfall vs failure trends', icon: BarChart2, color: 'text-purple-400' },
              { id: 'admin', label: 'Admin Command', desc: 'SITREP export & CAP alerts', icon: ShieldCheck, color: 'text-emerald-400' },
              { id: 'shelters', label: 'Safe-Stay Shelters', desc: 'Emergency relief camp reservations', icon: Building2, color: 'text-amber-400' },
              { id: 'signin', label: 'Officer Portal', desc: 'Official government credentials', icon: LogIn, color: 'text-cyan-400' }
            ].map((mod) => {
              const ModIcon = mod.icon;
              return (
                <button
                  key={mod.id}
                  onClick={() => onNavigateToTab(mod.id)}
                  className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/50 p-3.5 rounded-xl text-left transition-all group flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <ModIcon className={`w-5 h-5 ${mod.color}`} />
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors block">
                      {mod.label}
                    </span>
                    <span className="text-[11px] text-slate-400 leading-snug block mt-0.5">
                      {mod.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Official Data Attribution & Scientific Disclaimer */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs text-slate-400">
        <h3 className="font-bold text-white text-xs uppercase tracking-wider font-heading">
          Official Data Integrations & Project Governance
        </h3>
        <p className="leading-relaxed">
          Tiptide is an AI + GIS software-first system engineered for the North Eastern Region of India (Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura) for Smart India Hackathon 2026.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-slate-300">
          <div>• IMD (India Meteorological Department) — Radar Precipitation</div>
          <div>• GSI Bhu-Sanket — Landslide Susceptibility Layers</div>
          <div>• ISRO / NRSC Landslide Atlas of India — Historical Inventory</div>
          <div>• NDMA SACHET — Common Alerting Protocol (CAP)</div>
        </div>
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400">
          <strong className="text-amber-400 font-semibold block mb-0.5">Safety & Research Disclaimer:</strong>
          Risk scores and safety statuses are prototype AI estimations calibrated on terrain and environmental variables. Prototype thresholds are not official statutory government warning thresholds. In emergency scenarios, always adhere to direct evacuation orders from local District Disaster Management Authorities (DDMA).
        </div>
      </div>

    </div>
  );
};
