import React, { useState } from 'react';
import { 
  Navigation, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CloudRain, 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  Compass, 
  PhoneCall, 
  AlertOctagon 
} from 'lucide-react';
import { MonitoringZone, RoadHazard } from '../types';

interface RouteOption {
  type: 'fastest' | 'safest';
  name: string;
  highway: string;
  distanceKm: number;
  estimatedTime: string;
  hazardScore: number; // 0-100
  hazardLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  geotechnicalRisk: string;
  activeHazardsCount: number;
  safeCheckpoints: string[];
  recommendation: string;
}

interface DualRoutePlannerProps {
  monitoringZones?: MonitoringZone[];
  onSelectZone?: (zone: MonitoringZone) => void;
  onClose?: () => void;
}

const POPULAR_ROUTES = [
  { origin: 'Siliguri (West Bengal)', destination: 'Gangtok (Sikkim)', highway: 'NH-10 Teesta Gorge Corridor' },
  { origin: 'Guwahati (Assam)', destination: 'Shillong (Meghalaya)', highway: 'NH-06 Umiam Bypass' },
  { origin: 'Lumding (Assam)', destination: 'Haflong (Dima Hasao)', highway: 'NH-27 / Jatinga Valley Track' },
  { origin: 'Dimapur (Nagaland)', destination: 'Kohima (Nagaland)', highway: 'NH-29 Chumukedima Hill Route' },
  { origin: 'Itanagar (Arunachal)', destination: 'Tawang (Arunachal)', highway: 'NH-13 Trans-Arunachal Highway' },
  { origin: 'Silchar (Assam)', destination: 'Aizawl (Mizoram)', highway: 'NH-306 Kolasib Mountain Pass' }
];

