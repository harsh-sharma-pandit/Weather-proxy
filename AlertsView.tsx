import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Radio, 
  Volume2, 
  VolumeX, 
  Download, 
  Share2, 
  Filter, 
  Clock, 
  MapPin, 
  CheckCircle, 
  ExternalLink,
  ChevronRight,
  Send,
  Building2,
  PhoneCall,
  Bell
} from 'lucide-react';
import { EarlyWarningAlert, RiskSeverity } from '../types';
import { NER_STATES } from './data/nerData.ts';

interface AlertsViewProps {
  alerts: EarlyWarningAlert[];
  onSelectZoneByName?: (zoneName: string) => void;
  onNavigateToEmergency?: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onSelectZoneByName,
  onNavigateToEmergency
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [isPlayingSiren, setIsPlayingSiren] = useState(false);
  const [copiedAlertId, setCopiedAlertId] = useState<string | null>(null);

  const filteredAlerts = alerts.filter(a => {
    const matchSev = selectedSeverity === 'all' || a.severity === selectedSeverity;
    const matchState = selectedState === 'All States' || a.state === selectedState;
    return matchSev && matchState;
  });

  const handleToggleSiren = () => {
    setIsPlayingSiren(prev => !prev);
  };

  const handleShareAlert = (alert: EarlyWarningAlert) => {
    const text = `🚨 *NER LANDSLIDEGUARD EMERGENCY ALERT* 🚨\nLocation: ${alert.location}, ${alert.state}\nSeverity: ${alert.severity.toUpperCase()}\nDanger: ${alert.description}\nEvacuate to: ${alert.evacuationShelter}\nIssued by: ${alert.issuedBy}`;
    navigator.clipboard.writeText(text);
    setCopiedAlertId(alert.id);
    setTimeout(() => setCopiedAlertId(null), 2500);
  };

  const handleExportSitrep = () => {
    const sitrep = `=====================================================
NER LANDSLIDEGUARD - SITUATION REPORT (SITREP)
ISSUED: ${new Date().toUTCString()}
SOURCE: NDMA / SDMA / GSI / IMD Doppler Network
=====================================================
ACTIVE WARNING COUNT: ${filteredAlerts.length}

${filteredAlerts.map(a => `
[${a.severity.toUpperCase()}] ${a.title}
Location: ${a.location}, ${a.state} (${a.district})
Trigger: ${a.triggeringCondition}
Evacuate To: ${a.evacuationShelter} (Safe Haven)
Action Required: ${a.recommendedAction}
Issued By: ${a.issuedBy} (${a.timestamp})
-----------------------------------------------------`).join('\n')}
`;
    const blob = new Blob([sitrep], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NER-LandslideGuard-SITREP-${Date.now()}.txt`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header with Broadcast Siren Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-5 h-5 text-red-400 animate-pulse" />
            <h2 className="text-xl font-bold text-white font-heading">
              Active Landslide Early Warning Bulletins & CAP Feeds
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Multi-agency early warnings verified by IMD, GSI, and State Disaster Management Authorities (SDMA)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Audio Siren Simulation */}
          <button
            id="btn-toggle-siren"
            onClick={handleToggleSiren}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isPlayingSiren
                ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {isPlayingSiren ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{isPlayingSiren ? 'Emergency Siren Active (Mute)' : 'Test Evacuation Siren'}</span>
          </button>

          {/* Export SITREP */}
          <button
            id="btn-export-sitrep"
            onClick={handleExportSitrep}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Official SITREP</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filter State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-950 text-white px-2.5 py-1 rounded-lg border border-slate-800 focus:outline-none"
            >
              {NER_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-slate-950 text-white px-2.5 py-1 rounded-lg border border-slate-800 focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">🔴 Critical Risk Only</option>
              <option value="high">🟠 High Risk Only</option>
              <option value="moderate">🟡 Moderate Risk Only</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing {filteredAlerts.length} Active Early Warnings
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'critical';
          const isHigh = alert.severity === 'high';

          return (
            <div
              key={alert.id}
              id={`alert-card-${alert.id}`}
              className={`p-5 rounded-2xl border transition-all ${
                isCritical
                  ? 'bg-red-950/20 border-red-500/50 shadow-xl shadow-red-950/20'
                  : isHigh
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-xl shadow-amber-950/20'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`p-2 rounded-xl ${
                    isCritical ? 'bg-red-500/20 text-red-400 animate-pulse' :
                    isHigh ? 'bg-amber-500/20 text-amber-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    <ShieldAlert className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">{alert.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isCritical ? 'bg-red-500 text-white' :
                        isHigh ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'bg-yellow-500/30 text-yellow-300'
                      }`}>
                        {alert.severity} Risk Warning
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white font-heading mt-0.5">
                      {alert.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Issued: {alert.timestamp} (Expires: {alert.expiresAt})</span>
                </div>
              </div>

              {/* Description & Triggers */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {alert.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs">
                    <span className="text-amber-400 font-bold block mb-1">⚡ Triggering Geotechnical Conditions:</span>
                    <span className="text-slate-300 font-mono">{alert.triggeringCondition}</span>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs">
                    <span className="text-emerald-400 font-bold block mb-1">🛡️ Designated Safe Evacuation Shelter:</span>
                    <span className="text-slate-300">{alert.evacuationShelter}</span>
                  </div>
                </div>

                {/* Recommended Citizen & Authority Action */}
                <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs space-y-1">
                  <span className="text-cyan-300 font-bold uppercase tracking-wider text-[10px] block font-mono">
                    Mandatory Disaster Management Directive:
                  </span>
                  <p className="text-slate-200">{alert.recommendedAction}</p>
                </div>
              </div>

              {/* Bottom Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-3 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>Source Authority: <strong className="text-white">{alert.issuedBy}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShareAlert(alert)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{copiedAlertId === alert.id ? 'Copied to Clipboard!' : 'Share SMS Alert'}</span>
                  </button>

                  <button
                    onClick={onNavigateToEmergency}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg text-xs font-semibold shadow transition-all flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Evacuation Staging & Contacts</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
