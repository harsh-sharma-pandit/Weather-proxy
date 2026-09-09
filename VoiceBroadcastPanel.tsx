import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Settings2, 
  Radio, 
  Sparkles, 
  ShieldAlert, 
  Check, 
  Sliders, 
  Repeat, 
  BellRing,
  HelpCircle,
  Headphones
} from 'lucide-react';
import { EarlyWarningAlert } from '../types';
import { VoiceSettings } from '../utils/alertVoiceSynthesizer';

interface VoiceBroadcastPanelProps {
  isPlaying: boolean;
  isPaused: boolean;
  currentAlert: EarlyWarningAlert | null;
  currentIndex: number;
  totalInQueue: number;
  currentSpokenText: string;
  charIndex: number;
  voices: SpeechSynthesisVoice[];
  settings: VoiceSettings;
  urgentAlertsCount: number;
  allAlertsCount: number;
  onStartBroadcast: (urgentOnly?: boolean) => void;
  onPauseBroadcast: () => void;
  onResumeBroadcast: () => void;
  onStopBroadcast: () => void;
  onSkipNext: () => void;
  onSkipPrev: () => void;
  onReplayCurrent: () => void;
  onUpdateSettings: (settings: Partial<VoiceSettings>) => void;
}

export const VoiceBroadcastPanel: React.FC<VoiceBroadcastPanelProps> = ({
  isPlaying,
  isPaused,
  currentAlert,
  currentIndex,
  totalInQueue,
  currentSpokenText,
  charIndex,
  voices,
  settings,
  urgentAlertsCount,
  allAlertsCount,
  onStartBroadcast,
  onPauseBroadcast,
  onResumeBroadcast,
  onStopBroadcast,
  onSkipNext,
  onSkipPrev,
  onReplayCurrent,
  onUpdateSettings,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Format highlighted text for live subtitles
  const spokenPart = currentSpokenText.slice(0, charIndex);

  return (
    <div 
      id="voice-broadcast-panel"
      className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-2xl ${
        isPlaying 
          ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-red-950/30 border-red-500/40 shadow-red-950/30' 
          : 'bg-slate-900/90 border-slate-800'
      }`}
    >
      {/* Top Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title & Live Status */}
        <div className="flex items-start sm:items-center gap-3">
          <div className={`p-2.5 rounded-xl border transition-all ${
            isPlaying && !isPaused
              ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-lg shadow-red-500/20 animate-pulse'
              : 'bg-slate-800 text-cyan-400 border-slate-700'
          }`}>
            {isPlaying && !isPaused ? (
              <Radio className="w-5 h-5 animate-pulse text-red-400" />
            ) : (
              <Headphones className="w-5 h-5 text-cyan-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white font-heading tracking-wide">
                Hands-Free Field Voice Broadcast
              </h2>
              {isPlaying && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 ${
                  isPaused 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'bg-red-500 text-white animate-pulse'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  {isPaused ? 'Broadcast Paused' : 'Live Audio Transmission'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Audio speech synthesis for field responders, rescue vehicles, and emergency command teams.
            </p>
          </div>
        </div>

        {/* Action Controls & Settings Toggle */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Main Broadcast Trigger / Toggle */}
          {!isPlaying ? (
            <div className="flex items-center gap-2">
              <button
                id="btn-start-broadcast"
                onClick={() => onStartBroadcast(settings.prioritizeUrgentOnly)}
                className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all flex items-center gap-2 active:scale-95"
              >
                <Volume2 className="w-4 h-4 text-white" />
                <span>Read Urgent Alerts ({urgentAlertsCount})</span>
              </button>

              <button
                id="btn-quick-auto-announce"
                onClick={() => onUpdateSettings({ autoAnnounceOnEnter: !settings.autoAnnounceOnEnter })}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  settings.autoAnnounceOnEnter
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
                }`}
                title="Hands-free mode: Automatically reads out urgent alerts as soon as you enter the Alerts view"
              >
                <span className={`w-2 h-2 rounded-full ${settings.autoAnnounceOnEnter ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                <span className="hidden sm:inline">Hands-Free:</span>
                <span>{settings.autoAnnounceOnEnter ? 'Auto ON' : 'Auto OFF'}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              {/* Skip Prev */}
              <button
                id="btn-skip-prev"
                onClick={onSkipPrev}
                title="Previous Alert (P)"
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Pause / Resume */}
              {isPaused ? (
                <button
                  id="btn-resume-broadcast"
                  onClick={onResumeBroadcast}
                  title="Resume Speech (Space)"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  id="btn-pause-broadcast"
                  onClick={onPauseBroadcast}
                  title="Pause Speech (Space)"
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </button>
              )}

              {/* Replay */}
              <button
                id="btn-replay-current"
                onClick={onReplayCurrent}
                title="Replay Current Alert"
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Skip Next */}
              <button
                id="btn-skip-next"
                onClick={onSkipNext}
                title="Next Alert (N)"
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Stop */}
              <button
                id="btn-stop-broadcast"
                onClick={onStopBroadcast}
                title="Stop Broadcast (Esc)"
                className="px-2.5 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/50 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Stop</span>
              </button>
            </div>
          )}

          {/* Voice Settings Button */}
          <button
            id="btn-voice-settings"
            onClick={() => setShowSettingsModal(prev => !prev)}
            className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
              showSettingsModal 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Speech Synthesis Audio Settings"
          >
            <Settings2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Voice Settings</span>
          </button>
        </div>

      </div>

      {/* Spoken Alert Status & Live Equalizer Visualizer */}
      {isPlaying && currentAlert && (
        <div className="p-4 sm:p-5 bg-slate-950/70 border-b border-slate-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                currentAlert.severity === 'critical' ? 'bg-red-500 text-white' :
                currentAlert.severity === 'high' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-yellow-500 text-slate-950'
              }`}>
                {currentAlert.severity} Alert
              </span>
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                Bulletin {currentIndex + 1} of {totalInQueue}
              </span>
              <span className="text-xs text-slate-400 truncate max-w-xs">
                • {currentAlert.location}, {currentAlert.state}
              </span>
            </div>

            {/* Animated Audio Equalizer Bars */}
            {!isPaused && (
              <div className="flex items-center gap-1 h-5 px-3 py-1 bg-slate-900/80 rounded-full border border-slate-800">
                <span className="w-1 bg-red-400 rounded-full animate-[bounce_0.8s_infinite] h-3"></span>
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.6s_infinite] h-5"></span>
                <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.9s_infinite] h-2"></span>
                <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_0.7s_infinite] h-4"></span>
                <span className="w-1 bg-red-400 rounded-full animate-[bounce_0.5s_infinite] h-3"></span>
                <span className="text-[10px] font-mono text-slate-400 ml-1.5">Speaking</span>
              </div>
            )}
          </div>

          {/* Subtitle / Closed Caption Live Box */}
          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs sm:text-sm font-sans leading-relaxed text-slate-200 shadow-inner">
            <div className="text-[10px] uppercase font-mono text-cyan-400/80 mb-1 flex items-center justify-between">
              <span>Live Field Audio Telemetry Captions</span>
              <span className="text-slate-500 text-[9px]">Paced for field radio clarity</span>
            </div>
            <p className="tracking-wide">
              <span className="text-cyan-300 font-medium">{spokenPart}</span>
              <span className="text-white font-bold bg-cyan-500/20 px-1 py-0.5 rounded border border-cyan-400/40 animate-pulse">
                {currentSpokenText.slice(charIndex, charIndex + 20)}
              </span>
              <span className="text-slate-400 opacity-70">{currentSpokenText.slice(charIndex + 20)}</span>
            </p>
          </div>
        </div>
      )}

      {/* Voice Settings Drawer / Expanded Config */}
      {showSettingsModal && (
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-heading">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Speech Engine Configuration (Web Speech API)</span>
            </div>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Done ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            {/* Speed Rate */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex justify-between">
                <span>Speech Pace:</span>
                <span className="text-cyan-400 font-mono font-bold">{settings.rate}x</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: '0.85x Field', val: 0.85 },
                  { label: '1.0x Normal', val: 1.0 },
                  { label: '1.2x Quick', val: 1.2 }
                ].map(item => (
                  <button
                    key={item.val}
                    onClick={() => onUpdateSettings({ rate: item.val })}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                      settings.rate === item.val
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Accent */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">
                Audio Voice Accent:
              </label>
              <select
                value={settings.voiceURI}
                onChange={(e) => onUpdateSettings({ voiceURI: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">Auto Detect (Prefers Indian / Natural English)</option>
                {voices.map(v => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Emergency Chime Toggle */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">
                Pre-Alert Warning Tone:
              </label>
              <button
                onClick={() => onUpdateSettings({ playChimeBeforeAlert: !settings.playChimeBeforeAlert })}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-between border transition-all ${
                  settings.playChimeBeforeAlert
                    ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <BellRing className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2-Tone Chime Tone</span>
                </span>
                <span>{settings.playChimeBeforeAlert ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Auto Announce On Enter & Loop */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">
                Language / Dialect Mode:
              </label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: 'en', label: 'English' },
                  { id: 'bilingual', label: 'Bilingual' },
                  { id: 'hi', label: 'हिंदी' },
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => onUpdateSettings({ languageMode: mode.id as 'en' | 'hi' | 'bilingual' })}
                    className={`py-1.5 px-1.5 rounded-lg text-[11px] font-semibold transition-all text-center ${
                      (settings.languageMode || 'en') === mode.id
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Field Automation */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">
                Field Automation:
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateSettings({ autoAnnounceOnEnter: !settings.autoAnnounceOnEnter })}
                  title="Automatically speak urgent alerts upon opening the Early Warnings tab"
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all truncate ${
                    settings.autoAnnounceOnEnter
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Auto-Read: {settings.autoAnnounceOnEnter ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => onUpdateSettings({ continuousLoop: !settings.continuousLoop })}
                  title="Loop announcements continuously for vehicle patrols"
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all flex items-center justify-center gap-1 ${
                    settings.continuousLoop
                      ? 'bg-purple-950/40 text-purple-300 border-purple-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Repeat className="w-3 h-3" />
                  <span>Loop: {settings.continuousLoop ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 gap-2">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Keyboard Hotkeys: <strong className="text-slate-300">Space</strong> (Play/Pause), <strong className="text-slate-300">Esc</strong> (Stop), <strong className="text-slate-300">N / P</strong> (Next/Prev)</span>
            </span>
            <span className="text-slate-400">Zero-latency client-side speech synthesis</span>
          </div>

        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="px-4 py-2.5 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Priority Queue: <strong className="text-red-400">{urgentAlertsCount} Critical & High</strong> bulletins</span>
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">Total active feed: {allAlertsCount} alerts</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onStartBroadcast(false)}
            className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors underline"
          >
            Broadcast all filtered ({allAlertsCount})
          </button>
        </div>
      </div>

    </div>
  );
};
