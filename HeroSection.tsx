import React from 'react';
import { 
  ShieldAlert, 
  Map, 
  BrainCircuit, 
  Activity, 
  Navigation, 
  Layers, 
  CloudRain, 
  Compass, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Radio
} from 'lucide-react';
import { MonitoringZone, EarlyWarningAlert } from '../types';

interface HeroSectionProps {
  monitoringZones: MonitoringZone[];
  alerts: EarlyWarningAlert[];
  onNavigate: (tab: string) => void;
  onSelectZone: (zone: MonitoringZone) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  monitoringZones,
  alerts,
  onNavigate,
  onSelectZone
}) => {
  const criticalZones = monitoringZones.filter(z => z.riskLevel === 'critical' || z.riskLevel === 'high');
  const activeAlertsCount = alerts.length;

  const statCards = [
    {
      id: 'stat-zones',
      label: 'Active Monitoring Zones',
      value: monitoringZones.length,
      unit: 'Locations',
      subtext: 'Teesta, Dima Hasao, Sohra, Kohima, Aizawl',
      icon: Layers,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30'
    },
    {
      id: 'stat-high-risk',
      label: 'High & Critical Risk Zones',
      value: criticalZones.length,
      unit: 'Active Red Alerts',
      subtext: 'Sikkim NH-10 & Haflong Hill Section',
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/30'
    },
    {
      id: 'stat-sensors',
      label: 'Active Geotechnical Sensors',
      value: '142',
      unit: 'Online Nodes',
      subtext: 'Rain Gauges, Inclinometers, TDR, VW Piezometers',
      icon: Activity,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'stat-alerts',
      label: 'Early Warnings Issued',
      value: activeAlertsCount,
      unit: 'Active Broadcasts',
      subtext: 'Automated SMS & CAP Web Warnings',
      icon: Radio,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30'
    },
    {
      id: 'stat-states',
      label: 'Territorial Coverage',
      value: '8',
      unit: 'NER States',
      subtext: 'Assam, Sikkim, Meghalaya, Mizoram, Nagaland + 3',
      icon: Compass,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/30'
    }
  ];

  return (
    <div className="relative overflow-hidden py-10 sm:py-16 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
      {/* Background Subtle Radar Grid Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      
      {/* Decorative Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>SMART INDIA HACKATHON 2026 • AI-POWERED DISASTER TECH</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight font-heading">
            AI-Powered Landslide <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Early Warning System</span> for North Eastern India
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Real-time geotechnical intelligence across 8 NER states. Combining high-resolution Doppler rainfall, TDR soil saturation, MEMS inclinometers, and physics-informed Gemini AI to predict slope failures up to 12 hours before occurrence.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              id="hero-btn-risk-map"
              onClick={() => onNavigate('risk-map')}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Map className="w-4 h-4" />
              <span>View Live Risk Map</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              id="hero-btn-check-alerts"
              onClick={() => onNavigate('alerts')}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-red-500/50 text-red-300 hover:text-white rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Check Current Alerts ({activeAlertsCount})</span>
            </button>

            <button
              id="hero-btn-ai-predictor"
              onClick={() => onNavigate('ai-predictor')}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              <span>Run AI Geotechnical Simulator</span>
            </button>

            <button
              id="hero-btn-sign-in-portal"
              onClick={() => onNavigate('sign-in')}
              className="flex items-center gap-2 px-4 py-3 bg-slate-900/60 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google Sign-In & Studio</span>
            </button>
          </div>
        </div>

        {/* 5-Card Statistics Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-12">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                id={card.id}
                className={`p-4 rounded-2xl border ${card.bg} backdrop-blur-sm shadow-lg transition-all duration-200 hover:translate-y-[-2px]`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300">{card.label}</span>
                  <div className={`p-2 rounded-lg bg-slate-950/60 ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    {card.value}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">{card.unit}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 truncate">
                  {card.subtext}
                </p>
              </div>
            );
          })}
        </div>

        {/* Live Critical Threats Spotlight Widget */}
        <div className="mt-8 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white font-heading">
                  High-Priority Active Landslide Threat Matrix (NER)
                </h2>
                <p className="text-xs text-slate-400">
                  Critical highway corridors currently under automated IoT surveillance & early warning status
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('live-monitoring')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Explore All 10 Monitored Corridors</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4">
            {criticalZones.slice(0, 3).map((zone) => {
              const isCrit = zone.riskLevel === 'critical';
              return (
                <div
                  key={zone.id}
                  id={`hero-threat-${zone.id}`}
                  onClick={() => {
                    onSelectZone(zone);
                    onNavigate('risk-map');
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                    isCrit 
                      ? 'bg-red-950/20 border-red-500/40 hover:border-red-500' 
                      : 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {zone.state} • {zone.district}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isCrit ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                    }`}>
                      {zone.riskLevel} ({zone.riskScore}%)
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1.5 font-heading">
                    {zone.name}
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg mb-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Rainfall</span>
                      <span className="font-semibold text-cyan-300">{zone.rainfallMm24h} mm</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Soil Sat</span>
                      <span className="font-semibold text-emerald-300">{zone.soilMoisturePercent}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Creep</span>
                      <span className="font-semibold text-amber-300">{zone.groundMovementMm} mm</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {zone.activeAlertMessage}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
