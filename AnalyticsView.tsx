import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Calendar, 
  CloudRain, 
  MapPin, 
  Layers, 
  ShieldAlert, 
  Activity, 
  Download,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const MONTHLY_TREND_DATA = [
  { month: 'Jan', rainfallMm: 22, landslideIncidents: 1, alertsIssued: 2 },
  { month: 'Feb', rainfallMm: 35, landslideIncidents: 2, alertsIssued: 3 },
  { month: 'Mar', rainfallMm: 68, landslideIncidents: 4, alertsIssued: 6 },
  { month: 'Apr', rainfallMm: 145, landslideIncidents: 9, alertsIssued: 14 },
  { month: 'May', rainfallMm: 280, landslideIncidents: 22, alertsIssued: 31 },
  { month: 'Jun', rainfallMm: 490, landslideIncidents: 58, alertsIssued: 74 },
  { month: 'Jul', rainfallMm: 560, landslideIncidents: 72, alertsIssued: 89 },
  { month: 'Aug', rainfallMm: 510, landslideIncidents: 64, alertsIssued: 80 },
  { month: 'Sep', rainfallMm: 390, landslideIncidents: 41, alertsIssued: 52 },
  { month: 'Oct', rainfallMm: 180, landslideIncidents: 12, alertsIssued: 19 },
  { month: 'Nov', rainfallMm: 45, landslideIncidents: 3, alertsIssued: 5 },
  { month: 'Dec', rainfallMm: 18, landslideIncidents: 1, alertsIssued: 2 }
];

const STATE_HAZARD_DISTRIBUTION = [
  { state: 'Sikkim', criticalCount: 14, highCount: 28, totalKmMonitored: 420 },
  { state: 'Assam (Dima Hasao)', criticalCount: 18, highCount: 34, totalKmMonitored: 580 },
  { state: 'Arunachal Pradesh', criticalCount: 12, highCount: 42, totalKmMonitored: 890 },
  { state: 'Meghalaya', criticalCount: 9, highCount: 22, totalKmMonitored: 360 },
  { state: 'Manipur', criticalCount: 15, highCount: 26, totalKmMonitored: 490 },
  { state: 'Mizoram', criticalCount: 11, highCount: 24, totalKmMonitored: 410 },
  { state: 'Nagaland', criticalCount: 8, highCount: 19, totalKmMonitored: 330 },
  { state: 'Tripura', criticalCount: 3, highCount: 8, totalKmMonitored: 180 }
];

const FAILURE_MECHANISM_DATA = [
  { name: 'Rapid Debris Flow', value: 46, color: '#f43f5e' },
  { name: 'Rotational Soil Slump', value: 24, color: '#f59e0b' },
  { name: 'Planar Rockslide', value: 18, color: '#06b6d4' },
  { name: 'Deep Colluvium Creep', value: 12, color: '#10b981' }
];

export const AnalyticsView: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [selectedYear, setSelectedYear] = useState('2025-2026 Monsoon Cycle');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <BarChart2 className="w-4 h-4" />
            <span>GEOTECHNICAL & CLIMATE RISK ANALYTICS</span>
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
          North Eastern Region Landslide Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
          Multi-year correlation analysis between monsoonal cloudburst intensity, soil pore-water saturation thresholds, 
          and slope collapse frequencies across Himalayan and Indo-Burma tectonic belts.
        </p>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-mono text-slate-500 block">Monitored Highway Km</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">3,660 km</span>
          <span className="text-[11px] text-cyan-400 mt-0.5 block">Trans-Himalayan Corridors</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-mono text-slate-500 block">Identified High-Risk Slopes</span>
          <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">287 Sites</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">8 NER States Surveyed</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-mono text-slate-500 block">Early Warning Accuracy</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">89.4%</span>
          <span className="text-[11px] text-emerald-400/80 mt-0.5 block">False Alarm Rate: 8.6%</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-mono text-slate-500 block">Average Warning Lead-Time</span>
          <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">18.5 Hours</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Pre-failure Alert Trigger</span>
        </div>
      </div>

      {/* Chart 1: Monthly Rainfall vs Incidents */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white font-heading">
              Monsoonal Rainfall Volume vs. Landslide Frequency
            </h2>
            <p className="text-xs text-slate-400">
              Correlating cumulative monthly precipitation (mm) with verified slope failures
            </p>
          </div>
          <span className="text-xs text-cyan-400 font-mono font-semibold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
            Peak Risk: June - August
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="landslideIncidents" name="Slope Incidents" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="rainfallMm" name="Avg Rainfall (mm)" stroke="#06b6d4" strokeWidth={2.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: State Distribution & Failure Mechanisms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart 2: State-by-State Critical vs High Zones */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white font-heading">
            Hazard Zone Counts Across the 8 North Eastern States
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STATE_HAZARD_DISTRIBUTION} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey="state" type="category" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: 8, fontSize: 11 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="criticalCount" name="Critical Red Zones" fill="#f43f5e" stackId="a" />
                <Bar dataKey="highCount" name="High Risk Zones" fill="#f59e0b" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Failure Mechanism Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white font-heading">
            Geomorphological Failure Mechanism Share
          </h2>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={FAILURE_MECHANISM_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value}%)`}
                  labelLine={false}
                >
                  {FAILURE_MECHANISM_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: 8, fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
