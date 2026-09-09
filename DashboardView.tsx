import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  MapPin, 
  PhoneCall, 
  Compass, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CloudRain, 
  Eye, 
  ShieldCheck, 
  Info, 
  ExternalLink, 
  FileText, 
  ArrowRight,
  Radio,
  Navigation,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  MonitoringZone, 
  PersonalSafetyStatus, 
  UserLocationState, 
  EarlyWarningAlert,
  VerifiedEmergencyFacility,
  CitizenReport 
} from '../types';

interface DashboardViewProps {
  safetyStatus: PersonalSafetyStatus;
  userLocation: UserLocationState;
  monitoringZones: MonitoringZone[];
  alerts: EarlyWarningAlert[];
  facilities: VerifiedEmergencyFacility[];
  recentReports: CitizenReport[];
  localUserName?: string;
  isOnline: boolean;
  lastSyncTime: string;
  onRequestLocation: () => void;
  onNavigateToMap: () => void;
  onNavigateToReport: () => void;
  onNavigateToAlerts: () => void;
  onSelectZone: (zone: MonitoringZone) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  safetyStatus,
  userLocation,
  monitoringZones,
  alerts,
  facilities,
  recentReports,
  localUserName,
  isOnline,
  lastSyncTime,
  onRequestLocation,
  onNavigateToMap,
  onNavigateToReport,
  onNavigateToAlerts,
  onSelectZone
}) => {
  const { nearestZone, stateMachine, distanceMeters, isApproaching, isInsideZone, riskScore, riskLevel, trend, personalizedText } = safetyStatus;

  // Formatting distance
  const formattedDistance = distanceMeters < 1000 
    ? `${distanceMeters} m` 
    : `${(distanceMeters / 1000).toFixed(1)} km`;

  // Severity color maps
  const getSeverityBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-red-500/15 border-red-500/40 text-red-400',
          indicator: 'bg-red-500',
          title: 'CRITICAL RISK',
          border: 'border-red-600/40'
        };
      case 'high':
        return {
          bg: 'bg-orange-500/15 border-orange-500/40 text-orange-400',
          indicator: 'bg-orange-500',
          title: 'HIGH RISK',
          border: 'border-orange-500/40'
        };
      case 'moderate':
        return {
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
          indicator: 'bg-amber-400',
          title: 'MODERATE RISK',
          border: 'border-amber-500/40'
        };
      default:
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
          indicator: 'bg-emerald-500',
          title: 'LOW RISK',
          border: 'border-emerald-500/40'
        };
    }
  };

  const badge = getSeverityBadge(riskLevel);

  // Check verified emergency shelter nearby
  const verifiedShelter = facilities.find(
    f => f.isVerifiedShelter && f.state === nearestZone.state
  );

  const nearestOfficialFacility = facilities.find(
    f => f.state === nearestZone.state
  ) || facilities[0];
  const stateErssLink = userLocation.state === 'Delhi'
    ? 'https://dl.erss.in/request-help'
    : userLocation.state === 'Andhra Pradesh'
      ? 'https://ap.erss.in/request-help'
      : 'https://sachet.ndma.gov.in/';
  const stateErssLabel = userLocation.state === 'Delhi'
    ? 'Delhi ERSS request help'
    : userLocation.state === 'Andhra Pradesh'
      ? 'Andhra Pradesh ERSS request help'
      : 'Open SACHET for state alerts';

  const authorityReport = `URGENT NER LANDSLIDE RISK REPORT
Location: ${userLocation.locationName}
Coordinates: ${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}
State/District: ${userLocation.state} / ${userLocation.district}
Risk: ${riskLevel.toUpperCase()} (${riskScore}/100)
Alert state: ${stateMachine}
Distance to monitored hazard: ${formattedDistance}
Hazard zone: ${nearestZone.name}
Reason: ${personalizedText}
Time: ${new Date().toISOString()}
Please verify and dispatch the appropriate emergency response. This report was prepared locally and is not an authority acknowledgement.`;

  const handleCopyAuthorityReport = async () => {
    try {
      await navigator.clipboard.writeText(authorityReport);
      window.alert('Authority report copied. Send it through ERSS 112, your state control room, or the official SACHET/NDMA channel.');
    } catch {
      window.alert(authorityReport);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Offline Status Warning Bar if offline */}
      {!isOnline && (
        <div className="bg-amber-500/15 border border-amber-500/40 text-amber-200 px-4 py-3 rounded-2xl flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Offline Mode Active:</span> Using cached GIS risk boundaries and data last synchronized at <span className="underline font-mono">{lastSyncTime}</span>.
            </div>
          </div>
          <span className="text-[11px] bg-amber-950 px-2 py-1 rounded text-amber-300 font-mono border border-amber-800 shrink-0 hidden sm:inline">
            Local IndexedDB Cache
          </span>
        </div>
      )}

      {/* 1. VISUAL PRIORITY: RISK + PERSONAL SAFETY STATUS */}
      <section id="tiptide-main-risk-card" className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 transition-all">
        {/* Ambient background glow matching severity */}
        <div className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 ${
          riskLevel === 'critical' ? 'bg-red-500' : riskLevel === 'high' ? 'bg-orange-500' : riskLevel === 'moderate' ? 'bg-amber-400' : 'bg-emerald-500'
        }`} />

        <div className="relative z-10 space-y-6">
          {/* Header Row: Prototype Label + Alert State Machine */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                AREA RISK + GPS STATUS
              </span>
              <span className="text-xs text-slate-400">
                Evaluating <span className="text-white font-semibold">{nearestZone.name}</span>
              </span>
            </div>

            {/* State Machine Status */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Alert State:</span>
              <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 ${
                stateMachine === 'ENTERED'
                  ? 'bg-red-600 text-white animate-pulse'
                  : stateMachine === 'APPROACHING'
                  ? 'bg-orange-500 text-slate-950 font-black'
                  : stateMachine === 'NEAR'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : stateMachine === 'EXITED'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-slate-800 text-slate-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${stateMachine === 'ENTERED' ? 'bg-white' : 'bg-current'}`} />
                {stateMachine}
              </span>
            </div>
          </div>

          {/* Core Risk Score & Level Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Big Risk Number & Trend */}
            <div className="lg:col-span-5 flex items-center gap-5 sm:gap-6">
              <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex flex-col items-center justify-center border-2 shrink-0 ${badge.bg} ${badge.border} shadow-lg`}>
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                  {riskScore}
                </span>
                <span className="text-[11px] font-bold text-slate-400">/ 100</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${badge.indicator} animate-ping`} />
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {badge.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
                  <span>Trend:</span>
                  <span className="flex items-center gap-1 font-bold text-white">
                    {trend === 'Increasing' && <TrendingUp className="w-4 h-4 text-red-400" />}
                    {trend === 'Decreasing' && <TrendingDown className="w-4 h-4 text-emerald-400" />}
                    {trend === 'Stable' && <Minus className="w-4 h-4 text-slate-400" />}
                    {trend} Risk
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Calculated by Tiptide Random Forest Engine from 24h precipitation, slope gradients, and historical landslide density.
                </p>
              </div>
            </div>

            {/* Distance & Approach Vector Warning */}
            <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  PROXIMITY TO HAZARD ZONE
                </span>
                <span className="text-white font-mono font-bold text-sm bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {formattedDistance} away
                </span>
              </div>

              {/* Dynamic Warning Message */}
              <div className="text-sm font-semibold text-white leading-snug">
                {isInsideZone ? (
                  <span className="text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    You are inside the active landslide hazard boundary.
                  </span>
                ) : isApproaching ? (
                  <span className="text-orange-400 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 shrink-0" />
                    You are approaching a high-risk landslide zone ({formattedDistance}).
                  </span>
                ) : (
                  <span className="text-slate-200">
                    Nearest risk zone is {formattedDistance} away ({nearestZone.name}).
                  </span>
                )}
              </div>

              {/* Personalized safety advice using user name if provided */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <span className="font-semibold text-cyan-300">Safety Status: </span>
                  {personalizedText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISUAL PRIORITY: LOCATION DETAILS (Where am I?) */}
      <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                CURRENT USER LOCATION
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                userLocation.permissionStatus === 'granted' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {userLocation.permissionStatus === 'granted' ? 'GPS Active' : 'Manual / Simulated'}
              </span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>{userLocation.locationName}</span>
              <span className="text-xs text-slate-400 font-mono">
                ({userLocation.latitude.toFixed(4)}° N, {userLocation.longitude.toFixed(4)}° E)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRequestLocation}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Switch Location</span>
          </button>
          <button
            onClick={onNavigateToMap}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition-all flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View on GIS Map</span>
          </button>
        </div>
      </section>

      {/* 3. VISUAL PRIORITY: WHY IS RISK CHANGING? (AI EXPLAINABILITY + WEATHER) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weather & Rainfall (3 Indicators) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-heading">
                Weather & Precipitation Telemetry
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Source: IMD Radar
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[11px] text-slate-400 block">Rainfall (1 Hour)</span>
              <span className="text-xl font-black text-white font-mono">
                {nearestZone.rainfall1hMm} <span className="text-xs font-normal text-slate-400">mm</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Short-term cloudburst index</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[11px] text-slate-400 block">Rainfall (24 Hours)</span>
              <span className="text-xl font-black text-white font-mono">
                {nearestZone.rainfall24hMm} <span className="text-xs font-normal text-slate-400">mm</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Critical threshold: 150 mm</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[11px] text-slate-400 block">Rainfall (72 Hours)</span>
              <span className="text-xl font-black text-white font-mono">
                {nearestZone.rainfall72hMm} <span className="text-xs font-normal text-slate-400">mm</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Antecedent saturation level</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[11px] text-slate-400 block">Forecast (Next 12h)</span>
              <span className="text-xl font-black text-white font-mono">
                +{nearestZone.forecastRainfallMm} <span className="text-xs font-normal text-slate-400">mm</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Projected monsoonal surge</span>
            </div>
          </div>

          {nearestZone.officialWarning && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{nearestZone.officialWarning}</span>
            </div>
          )}
        </div>

        {/* AI Risk Explainability Card */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-heading">
                Why Risk Is Changing (AI Explainability)
              </h3>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
              Random Forest Model v2.4
            </span>
          </div>

          <div className="space-y-2.5">
            {nearestZone.explainabilityReasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/70 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-400 font-mono">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              <span className="block text-slate-500 text-[10px]">Slope Angle</span>
              <span className="font-bold text-white text-xs">{nearestZone.slopeAngleDeg}°</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              <span className="block text-slate-500 text-[10px]">Elevation</span>
              <span className="font-bold text-white text-xs">{nearestZone.elevationM} m</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              <span className="block text-slate-500 text-[10px]">Historical Scars</span>
              <span className="font-bold text-white text-xs">{nearestZone.historicalLandslidesCount} events</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. EMERGENCY ASSISTANCE (MANDATED FOR HIGH / CRITICAL) */}
      {(riskLevel === 'high' || riskLevel === 'critical' || safetyStatus.emergencyActionNeeded) && (
        <section className="bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border-2 border-red-600/50 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-900/50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                <PhoneCall className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white font-heading tracking-tight">
                  Emergency Assistance & Official Relief
                </h3>
                <p className="text-xs text-red-300">
                  Priority safety actions for {nearestZone.state} • Official Emergency Contacts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="tel:112"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>CALL 112 ERSS</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <button
              onClick={handleCopyAuthorityReport}
              className="p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-left hover:bg-red-900/50 transition-colors"
            >
              <span className="font-bold text-white block">Prepare GPS risk report</span>
              <span className="text-slate-300 block mt-1">Copy coordinates, risk score, hazard, and time for the responding authority.</span>
            </button>
            <a
              href="tel:1070"
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-colors"
            >
              <span className="font-bold text-cyan-300 block">Call 1070</span>
              <span className="text-slate-300 block mt-1">Relief Commissioner for natural calamities.</span>
            </a>
            <a
              href="https://sachet.ndma.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-colors"
            >
              <span className="font-bold text-cyan-300 flex items-center gap-1">Open NDMA SACHET <ExternalLink className="w-3 h-3" /></span>
              <span className="text-slate-300 block mt-1">Check geo-targeted alerts and official disaster information.</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-400 border-b border-red-900/40 pb-4">
            <span>Official channels:</span>
            <a href="https://ndma.gov.in/" target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-white flex items-center gap-1">NDMA <ExternalLink className="w-3 h-3" /></a>
            <a href={stateErssLink} target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-white flex items-center gap-1">{stateErssLabel} <ExternalLink className="w-3 h-3" /></a>
            <a href="https://www.india.gov.in/directory/helpline" target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-white flex items-center gap-1">India.gov helplines <ExternalLink className="w-3 h-3" /></a>
            <span>Emergency: <a href="tel:112" className="text-white font-bold">112</a> • Relief: <a href="tel:1070" className="text-white font-bold">1070</a> • NDRF: <a href="tel:01124363260" className="text-white font-bold">011-24363260</a></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
            {/* Nearest Verified Emergency Service */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Nearest Verified Emergency Service:
              </span>
              <div className="font-bold text-white text-base">
                {nearestOfficialFacility.name}
              </div>
              <p className="text-slate-300 text-xs">
                Official Contact: <span className="text-cyan-400 font-mono font-bold">{nearestOfficialFacility.officialContact}</span>
              </p>
              <span className="text-[10px] text-slate-500 block">
                Source: {nearestOfficialFacility.officialSource}
              </span>
            </div>

            {/* Nearest Designated Shelter (Rule: If none exists, say "No verified shelter data available nearby.") */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Designated Safe Evacuation Shelter:
              </span>

              {nearestZone.verifiedShelterAvailable && verifiedShelter ? (
                <>
                  <div className="font-bold text-emerald-400 text-base flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{verifiedShelter.name}</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Capacity: {verifiedShelter.capacity || '400+'} persons • Distance: ~{nearestZone.evacuationDistanceKm || '3.2'} km
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={onNavigateToMap}
                      className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>VIEW SAFE LOCATION ON MAP</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 text-xs">
                  <span className="font-semibold text-amber-400 block mb-1">
                    No verified shelter data available nearby.
                  </span>
                  Please contact the State Disaster Control Room ({nearestZone.officialEmergencyContact}) or local District Magistrate for designated gathering points.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5. LATEST OFFICIAL WARNING BULLETIN & CITIZEN EVIDENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Latest Warning Bulletin */}
        <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white font-heading">
                Latest Official Warning
              </h3>
            </div>
            <button
              onClick={onNavigateToAlerts}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>All Bulletins</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {alerts.length > 0 && (
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{alerts[0].title}</span>
                <span className="text-[10px] text-slate-400 font-mono">{alerts[0].timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {alerts[0].description}
              </p>
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800 text-slate-400">
                <span>Issued by: {alerts[0].issuedBy}</span>
                <span className="font-mono text-cyan-400">{alerts[0].source}</span>
              </div>
            </div>
          )}
        </div>

        {/* Citizen Reports & Evidence Snapshot */}
        <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-heading">
                Field Evidence & Citizen Reports
              </h3>
            </div>
            <button
              onClick={onNavigateToReport}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>View / Submit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {recentReports.slice(0, 2).map((rep) => (
              <div key={rep.id} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white uppercase text-[11px]">{rep.reportType.replace('_', ' ')}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    rep.verificationStatus === 'Verified'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : rep.verificationStatus === 'Under review'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {rep.verificationStatus}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] line-clamp-2">
                  {rep.description}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>{rep.locationName}</span>
                  <span>{rep.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Big Report Action Button */}
          <div className="pt-2">
            <button
              onClick={onNavigateToReport}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>REPORT INCIDENT (GEO-TAGGED EVIDENCE)</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