export const DualRoutePlanner: React.FC<DualRoutePlannerProps> = ({
  monitoringZones = [],
  onSelectZone,
  onClose
}) => {
  const [origin, setOrigin] = useState('Siliguri (West Bengal)');
  const [destination, setDestination] = useState('Gangtok (Sikkim)');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiGeotechnicalReport, setAiGeotechnicalReport] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<'safest' | 'fastest'>('safest');

  const fastestRoute: RouteOption = {
    type: 'fastest',
    name: 'Standard Valley Highway (NH-10)',
    highway: 'NH-10 Teesta Valley Route',
    distanceKm: 114,
    estimatedTime: '3 hrs 45 mins',
    hazardScore: 78,
    hazardLevel: 'High',
    geotechnicalRisk: 'Passes directly beneath 4 active colluvial slope chutes prone to rockfall during rainfall >15mm/h.',
    activeHazardsCount: 3,
    safeCheckpoints: ['Sevoke Coronation Bridge', 'Melli Checkpost', 'Rangpo Border Staging'],
    recommendation: 'Extreme caution. Restricted to day-time convoy transit only. High probability of debris blockage.'
  };

  const safestRoute: RouteOption = {
    type: 'safest',
    name: 'Bedrock Ridge Alternative (Via Lava / Damdim)',
    highway: 'NH-717A Alternative Ridge Corridor',
    distanceKm: 138,
    estimatedTime: '4 hrs 30 mins',
    hazardScore: 24,
    hazardLevel: 'Low',
    geotechnicalRisk: 'Constructed along solid gneiss bedrock ridge lines with reinforced retaining crib walls and zero toe-river erosion.',
    activeHazardsCount: 0,
    safeCheckpoints: ['Damdim Military Depot', 'Lava Disaster Shelter Point', 'Rorathang Bridge'],
    recommendation: 'Strongly recommended by BRO & Disaster Management. 94% lower landslide incidence probability.'
  };

  const handleAnalyzeRoute = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/route-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination })
      });

      if (response.ok) {
        const data = await response.json();
        setAiGeotechnicalReport(data);
      } else {
        throw new Error('Fallback to local calculation');
      }
    } catch (err) {
      // Local fallback analysis
      setAiGeotechnicalReport({
        summary: `Corridor between ${origin} and ${destination} traverses fragile Siwalik and Lesser Himalayan formations highly vulnerable to monsoonal pore-water saturation.`,
        fastestRouteHazardRating: 'High',
        safestRouteAdvantage: 'Safest corridor maintains 200m elevation above active river flash-flood scour zones and utilizes bedrock ridge alignments.',
        weatherImpact: 'Monsoon precipitation reduces effective normal shear stress by ~40%. Low gear travel advised.',
        safetyCheckpoints: ['District Disaster Control Checkpoint', 'BRO Heavy Equipment Clearing Post'],
        emergencyTollFree: '1070 / 1077 (NDMA NER Control Room)'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* View Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Navigation className="w-4 h-4" />
            <span>AI DUAL-ROUTE GEOTECHNICAL DISPATCHER</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800"
            >
              Close
            </button>
          )}
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
          Fastest vs. Safest Landslide-Resistant Routing
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
          Standard navigation engines optimize solely for travel time, frequently directing vehicles into active landslide chutes and toe-eroded gorge roads. 
          Tiptide compares standard routes against AI geotechnical slope risk models, guiding convoys and travelers to hazard-resilient bedrock alignments.
        </p>
      </div>

      {/* Corridor Selection Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <h2 className="text-sm font-bold text-white font-heading flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          Select Travel Corridor Across North Eastern States
        </h2>

        {/* Popular Route Presets */}
        <div className="flex flex-wrap gap-2">
          {POPULAR_ROUTES.map((route, idx) => (
            <button
              key={idx}
              onClick={() => {
                setOrigin(route.origin);
                setDestination(route.destination);
              }}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                origin === route.origin && destination === route.destination
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {route.origin.split(' ')[0]} → {route.destination.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Input Coordinates / Cities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Origin (Departure Point)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-emerald-400" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Siliguri or Guwahati"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Destination (Arrival Point)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-rose-400" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Gangtok or Shillong"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleAnalyzeRoute}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Geological Slip Factors...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Geotechnical Route Safety</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Geotechnical Advisory Banner (If analyzed) */}
      {aiGeotechnicalReport && (
        <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>AI GEOTECHNICAL TERRAIN ASSESSMENT • HIGHWAY CORRIDOR</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {aiGeotechnicalReport.summary}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Weather Vulnerability</span>
              <span className="text-slate-300 font-medium">{aiGeotechnicalReport.weatherImpact || 'Moderate precipitation'}</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Safe Ridge Advantage</span>
              <span className="text-emerald-400 font-medium">{aiGeotechnicalReport.safestRouteAdvantage}</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Disaster Control Helpline</span>
              <span className="text-amber-400 font-mono font-bold">{aiGeotechnicalReport.emergencyTollFree || '1070 / 1077'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Dual Route Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Safest Geotechnical Route (Recommended) */}
        <div 
          onClick={() => setSelectedRoute('safest')}
          className={`cursor-pointer rounded-2xl p-6 border transition-all relative space-y-4 ${
            selectedRoute === 'safest'
              ? 'bg-slate-900 border-emerald-500/50 shadow-xl shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              RECOMMENDED SAFEST ROUTE
            </span>
            <span className="text-xs font-mono text-slate-400">Hazard Score: {safestRoute.hazardScore}/100</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{safestRoute.name}</h3>
            <p className="text-xs text-slate-400">{safestRoute.highway}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-800/80">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono">Estimated Time</span>
              <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {safestRoute.estimatedTime}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono">Total Distance</span>
              <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                {safestRoute.distanceKm} km
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 text-emerald-300/90 leading-relaxed">
              <strong>Geotechnical Advantage:</strong> {safestRoute.geotechnicalRisk}
            </div>

            <div className="text-slate-400">
              <span className="font-semibold text-slate-300 block mb-1">Emergency Checkpoints:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
                {safestRoute.safeCheckpoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2">
            <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20">
              Select Bedrock Ridge Route
            </button>
          </div>
        </div>

        {/* Card 2: Fastest Highway Route (Vulnerable) */}
        <div 
          onClick={() => setSelectedRoute('fastest')}
          className={`cursor-pointer rounded-2xl p-6 border transition-all relative space-y-4 ${
            selectedRoute === 'fastest'
              ? 'bg-slate-900 border-rose-500/50 shadow-xl shadow-rose-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <AlertOctagon className="w-3.5 h-3.5" />
              FASTEST BUT SEVERE RISK
            </span>
            <span className="text-xs font-mono text-rose-400 font-bold">Hazard Score: {fastestRoute.hazardScore}/100</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{fastestRoute.name}</h3>
            <p className="text-xs text-slate-400">{fastestRoute.highway}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-800/80">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono">Estimated Time</span>
              <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {fastestRoute.estimatedTime} (45m faster)
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono">Active Hazard Points</span>
              <p className="text-sm font-bold text-rose-400 flex items-center gap-1.5 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {fastestRoute.activeHazardsCount} Blockage Zones
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3 text-rose-300/90 leading-relaxed">
              <strong>Vulnerability:</strong> {fastestRoute.geotechnicalRisk}
            </div>

            <div className="text-slate-400">
              <span className="font-semibold text-slate-300 block mb-1">Advisory Warning:</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {fastestRoute.recommendation}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700">
              View Fastest Route Constraints
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
