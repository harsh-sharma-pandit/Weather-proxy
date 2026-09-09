import React, { useState } from 'react';
import { 
  Sliders, 
  Cpu, 
  Battery, 
  Wifi, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Wrench, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MapPin,
  Clock
} from 'lucide-react';

interface SensorDevice {
  id: string;
  name: string;
  type: 'In-Place Inclinometer' | 'Borehole Piezometer' | 'Automatic Rain Gauge' | 'Optical Crackmeter' | 'Seismic Geophone' | 'InSAR Ground Reflector';
  location: string;
  state: string;
  status: 'Online' | 'Warning' | 'Needs Maintenance' | 'Offline';
  batteryLevel: number;
  lastPing: string;
  lastCalibrationDate: string;
  firmwareVersion: string;
  signalType: 'LoRaWAN + GSAT-7A' | '4G/LTE Cat-M1' | 'Inmarsat BGAN';
}

const INITIAL_SENSORS: SensorDevice[] = [
  {
    id: 'SEN-SK-01',
    name: 'Teesta Gorge Slope Inclinometer Array #1',
    type: 'In-Place Inclinometer',
    location: 'Dikchu Bridge Overlook, NH-10',
    state: 'Sikkim',
    status: 'Online',
    batteryLevel: 94,
    lastPing: '3 mins ago',
    lastCalibrationDate: '2026-06-15',
    firmwareVersion: 'v2.4.1-ner',
    signalType: 'LoRaWAN + GSAT-7A'
  },
  {
    id: 'SEN-SK-02',
    name: 'Deep Colluvium Piezometer P-3',
    type: 'Borehole Piezometer',
    location: 'Singtam Upper Ridge Chute',
    state: 'Sikkim',
    status: 'Warning',
    batteryLevel: 68,
    lastPing: '1 min ago',
    lastCalibrationDate: '2026-05-10',
    firmwareVersion: 'v2.3.8',
    signalType: '4G/LTE Cat-M1'
  },
  {
    id: 'SEN-AS-01',
    name: 'Jatinga Railway Cutting Crackmeter',
    type: 'Optical Crackmeter',
    location: 'Haflong - Lumding Railway Track km 42',
    state: 'Assam',
    status: 'Needs Maintenance',
    batteryLevel: 41,
    lastPing: '14 mins ago',
    lastCalibrationDate: '2025-11-20',
    firmwareVersion: 'v2.1.0',
    signalType: 'LoRaWAN + GSAT-7A'
  },
  {
    id: 'SEN-AR-01',
    name: 'Sela Pass Tipping Bucket Rain Gauge',
    type: 'Automatic Rain Gauge',
    location: 'Baisakhi Military Camp, Tawang Corridor',
    state: 'Arunachal Pradesh',
    status: 'Online',
    batteryLevel: 98,
    lastPing: '2 mins ago',
    lastCalibrationDate: '2026-07-01',
    firmwareVersion: 'v3.0.1',
    signalType: 'Inmarsat BGAN'
  },
  {
    id: 'SEN-ML-01',
    name: 'Mawlynnong Escarpment Tri-Axial Geophone',
    type: 'Seismic Geophone',
    location: 'Pynursla Ridge Sector, NH-206',
    state: 'Meghalaya',
    status: 'Online',
    batteryLevel: 89,
    lastPing: '6 mins ago',
    lastCalibrationDate: '2026-04-18',
    firmwareVersion: 'v2.4.1-ner',
    signalType: 'LoRaWAN + GSAT-7A'
  },
  {
    id: 'SEN-MN-01',
    name: 'Tupul Yard Borehole Pore Pressure Node',
    type: 'Borehole Piezometer',
    location: 'Noney District Station, Ijei River Cut',
    state: 'Manipur',
    status: 'Online',
    batteryLevel: 82,
    lastPing: '4 mins ago',
    lastCalibrationDate: '2026-06-22',
    firmwareVersion: 'v2.4.0',
    signalType: '4G/LTE Cat-M1'
  }
];

export const SensorManagementView: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [sensors, setSensors] = useState<SensorDevice[]>(INITIAL_SENSORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pingingId, setPingingId] = useState<string | null>(null);

  const handleTestPing = (id: string) => {
    setPingingId(id);
    setTimeout(() => {
      setSensors(prev => prev.map(s => s.id === id ? { ...s, lastPing: 'Just now' } : s));
      setPingingId(null);
    }, 1200);
  };

  const filteredSensors = sensors.filter(sensor => {
    const matchesSearch = sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sensor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sensor.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || sensor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>FIELD SENSOR LIFECYCLE & TELEMETRY REGISTRY</span>
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
          IoT Geotechnical Sensor Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
          Supervise real-time health, calibration intervals, satellite uplink health, 
          and battery life across mountain slope sensor nodes deployed by GSI, BRO, and NDMA.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-3 flex-grow max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, name, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Statuses</option>
            <option value="Online">Online Only</option>
            <option value="Warning">Warning</option>
            <option value="Needs Maintenance">Needs Maintenance</option>
          </select>

          <button
            onClick={() => setSensors(INITIAL_SENSORS)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Manifest</span>
          </button>
        </div>
      </div>

      {/* Sensor Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Device ID / Type</th>
                <th className="px-4 py-3">Deployment Site</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Battery</th>
                <th className="px-4 py-3">Uplink Gateway</th>
                <th className="px-4 py-3">Last Ping</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSensors.map((sensor) => {
                const isWarning = sensor.status === 'Warning';
                const isMaint = sensor.status === 'Needs Maintenance';

                return (
                  <tr key={sensor.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">
                      <div className="font-mono text-cyan-400 font-bold text-[11px]">{sensor.id}</div>
                      <div className="text-slate-300 font-bold mt-0.5">{sensor.name}</div>
                      <div className="text-[10px] text-slate-500">{sensor.type}</div>
                    </td>

                    <td className="px-4 py-3 text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{sensor.location}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">{sensor.state}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        isMaint
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {sensor.status === 'Online' && <CheckCircle2 className="w-2.5 h-2.5" />}
                        {sensor.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Battery className={`w-3.5 h-3.5 ${sensor.batteryLevel < 50 ? 'text-amber-400' : 'text-emerald-400'}`} />
                        <span className={sensor.batteryLevel < 50 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                          {sensor.batteryLevel}%
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                      {sensor.signalType}
                    </td>

                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                      {sensor.lastPing}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleTestPing(sensor.id)}
                        disabled={pingingId === sensor.id}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-[11px] font-bold transition-all border border-slate-700 disabled:opacity-50"
                      >
                        {pingingId === sensor.id ? 'Pinging...' : 'Ping Test'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
