import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Truck, 
  Radio, 
  MapPin, 
  PhoneCall, 
  Download, 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  Navigation, 
  HeartHandshake, 
  Flame, 
  FileText 
} from 'lucide-react';
import { MonitoringZone, VerifiedEmergencyFacility } from '../types';

interface EmergencyResponseViewProps {
  monitoringZones?: MonitoringZone[];
  facilities?: VerifiedEmergencyFacility[];
  onNavigateToMap?: () => void;
  onClose?: () => void;
}

export const EmergencyResponseView: React.FC<EmergencyResponseViewProps> = ({
  monitoringZones = [],
  facilities = [],
  onNavigateToMap,
  onClose
}) => {
  const [selectedZoneName, setSelectedZoneName] = useState('Dikchu - Singtam Highway Corridor');
  const [selectedState, setSelectedState] = useState('Sikkim');
  const [affectedPopulation, setAffectedPopulation] = useState(650);
  const [roadBlocked, setRoadBlocked] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [deploymentPlan, setDeploymentPlan] = useState<any>({
    missionCodeName: 'OP-SHIELD-SIKKIM-804',
    commandLead: 'NDRF 1st Battalion (Patgaon) & Sikkim SDRF Integrated Task Force',
    evacuationCorridors: [
      { 
        name: 'Singtam Elevated Ridge Bypass Track', 
        status: 'Secured with Police Escort', 
        capacityPerHour: 320, 
        destination: 'Singtam Community Relief Camp (Verified Shelter)' 
      },
      { 
        name: 'Upper Martam Forest Trail (Secondary)', 
        status: 'Pedestrian & Stretcher Evacuation Only', 
        capacityPerHour: 140, 
        destination: 'District Health Center First Aid Post' 
      }
    ],
    rescueTeamsDeployed: [
      { 
        unit: 'NDRF Search & Extrication Squad (QRT)', 
        personnel: 38, 
        equipment: ['Thermal Imaging Life Detectors', 'Heavy Acoustic Sensors', 'Hydraulic Spreading Cutters', 'Inmarsat Satphone'] 
      },
      { 
        unit: 'BRO Project Swastik Highway Clear Taskforce', 
        personnel: 26, 
        equipment: ['2x Caterpillar Track Excavators', '3x Wheel Loaders', 'Hydraulic Rock Breakers'] 
      },
      { 
        unit: 'State Health Department Mobile Trauma Unit', 
        personnel: 14, 
        equipment: ['Portable Oxygen Concentrators', 'Trauma Stabilization Kits', 'Emergency Anti-Venom & Tetanus'] 
      }
    ],
    medicalStagingBases: [
      'Singtam Sub-Divisional Hospital (Triage Zone A)',
      'STNM Multi-Specialty Hospital Emergency Trauma Center Gangtok'
    ],
    helicopterEvacuationLZ: { 
      coordinates: '27.234° N, 88.512° E (Singtam Football Ground)', 
      suitability: 'IAF ALH Dhruv & MI-17 V5 Certified Flat Meadow (Daylight VFR Cleared)' 
    },
    essentialDirectives: [
      'Enforce 600-meter strict exclusion perimeter around the crown tension fissure zone.',
      'Deploy continuous drone thermal scanning every 45 minutes to monitor secondary toe collapse.',
      'Broadcast automated local-language evacuation sirens (Nepali/Bhutia/English) across Singtam ward.'
    ]
  });

  const [sirenActive, setSirenActive] = useState(false);
  const [smsDispatched, setSmsDispatched] = useState(false);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const response = await fetch('/api/ai/simulate-deployment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoneName: selectedZoneName,
          state: selectedState,
          riskLevel: 'Critical',
          affectedCount: affectedPopulation,
          roadBlocked
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDeploymentPlan(data);
      }
    } catch (err) {
      console.warn('Deployment simulation fallback to default state:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleTriggerSiren = () => {
    setSirenActive(prev => !prev);
  };

  const handleDispatchSms = () => {
    setSmsDispatched(true);
    setTimeout(() => setSmsDispatched(false), 3500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>DISASTER RESPONSE COMMAND & EVACUATION DISPATCH</span>
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
          NDRF & SDRF Rapid Deployment Strategy Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
          Automated disaster incident command center for coordinating multi-agency search, rescue, medical triage, 
          and evacuation corridors across rugged North Eastern mountain sectors.
        </p>
      </div>

      {/* Control & Parameters Row */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white font-heading flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          Incident Parameters & AI Tactical Simulator
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Target Hazard Sector</label>
            <select
              value={selectedZoneName}
              onChange={(e) => {
                setSelectedZoneName(e.target.value);
                if (e.target.value.includes('Assam')) setSelectedState('Assam');
                else if (e.target.value.includes('Arunachal')) setSelectedState('Arunachal Pradesh');
                else if (e.target.value.includes('Meghalaya')) setSelectedState('Meghalaya');
                else setSelectedState('Sikkim');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            >
              <option value="Dikchu - Singtam Highway Corridor">Dikchu - Singtam Corridor (Sikkim)</option>
              <option value="Dima Hasao Jatinga Slope Chute">Jatinga Valley (Assam)</option>
              <option value="Tawang Sela Pass Transit Corridor">Sela Pass Sector (Arunachal Pradesh)</option>
              <option value="Nongstoin-Shillong Escarpment Zone">Nongstoin Escarpment (Meghalaya)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Estimated At-Risk Population</label>
            <input
              type="number"
              value={affectedPopulation}
              onChange={(e) => setAffectedPopulation(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              min={50}
              max={15000}
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Primary Highway Status</label>
            <select
              value={roadBlocked ? 'blocked' : 'open'}
              onChange={(e) => setRoadBlocked(e.target.value === 'blocked')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            >
              <option value="blocked">Blocked by active debris slide</option>
              <option value="open">Partially passable with escort</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-md shadow-cyan-600/20"
            >
              {isSimulating ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Strategy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recalculate Tactics</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tactical Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                TACTICAL CODE:
              </span>
              <span className="text-lg font-black text-white font-mono">
                {deploymentPlan.missionCodeName}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Command Lead: <strong className="text-slate-200">{deploymentPlan.commandLead}</strong>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerSiren}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                sirenActive
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{sirenActive ? 'Siren Sounding (Active)' : 'Sound Field Sirens'}</span>
            </button>

            <button
              onClick={handleDispatchSms}
              disabled={smsDispatched}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-75 shadow-md shadow-emerald-600/20"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{smsDispatched ? 'SMS Broadcast Sent!' : 'Push Cell Broadcast'}</span>
            </button>
          </div>
        </div>

        {/* Operational Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Column 1: Evacuation Corridors */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              Evacuation Corridors
            </h3>
            
            <div className="space-y-2">
              {deploymentPlan.evacuationCorridors?.map((corridor: any, idx: number) => (
                <div key={idx} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{corridor.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                      {corridor.capacityPerHour} evac/hr
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>{corridor.status}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    To: {corridor.destination}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Deployed Rescue Units */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Rescue & Clearing Squads
            </h3>

            <div className="space-y-2">
              {deploymentPlan.rescueTeamsDeployed?.map((team: any, idx: number) => (
                <div key={idx} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{team.unit}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {team.personnel} personnel
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {team.equipment?.map((eq: string, i: number) => (
                      <span key={i} className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Helicopter LZ & Medical Bases */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
              Airlift & Triage Staging
            </h3>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Helicopter Landing Zone (LZ)</span>
                <span className="text-xs font-bold text-white block">
                  {deploymentPlan.helicopterEvacuationLZ?.coordinates}
                </span>
                <span className="text-[11px] text-emerald-400 block mt-0.5">
                  {deploymentPlan.helicopterEvacuationLZ?.suitability}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Designated Triage Bases</span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {deploymentPlan.medicalStagingBases?.map((base: string, i: number) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{base}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* Essential Directives */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Field Operational Directives
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            {deploymentPlan.essentialDirectives?.map((directive: string, idx: number) => (
              <li key={idx} className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed">
                <span className="text-amber-400 font-bold mr-1.5">#{idx + 1}</span>
                {directive}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};
