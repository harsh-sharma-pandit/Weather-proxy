import React, { useState } from 'react';
import { 
  FileText, 
  MapPin, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  WifiOff, 
  Send,
  Eye,
  Filter,
  Layers
} from 'lucide-react';
import { CitizenReport, CitizenReportType, UserLocationState } from '../types';

interface CitizenReportViewProps {
  reports: CitizenReport[];
  userLocation: UserLocationState;
  isOnline: boolean;
  localUserName?: string;
  onSubmitReport: (newReport: CitizenReport) => void;
}

export const CitizenReportView: React.FC<CitizenReportViewProps> = ({
  reports,
  userLocation,
  isOnline,
  localUserName = '',
  onSubmitReport
}) => {
  const [reportType, setReportType] = useState<CitizenReportType>('landslide');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState(userLocation.locationName);
  const [useCurrentGps, setUseCurrentGps] = useState(true);
  const [customLat, setCustomLat] = useState(userLocation.latitude.toString());
  const [customLng, setCustomLng] = useState(userLocation.longitude.toString());
  const [reporterName, setReporterName] = useState(localUserName || '');
  const [hasMedia, setHasMedia] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  const reportTypesList: { id: CitizenReportType; label: string; desc: string }[] = [
    { id: 'landslide', label: 'Landslide', desc: 'Active slope failure or debris flow on ground/road' },
    { id: 'road_blockage', label: 'Road Blockage', desc: 'Debris, mud, or rock boulders blocking transit' },
    { id: 'ground_cracks', label: 'Ground Cracks', desc: 'New tensile fissures or slope displacement cracks' },
    { id: 'fallen_rocks', label: 'Fallen Rocks', desc: 'Scree or rockfall on highway carriage' },
    { id: 'water_overflow', label: 'Water Overflow', desc: 'Drainage blockage causing slope erosion' },
    { id: 'dangerous_slope', label: 'Dangerous Slope', desc: 'Bulging retaining wall or imminent cut failure' }
  ];

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHasMedia(true);
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        setMediaPreview(loadEvt.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachDemoPhoto = () => {
    setHasMedia(true);
    // Standard representative photo for demo testing
    setMediaPreview('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const lat = useCurrentGps ? userLocation.latitude : parseFloat(customLat) || userLocation.latitude;
    const lng = useCurrentGps ? userLocation.longitude : parseFloat(customLng) || userLocation.longitude;

    const newReport: CitizenReport = {
      id: `rep-${Date.now()}`,
      reportType,
      description: description.trim(),
      latitude: lat,
      longitude: lng,
      locationName: locationName.trim() || userLocation.locationName,
      state: userLocation.state,
      timestamp: 'Just now',
      mediaUrl: mediaPreview || undefined,
      verificationStatus: 'Unverified', // Master rule: New reports start as Unverified
      syncStatus: isOnline ? 'synced' : 'pending_sync',
      reportedByName: reporterName.trim() || 'Local Citizen',
      isDemoSynthetic: false
    };

    onSubmitReport(newReport);
    setDescription('');
    setHasMedia(false);
    setMediaPreview(null);

    setSubmitSuccessMsg(
      isOnline
        ? 'Report submitted successfully! Status: Unverified (awaiting authority review).'
        : 'Offline mode: Report saved locally in IndexedDB queue (Pending sync). It will automatically upload when network reconnects.'
    );

    setTimeout(() => {
      setSubmitSuccessMsg(null);
    }, 6000);
  };

  const filteredReports = reports.filter(r => {
    if (filterType === 'all') return true;
    return r.reportType === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>CITIZEN FIELD EVIDENCE PLATFORM</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
          Report Landslide & Road Hazards
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Submit geo-tagged field observations to help local disaster response authorities and the community. 
          All incoming citizen reports start with <span className="text-amber-400 font-semibold font-mono">Unverified</span> status 
          until confirmed by GSI, SDRF, or Border Roads teams.
        </p>
      </div>

      {submitSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{submitSuccessMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Submission Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>Submit Field Incident Report</span>
              </h2>
              {!isOnline && (
                <span className="flex items-center gap-1 text-[11px] text-amber-400 font-mono bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  <WifiOff className="w-3 h-3" />
                  Offline Queue
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Report Type Selector */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Hazard / Incident Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {reportTypesList.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setReportType(type.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        reportType === type.id
                          ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">{type.label}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Detailed Observation <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe location details, debris volume, road blockage extent, cracks, or active movement..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Location selection */}
              <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    Geo-Tag Location:
                  </span>
                  <button
                    type="button"
                    onClick={() => setUseCurrentGps(!useCurrentGps)}
                    className="text-cyan-400 hover:underline text-[11px]"
                  >
                    {useCurrentGps ? 'Enter Custom Coords' : 'Use Current GPS'}
                  </button>
                </div>

                {useCurrentGps ? (
                  <div className="text-[11px] text-slate-400 font-mono">
                    📍 {userLocation.locationName} ({userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)})
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Latitude"
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      className="bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs font-mono text-white"
                    />
                    <input
                      type="text"
                      placeholder="Longitude"
                      value={customLng}
                      onChange={(e) => setCustomLng(e.target.value)}
                      className="bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs font-mono text-white"
                    />
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Location landmark or highway mile marker"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs text-white"
                />
              </div>

              {/* Photo / Media attachment */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Attach Photo / Visual Evidence (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2 transition-colors">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMediaSelect}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleAttachDemoPhoto}
                    className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-cyan-400 transition-colors"
                  >
                    + Sample Evidence
                  </button>
                </div>

                {mediaPreview && (
                  <div className="mt-2 relative rounded-xl overflow-hidden border border-slate-800 h-28 w-full bg-black">
                    <img
                      src={mediaPreview}
                      alt="Hazard preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => { setMediaPreview(null); setHasMedia(false); }}
                      className="absolute top-2 right-2 bg-slate-950/80 text-white p-1 rounded-md text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Submitter Name (Optional, local storage display name) */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Your Name (Optional, no account required)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tenzing / Local traveler"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isOnline ? 'Submit Incident Report' : 'Save to Offline Queue'}
                  </span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed text-center">
                Master Rule: Submissions are logged as Unverified until verified by official responders.
              </p>
            </form>
          </div>
        </div>

        {/* Right Col: Feed of Citizen Reports */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white font-heading">
                Recent Community Field Reports ({filteredReports.length})
              </h2>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="landslide">Landslides</option>
                <option value="road_blockage">Road Blockages</option>
                <option value="ground_cracks">Ground Cracks</option>
                <option value="fallen_rocks">Fallen Rocks</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredReports.map((rep) => {
              const isUnverified = rep.verificationStatus === 'Unverified';
              const isVerified = rep.verificationStatus === 'Verified';
              const isPendingSync = rep.syncStatus === 'pending_sync';

              return (
                <div 
                  key={rep.id} 
                  className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3 transition-all hover:border-slate-700"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm uppercase">
                        {rep.reportType.replace('_', ' ')}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {rep.locationName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPendingSync && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Pending Sync
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isVerified
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : rep.verificationStatus === 'Under review'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {rep.verificationStatus}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {rep.description}
                  </p>

                  {rep.mediaUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 max-h-48 w-full sm:w-72 bg-black">
                      <img
                        src={rep.mediaUrl}
                        alt="Hazard evidence"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/70">
                    <div className="flex items-center gap-3">
                      <span>Reported by: <span className="text-slate-300 font-semibold">{rep.reportedByName}</span></span>
                      <span>•</span>
                      <span className="font-mono">({rep.latitude.toFixed(3)}, {rep.longitude.toFixed(3)})</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{rep.timestamp}</span>
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
