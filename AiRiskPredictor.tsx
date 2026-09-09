import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Gauge, 
  CloudRain, 
  Droplets, 
  TrendingUp, 
  Compass, 
  Layers, 
  History, 
  ShieldAlert, 
  Radio, 
  ArrowRight, 
  CheckCircle, 
  RefreshCw, 
  Send, 
  Zap,
  Sliders,
  Plane,
  Truck,
  Users,
  Building
} from 'lucide-react';
import { MonitoringZone, RiskSeverity } from '../types';
import { MONITORING_ZONES, NER_STATES } from './data/nerData.ts';

interface AiRiskPredictorProps {
  initialZone?: MonitoringZone | null;
  onNavigateToAlerts?: () => void;
}

export const AiRiskPredictor: React.FC<AiRiskPredictorProps> = ({
  initialZone,
  onNavigateToAlerts
}) => {
  // Input parameters
  const [locationName, setLocationName] = useState(initialZone?.name || 'Singtam - Dikchu Corridor');
  const [state, setState] = useState(initialZone?.state || 'Sikkim');
  const [rainfall24h, setRainfall24h] = useState<number>(initialZone?.rainfallMm24h || 184.6);
  const [rainfallIntensity, setRainfallIntensity] = useState<number>(initialZone?.rainfallIntensityMmHr || 22.4);
  const [soilMoisture, setSoilMoisture] = useState<number>(initialZone?.soilMoisturePercent || 89.2);
  const [poreWaterPressure, setPoreWaterPressure] = useState<number>(initialZone?.poreWaterPressureKPa || 48.5);
  const [slopeAngle, setSlopeAngle] = useState<number>(initialZone?.slopeAngleDeg || 46);
  const [groundDisplacement, setGroundDisplacement] = useState<number>(initialZone?.groundMovementMm || 18.4);
  const [geologicalFormation, setGeologicalFormation] = useState(initialZone?.geologicalFormation || 'Gneiss & Phyllite Shear Zone');
  const [historicalIncidents, setHistoricalIncidents] = useState<number>(initialZone?.historicalLandslidesCount || 14);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentPlan, setDeploymentPlan] = useState<any>(null);
  const [smsBroadcastSent, setSmsBroadcastSent] = useState(false);

  // Preset Scenario Loader
  const loadPresetScenario = (scenario: 'monsoon_extreme' | 'dry_stable' | 'railway_subsidence' | 'moderate_rain') => {
    switch (scenario) {
      case 'monsoon_extreme':
        setLocationName('Cherrapunji South Wall Escarpment');
        setState('Meghalaya');
        setRainfall24h(312.0);
        setRainfallIntensity(34.0);
        setSoilMoisture(94.1);
        setPoreWaterPressure(52.0);
        setSlopeAngle(52);
        setGroundDisplacement(14.2);
        setGeologicalFormation('Sandstone with Saturated Clay Overburden');
        setHistoricalIncidents(19);
        break;
      case 'railway_subsidence':
        setLocationName('Haflong Railway Cut Section');
        setState('Assam');
        setRainfall24h(196.4);
        setRainfallIntensity(28.5);
        setSoilMoisture(91.8);
        setPoreWaterPressure(56.2);
        setSlopeAngle(38);
        setGroundDisplacement(24.6);
        setGeologicalFormation('Disang Shales & Clay Overburden');
        setHistoricalIncidents(23);
        break;
      case 'moderate_rain':
        setLocationName('Sela Pass Route Km 42');
        setState('Arunachal Pradesh');
        setRainfall24h(68.0);
        setRainfallIntensity(8.5);
        setSoilMoisture(64.0);
        setPoreWaterPressure(24.5);
        setSlopeAngle(48);
        setGroundDisplacement(3.1);
        setGeologicalFormation('Granitic Gneiss & Colluvium');
        setHistoricalIncidents(8);
        break;
      case 'dry_stable':
        setLocationName('Jampui Hills Ridge');
        setState('Tripura');
        setRainfall24h(12.0);
        setRainfallIntensity(1.5);
        setSoilMoisture(38.0);
        setPoreWaterPressure(8.0);
        setSlopeAngle(28);
        setGroundDisplacement(0.2);
        setGeologicalFormation('Surma Group Bedrock Strata');
        setHistoricalIncidents(2);
        break;
    }
  };

  const handleRunAiPrediction = async () => {
    setIsLoading(true);
    setPredictionResult(null);
    setDeploymentPlan(null);
    setSmsBroadcastSent(false);

    try {
      const response = await fetch('/api/ai/predict-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName,
          state,
          rainfall24h,
          rainfallIntensity,
          soilMoisture,
          poreWaterPressure,
          slopeAngle,
          groundDisplacement,
          geologicalFormation,
          historicalIncidents
        })
      });

      const data = await response.json();
      setPredictionResult(data);
    } catch (err) {
      console.error('Error running AI prediction:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateDeployment = async () => {
    if (!predictionResult) return;
    setIsDeploying(true);
    try {
      const response = await fetch('/api/ai/simulate-deployment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoneName: locationName,
          state,
          riskLevel: predictionResult.riskLevel,
          affectedCount: predictionResult.riskScore > 75 ? 1200 : 450,
          roadBlocked: predictionResult.riskScore > 70
        })
      });
      const data = await response.json();
      setDeploymentPlan(data);
    } catch (err) {
      console.error('Error simulating deployment:', err);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleBroadcastSms = () => {
    setSmsBroadcastSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Description */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-heading">
              AI Geotechnical Landslide Risk Predictor & Rapid Deployment Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Powered by Google Gemini 3.7 Flash & Geotechnical Mohr-Coulomb physics algorithms for the North Eastern Region of India
          </p>
        </div>

        {/* Preset Scenarios Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px]">Load Preset Scenario:</span>
          <button
            onClick={() => loadPresetScenario('monsoon_extreme')}
            className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 rounded-lg transition-all"
          >
            Cherrapunji Downpour
          </button>
          <button
            onClick={() => loadPresetScenario('railway_subsidence')}
            className="px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 rounded-lg transition-all"
          >
            Haflong Railway Slip
          </button>
          <button
            onClick={() => loadPresetScenario('moderate_rain')}
            className="px-2.5 py-1 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 text-blue-300 rounded-lg transition-all"
          >
            Arunachal Pass
          </button>
          <button
            onClick={() => loadPresetScenario('dry_stable')}
            className="px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 rounded-lg transition-all"
          >
            Dry Ridge Safe
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-heading">
                  Geotechnical & Environmental Parameters
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Live Inputs</span>
            </div>

            {/* Location & State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 font-medium mb-1">Location Name</label>
                <input
                  type="text"
                  id="input-ai-loc-name"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 font-medium mb-1">NER State</label>
                <select
                  id="select-ai-state"
                  value={state}
                  onChange={(e) => setState(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {NER_STATES.filter(s => s !== 'All States').map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* 1. Rainfall 24h Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                  24-Hour Cumulative Rainfall
                </span>
                <span className="font-bold text-cyan-300 font-mono">{rainfall24h} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="400"
                step="2"
                value={rainfall24h}
                onChange={(e) => setRainfall24h(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 mm (Dry)</span>
                <span>150 mm (Heavy)</span>
                <span>400 mm (Extreme)</span>
              </div>
            </div>

            {/* 2. Soil Moisture Saturation Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                  TDR Soil Saturation Moisture
                </span>
                <span className="font-bold text-emerald-300 font-mono">{soilMoisture}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10% Unsaturated</span>
                <span>80% Warning</span>
                <span>100% Saturated</span>
              </div>
            </div>

            {/* 3. Pore Water Pressure */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Gauge className="w-3.5 h-3.5 text-amber-400" />
                  Pore Water Pressure (Piezometer)
                </span>
                <span className="font-bold text-amber-300 font-mono">{poreWaterPressure} kPa</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="1"
                value={poreWaterPressure}
                onChange={(e) => setPoreWaterPressure(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* 4. Slope Angle */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  Slope Gradient Angle
                </span>
                <span className="font-bold text-purple-300 font-mono">{slopeAngle}°</span>
              </div>
              <input
                type="range"
                min="15"
                max="75"
                step="1"
                value={slopeAngle}
                onChange={(e) => setSlopeAngle(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            {/* 5. Inclinometer Displacement */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                  24h Inclinometer Ground Displacement
                </span>
                <span className="font-bold text-red-300 font-mono">{groundDisplacement} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="0.5"
                value={groundDisplacement}
                onChange={(e) => setGroundDisplacement(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-red-400"
              />
            </div>

            {/* Geological Formation */}
            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1">Geological Lithology</label>
              <input
                type="text"
                value={geologicalFormation}
                onChange={(e) => setGeologicalFormation(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              id="btn-run-ai-predictor-trigger"
              onClick={handleRunAiPrediction}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Mohr-Coulomb Dynamics with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Calculate AI Landslide Probability Score</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output: AI Prediction Results & Rapid Deployment (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {predictionResult ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5 animate-in fade-in">
              
              {/* Score Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block font-mono">
                    AI GEOTECHNICAL EVALUATION REPORT
                  </span>
                  <h3 className="text-lg font-bold text-white font-heading">
                    {locationName}, {state}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Calculated Risk Score</span>
                    <span className="text-2xl font-black text-white font-mono">{predictionResult.riskScore}%</span>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    predictionResult.riskLevel === 'critical' ? 'bg-red-500 text-white animate-pulse' :
                    predictionResult.riskLevel === 'high' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' :
                    predictionResult.riskLevel === 'moderate' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50' :
                    'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                  }`}>
                    {predictionResult.riskLevel} RISK
                  </div>
                </div>
              </div>

              {/* Progress Gauge */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Landslide Probability Gradient</span>
                  <span className="text-cyan-400 font-mono">Confidence: {predictionResult.confidenceScore}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 border border-slate-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      predictionResult.riskScore >= 75 ? 'bg-gradient-to-r from-amber-500 via-red-500 to-rose-600' :
                      predictionResult.riskScore >= 50 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                      'bg-gradient-to-r from-cyan-400 to-emerald-500'
                    }`}
                    style={{ width: `${predictionResult.riskScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Geotechnical Physics Assessment */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                <span className="text-cyan-300 font-bold uppercase tracking-wider text-[10px] block font-mono">
                  Physics-Informed Geotechnical Assessment:
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {predictionResult.geotechnicalAssessment}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400">
                  <div>Failure Mechanism: <strong className="text-white">{predictionResult.primaryFailureMechanism}</strong></div>
                  <div>Estimated Factor of Safety (FoS): <strong className="text-cyan-300 font-mono">{predictionResult.factorOfSafetyEstimated}</strong></div>
                </div>
              </div>

              {/* Contributing Factors & Immediate Directives */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-amber-400 text-[11px] font-bold uppercase tracking-wider block">
                    Critical Trigger Factors
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {predictionResult.criticalTriggerFactors?.map((f: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 text-xs mt-0.5">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-emerald-400 text-[11px] font-bold uppercase tracking-wider block">
                    Recommended Evacuation Directive
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {predictionResult.immediateAction}
                  </p>
                  <div className="pt-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-700 text-cyan-300">
                      Status: {predictionResult.evacuationStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ready-to-broadcast SMS Early Warning Template */}
              <div className="p-3.5 bg-red-950/20 border border-red-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-red-300 text-xs font-bold">
                    <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    <span>Automated SMS Warning Broadcast Draft (CAP Standard)</span>
                  </div>
                  {smsBroadcastSent ? (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Broadcast Dispatched
                    </span>
                  ) : (
                    <button
                      onClick={handleBroadcastSms}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 shadow"
                    >
                      <Send className="w-3 h-3" />
                      <span>Simulate Broadcast (SMS & Siren)</span>
                    </button>
                  )}
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
                  {predictionResult.smsBroadcastTemplate}
                </div>
              </div>

              {/* Trigger Rapid Deployment Simulator */}
              <div className="pt-2">
                <button
                  id="btn-trigger-rapid-deployment"
                  onClick={handleSimulateDeployment}
                  disabled={isDeploying}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {isDeploying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plane className="w-4 h-4 text-cyan-400" />}
                  <span>Generate AI Rapid Tactical Evacuation & Rescue Deployment Plan</span>
                </button>
              </div>

              {/* Tactical Deployment Plan Box if generated */}
              {deploymentPlan && (
                <div className="p-4 bg-slate-950 border border-cyan-500/40 rounded-xl space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-cyan-300 font-mono">
                      TACTICAL MISSION: {deploymentPlan.missionCodeName}
                    </span>
                    <span className="text-[11px] text-slate-400">Lead: {deploymentPlan.commandLead}</span>
                  </div>

                  {/* Evacuation Corridors & Teams */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Evacuation Vectors:</span>
                      {deploymentPlan.evacuationCorridors?.map((c: any, i: number) => (
                        <div key={i} className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                          <span className="font-semibold text-white block">{c.name}</span>
                          <span className="text-[11px] text-slate-400">Status: {c.status} ({c.capacityPerHour} pers/hr)</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Rescue Teams Staged:</span>
                      {deploymentPlan.rescueTeamsDeployed?.map((t: any, i: number) => (
                        <div key={i} className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                          <span className="font-semibold text-emerald-300 block">{t.unit} ({t.personnel} personnel)</span>
                          <span className="text-[10px] text-slate-400">{t.equipment?.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 bg-cyan-950/30 rounded-lg border border-cyan-500/30 text-xs flex items-center gap-2">
                    <Plane className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white">Helicopter Extraction LZ: </span>
                      <span className="text-cyan-300">{deploymentPlan.helicopterEvacuationLZ?.coordinates}</span>
                      <span className="text-slate-400 text-[11px] block">{deploymentPlan.helicopterEvacuationLZ?.suitability}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-white font-heading">
                  Run Geotechnical Prediction Simulator
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Adjust 24h rainfall, soil saturation, slope gradient, and inclinometer ground displacement on the left, then click "Calculate AI Landslide Probability Score" to generate physics-informed disaster intelligence.
                </p>
              </div>
              <button
                onClick={handleRunAiPrediction}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Current Inputs</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
