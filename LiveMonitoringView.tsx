import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Radio, 
  Wifi, 
  BatteryCharging, 
  Droplets, 
  Gauge, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  MapPin, 
  RotateCw,
  Eye
} from 'lucide-react';
import { MonitoringZone } from '../types';

interface LiveMonitoringViewProps {
  monitoringZones?: MonitoringZone[];
  onSelectZone?: (zone: MonitoringZone) => void;
  onClose?: () => void;
}

interface TelemetryPoint {
  id: string;
  zoneName: string;
  state: string;
  poreWaterPressureKpa: number;
  displacementMm: number;
  rainfallRateMmH: number;
  soilMoisturePct: number;
  vibrationGal: number;
  batteryPct: number;
  signalStrengthDbm: number;
  status: 'Normal' | 'Advisory' | 'Critical';
  lastPing: string;
}

export const LiveMonitoringView: React.FC<LiveMonitoringViewProps> = ({
  monitoringZones = [],
  onSelectZone,
  onClose
}) => {
  const [selectedStateFilter, setSelectedStateFilter] = useState('All');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');

  // Simulated live telemetry stream state
  const [telemetryNodes, setTelemetryNodes] = useState<TelemetryPoint[]>([
    {
      id: 'NODE-SK-01',
      zoneName: 'Dikchu - Singtam Ridge',
      state: 'Sikkim',
      poreWaterPressureKpa: 46.8,
      displacementMm: 14.2,
      rainfallRateMmH: 18.5,
      soilMoisturePct: 88,
      vibrationGal: 4.2,
      batteryPct: 92,
      signalStrengthDbm: -72,
      status: 'Critical',
      lastPing: '2s ago'
    },
    {
      id: 'NODE-AS-02',
      zoneName: 'Jatinga Valley Chute',
      state: 'Assam',
      poreWaterPressureKpa: 39.4,
      displacementMm: 9.6,
      rainfallRateMmH: 14.0,
      soilMoisturePct: 82,
      vibrationGal: 2.8,
      batteryPct: 87,
      signalStrengthDbm: -68,
      status: 'Critical',
      lastPing: '5s ago'
    },
    {
      id: 'NODE-AR-03',
      zoneName: 'Sela Pass Transit Sector',
      state: 'Arunachal Pradesh',
      poreWaterPressureKpa: 28.1,
      displacementMm: 5.1,
      rainfallRateMmH: 8.2,
      soilMoisturePct: 68,
      vibrationGal: 1.4,
      batteryPct: 96,
      signalStrengthDbm: -84,
      status: 'Advisory',
      lastPing: '12s ago'
    },
    {
      id: 'NODE-ML-04',
      zoneName: 'Nongstoin Escarpment',
      state: 'Meghalaya',
      poreWaterPressureKpa: 31.5,
      displacementMm: 6.8,
      rainfallRateMmH: 11.0,
      soilMoisturePct: 74,
      vibrationGal: 1.9,
      batteryPct: 81,
      signalStrengthDbm: -76,
      status: 'Advisory',
      lastPing: '8s ago'
    },
    {
      id: 'NODE-MN-05',
      zoneName: 'NH-37 Noney - Tupul Railway Cut',
      state: 'Manipur',
      poreWaterPressureKpa: 42.0,
      displacementMm: 11.4,
      rainfallRateMmH: 16.2,
      soilMoisturePct: 85,
      vibrationGal: 3.5,
      batteryPct: 78,
      signalStrengthDbm: -79,
      status: 'Critical',
      lastPing: '3s ago'
    },
    {
      id: 'NODE-MZ-06',
      zoneName: 'Laipuitlang Hill Slope',
      state: 'Mizoram',
      poreWaterPressureKpa: 21.0,
      displacementMm: 2.2,
      rainfallRateMmH: 4.5,
      soilMoisturePct: 58,
      vibrationGal: 0.8,
      batteryPct: 94,
      signalStrengthDbm: -71,
      status: 'Normal',
      lastPing: '15s ago'
    }
  ]);

  // Jitter simulation for live feel
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setTelemetryNodes(prev => prev.map(node => {
        const deltaPress = (Math.random() - 0.5) * 0.4;
        const deltaDisp = (Math.random() - 0.48) * 0.05;
        const newPress = Math.max(10, Number((node.poreWaterPressureKpa + deltaPress).toFixed(1)));
        const newDisp = Math.max(0, Number((node.displacementMm + Math.max(0, deltaDisp)).toFixed(2)));
        return {
          ...node,
          poreWaterPressureKpa: newPress,
          displacementMm: newDisp,
          lastPing: '1s ago'
        };
      }));
      setLastRefreshed(new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 4000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredNodes = selectedStateFilter === 'All'
    ? telemetryNodes
    : telemetryNodes.filter(n => n.state === selectedStateFilter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>REAL-TIME IOT TELEMETRY & FIELD SENSOR STREAM</span>
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
          North East India IoT Geotechnical Telemetry Grid
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
          Direct sensor readings from borehole vibrating-wire piezometers, in-place inclinometers, 
          laser crackmeters, and tipping-bucket rain gauges across critical mountain transportation corridors.
        </p>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Filter by State:</span>
          <select
            value={selectedStateFilter}
            onChange={(e) => setSelectedStateFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All States (NER)</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Assam">Assam</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Manipur">Manipur</option>
            <option value="Mizoram">Mizoram</option>
          </select>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              autoRefresh 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <span>{autoRefresh ? 'Live Streaming' : 'Stream Paused'}</span>
          </button>

          <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
            Updated: {lastRefreshed}
          </span>
        </div>
      </div>

      {/* Live Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNodes.map((node) => {
          const isCrit = node.status === 'Critical';
          const isAdv = node.status === 'Advisory';

          return (
            <div
              key={node.id}
              className={`rounded-2xl p-5 border transition-all space-y-4 bg-slate-900 ${
                isCrit
                  ? 'border-rose-500/50 shadow-lg shadow-rose-500/10'
                  : isAdv
                  ? 'border-amber-500/40'
                  : 'border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-cyan-400 font-bold block">{node.id}</span>
                  <h3 className="text-sm font-bold text-white">{node.zoneName}</h3>
                  <span className="text-[11px] text-slate-400">{node.state}</span>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                  isCrit 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                    : isAdv 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {node.status}
                </span>
              </div>

              {/* Sensor Metric Rows */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Pore Water Pressure</span>
                  <span className={`text-base font-bold font-mono ${node.poreWaterPressureKpa > 40 ? 'text-rose-400' : 'text-white'}`}>
                    {node.poreWaterPressureKpa} <span className="text-xs text-slate-400">kPa</span>
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Inclinometer Shear</span>
                  <span className={`text-base font-bold font-mono ${node.displacementMm > 10 ? 'text-rose-400' : 'text-white'}`}>
                    {node.displacementMm} <span className="text-xs text-slate-400">mm</span>
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Current Rain Rate</span>
                  <span className="text-sm font-bold font-mono text-cyan-300">
                    {node.rainfallRateMmH} <span className="text-[10px] text-slate-400">mm/h</span>
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Soil Saturation</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    {node.soilMoisturePct}%
                  </span>
                </div>
              </div>

              {/* Hardware Telemetry Footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1 font-mono">
                  <BatteryCharging className="w-3 h-3 text-emerald-400" />
                  {node.batteryPct}%
                </span>

                <span className="flex items-center gap-1 font-mono">
                  <Wifi className="w-3 h-3 text-cyan-400" />
                  {node.signalStrengthDbm} dBm
                </span>

                <span className="text-slate-500 font-mono">
                  {node.lastPing}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
