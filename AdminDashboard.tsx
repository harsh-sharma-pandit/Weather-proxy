import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Radio, 
  Download, 
  Send, 
  Users, 
  FileText, 
  BellRing, 
  Eye, 
  MapPin 
} from 'lucide-react';
import { MonitoringZone, EarlyWarningAlert, CitizenReport } from '../types';

interface AdminDashboardProps {
  monitoringZones?: MonitoringZone[];
  alerts?: EarlyWarningAlert[];
  citizenReports?: CitizenReport[];
  onUpdateReportStatus?: (reportId: string, newStatus: 'Verified' | 'Rejected') => void;
  onIssueNewAlert?: (alert: EarlyWarningAlert) => void;
  onClose?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  monitoringZones = [],
  alerts = [],
  citizenReports = [],
  onUpdateReportStatus,
  onIssueNewAlert,
  onClose
}) => {
  const [reportsList, setReportsList] = useState<CitizenReport[]>(citizenReports);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertLocation, setAlertLocation] = useState('NH-10 Gangtok-Siliguri Corridor');
  const [alertSeverity, setAlertSeverity] = useState<'critical' | 'high' | 'moderate'>('high');
  const [alertAction, setAlertAction] = useState('Immediate traffic halt and slope clearance');
  const [issuedSuccess, setIssuedSuccess] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);

  const handleVerify = (id: string) => {
    setReportsList(prev => prev.map(r => r.id === id ? { ...r, verificationStatus: 'Verified' } : r));
    if (onUpdateReportStatus) onUpdateReportStatus(id, 'Verified');
  };

  const handleReject = (id: string) => {
    setReportsList(prev => prev.map(r => r.id === id ? { ...r, verificationStatus: 'Rejected' } : r));
    if (onUpdateReportStatus) onUpdateReportStatus(id, 'Rejected');
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim()) return;

    const newAlert: EarlyWarningAlert = {
      id: `alert-${Date.now()}`,
      title: alertTitle,
      severity: alertSeverity,
      description: `Official administrative directive issued by SDMA Incident Command for ${alertLocation}.`,
      location: alertLocation,
      district: 'East Sikkim',
      state: 'Sikkim',
      timestamp: 'Just now',
      recommendedAction: alertAction,
      issuedBy: 'NER Disaster Incident Command Cell',
      source: 'Tiptide AI Engine'
    };

    if (onIssueNewAlert) onIssueNewAlert(newAlert);
    setIssuedSuccess(true);
    setAlertTitle('');
    setTimeout(() => setIssuedSuccess(false), 3000);
  };

  const handleExportSitrep = () => {
    const sitrepData = {
      reportType: 'OFFICIAL INCIDENT SITREP • NORTH EASTERN REGION',
      date: new Date().toISOString(),
      activeZonesCount: monitoringZones.length,
      activeAlertsCount: alerts.length,
      citizenReportsCount: reportsList.length,
      unverifiedReportsCount: reportsList.filter(r => r.verificationStatus === 'Unverified').length,
      preparedBy: 'State Disaster Management Authority Incident Room'
    };

    const blob = new Blob([JSON.stringify(sitrepData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SITREP_NER_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pendingReports = reportsList.filter(r => r.verificationStatus === 'Unverified' || r.verificationStatus === 'Under review');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>INCIDENT COMMAND & SDMA ADMINISTRATIVE CONTROL</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800"
            >
              Close
            </button>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
          Disaster Management Authority Mission Control
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
          Authorized console for District Disaster Management Authorities (DDMA) and State Control Rooms to review citizen hazard ground-truthing, 
          broadcast official early warning bulletins, and export verified Situation Reports (SITREPs).
        </p>
      </div>

      {/* Top Operations Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSirenActive(!sirenActive)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              sirenActive
                ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span>{sirenActive ? 'Emergency Siren ACTIVE (Broadcast)' : 'Activate Multi-Sector Siren'}</span>
          </button>

          <button
            onClick={handleExportSitrep}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Official SITREP</span>
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Pending Field Verification: <strong className="text-amber-400">{pendingReports.length}</strong> reports
        </div>
      </div>

      {/* Grid: Broadcast Bulletin Form & Citizen Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 1: Broadcast Official Bulletin */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white font-heading flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            Issue Early Warning Bulletin (CAP / NDMA Protocol)
          </h2>

          <form onSubmit={handleCreateAlert} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Bulletin Title</label>
              <input
                type="text"
                placeholder="e.g. Flash Debris Flow Warning - Severe Infiltration"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Severity Level</label>
                <select
                  value={alertSeverity}
                  onChange={(e: any) => setAlertSeverity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="critical">Critical (Red Alert)</option>
                  <option value="high">High (Orange Alert)</option>
                  <option value="moderate">Moderate (Yellow Advisory)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Sector</label>
                <input
                  type="text"
                  value={alertLocation}
                  onChange={(e) => setAlertLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Mandatory Directive / Action</label>
              <textarea
                value={alertAction}
                onChange={(e) => setAlertAction(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {issuedSuccess && (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Broadcast pushed to all connected field terminals!
                </span>
              )}
              <button
                type="submit"
                className="ml-auto flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-md shadow-rose-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Alert</span>
              </button>
            </div>
          </form>
        </div>

        {/* Module 2: Review Citizen Incident Reports */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Citizen Incident Verification Queue
            </h2>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
              Standard: Unverified by Default
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {reportsList.slice(0, 6).map((report) => {
              const isVerified = report.verificationStatus === 'Verified';
              const isRejected = report.verificationStatus === 'Rejected';

              return (
                <div 
                  key={report.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {report.locationName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                      isVerified
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isRejected
                        ? 'bg-slate-800 text-slate-500'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {report.verificationStatus}
                    </span>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {report.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                    <span>Reported by: <strong className="text-slate-400">{report.reportedByName}</strong></span>
                    
                    <div className="flex items-center gap-2">
                      {!isVerified && !isRejected && (
                        <>
                          <button
                            onClick={() => handleVerify(report.id)}
                            className="flex items-center gap-1 px-2 py-0.5 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded font-bold"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Verify
                          </button>
                          <button
                            onClick={() => handleReject(report.id)}
                            className="flex items-center gap-1 px-2 py-0.5 bg-rose-900/60 hover:bg-rose-900 text-rose-300 rounded"
                          >
                            <XCircle className="w-2.5 h-2.5" />
                            Reject
                          </button>
                        </>
                      )}
                      {isVerified && (
                        <span className="text-emerald-400 font-medium">Verified by Disaster Desk</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
