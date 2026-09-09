import React from 'react';
import { 
  ShieldCheck, 
  BrainCircuit, 
  Layers, 
  Radio, 
  MapPin, 
  Compass, 
  Award, 
  Cpu, 
  Activity, 
  ArrowRight,
  ExternalLink,
  Users,
  CheckCircle2
} from 'lucide-react';
import { NER_STATES } from './data/nerData.ts';

export const AboutSystemView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>SMART INDIA HACKATHON 2026 DISASTER RESILIENCE INNOVATION</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading leading-tight">
            NER LandslideGuard: AI-Driven Geo-Early Warning for North Eastern India
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            The North Eastern Region (NER) of India accounts for more than 50% of the country’s catastrophic landslides, triggered by intense monsoonal cloudbursts, steep young fold Himalayan geology, and seismic fault lines. 
            <strong> NER LandslideGuard</strong> bridges deep geotechnical physics with Google Gemini AI to deliver automated early warnings, dual-route safe navigation, and verified safe havens before slope failure occurs.
          </p>
        </div>
      </div>

      {/* 4-Pillar System Architecture */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Four-Tier Geotechnical AI Architecture</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              01
            </div>
            <h4 className="text-sm font-bold text-white font-heading">IoT Sensor Telemetry</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time In-situ MEMS inclinometers, TDR soil moisture saturation probes, and vibrating wire piezometers streaming over LoRaWAN and 4G.
            </p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              02
            </div>
            <h4 className="text-sm font-bold text-white font-heading">IMD & GSI GIS Ingestion</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-resolution Doppler weather radar precipitation grids, digital elevation models (DEM), and Geological Survey of India lithology maps.
            </p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              03
            </div>
            <h4 className="text-sm font-bold text-white font-heading">Gemini 3.7 Flash AI Model</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Combines Mohr-Coulomb shear strength degradation with deep generative intelligence to predict Factor of Safety (FoS) and time-to-failure.
            </p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              04
            </div>
            <h4 className="text-sm font-bold text-white font-heading">Dissemination & Safe Stays</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Common Alerting Protocol (CAP) SMS sirens, dual-route safest navigation algorithms, and verified bedrock-certified safe accommodations.
            </p>
          </div>

        </div>
      </div>

      {/* 8 NER States Coverage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white font-heading">
          Territorial Coverage Across 8 North Eastern States
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {NER_STATES.filter(s => s !== 'All States').map((stateName) => (
            <div key={stateName} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200">{stateName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Standards & Compliance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-1">
          <span className="text-cyan-400 font-bold block">NDMA Guidelines Compliant</span>
          <p className="text-slate-400">Adheres to National Disaster Management Authority Landslide Mitigation Framework 2024–2026.</p>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-1">
          <span className="text-emerald-400 font-bold block">ITU / WMO CAP XML Standard</span>
          <p className="text-slate-400">Feeds formatted for international Common Alerting Protocol cross-platform distribution.</p>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-1">
          <span className="text-amber-400 font-bold block">Smart India Hackathon 2026</span>
          <p className="text-slate-400">Developed for ministry & disaster cell implementation across North East mountain corridors.</p>
        </div>
      </div>

    </div>
  );
};
