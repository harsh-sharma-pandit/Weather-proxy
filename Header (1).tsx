import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  Sliders, 
  Wifi, 
  WifiOff, 
  RotateCw, 
  Menu, 
  X, 
  Map, 
  LayoutDashboard,
  User,
  Navigation,
  Radio,
  BarChart2,
  ShieldCheck,
  Building2,
  Cpu,
  Layers,
  ChevronDown,
  LogIn
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  alertsCount?: number;
  localUserName?: string;
  currentLocationName?: string;
  isOnline?: boolean;
  isSyncing?: boolean;
  lastSyncTime?: string;
  onOpenLocationPicker?: () => void;
  onOpenReportModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  alertsCount = 0,
  localUserName,
  currentLocationName = 'Dikchu - Singtam Corridor, Sikkim',
  isOnline = true,
  isSyncing = false,
  lastSyncTime = 'Just now',
  onOpenLocationPicker,
  onOpenReportModal,
  onOpenAuthModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modulesDropdownOpen, setModulesDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setModulesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'report', label: 'Report', icon: FileText },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: alertsCount },
    { id: 'settings', label: 'Settings', icon: Sliders }
  ];

  const operationalModules = [
    { id: 'routes', label: 'Dual-Route Planner', desc: 'Fastest vs Safest Bedrock Corridor', icon: Navigation },
    { id: 'emergency', label: 'Emergency Response', desc: 'NDRF / SDRF Evacuation Command', icon: ShieldAlert },
    { id: 'telemetry', label: 'Live IoT Telemetry', desc: 'Pore pressure & displacement stream', icon: Radio },
    { id: 'sensors', label: 'Sensor Management', desc: 'Inclinometers & Rain Gauges registry', icon: Cpu },
    { id: 'analytics', label: 'Risk Analytics', desc: 'Monsoonal rainfall vs failure trends', icon: BarChart2 },
    { id: 'admin', label: 'Admin Command', desc: 'SITREP export & CAP alerts', icon: ShieldCheck },
    { id: 'shelters', label: 'Safe-Stay Shelters', desc: 'Emergency relief camp reservations', icon: Building2 },
    { id: 'signin', label: 'Officer Portal', desc: 'Official government credentials', icon: LogIn }
  ];

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
    setModulesDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-xl">
      {/* Top Status & Connectivity Bar */}
      <div className="bg-slate-900/90 px-3 py-1.5 text-xs border-b border-slate-800 text-slate-300 flex items-center justify-between overflow-x-auto gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            PROTOTYPE
          </span>
          <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
            Smart India Hackathon 2026 • North East India (8 States)
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          {/* Location status badge */}
          <button 
            onClick={onOpenLocationPicker}
            className="flex items-center gap-1 text-slate-300 hover:text-cyan-300 transition-colors bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60"
            title="Click to switch or simulate location"
          >
            <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate max-w-[160px] sm:max-w-[220px] font-medium">{currentLocationName}</span>
          </button>

          {/* Offline/Online Indicator */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800">
            {isSyncing ? (
              <span className="flex items-center gap-1 text-cyan-400 font-medium">
                <RotateCw className="w-3 h-3 animate-spin" />
                <span className="hidden md:inline">Syncing...</span>
              </span>
            ) : isOnline ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span>Offline</span>
              </span>
            )}
            <span className="text-slate-600 hidden lg:inline">•</span>
            <span className="text-slate-400 hidden lg:inline">Synced: {lastSyncTime}</span>
          </div>

          <span className="text-slate-400 font-mono hidden md:inline">{currentTime}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div 
            id="nav-brand-logo"
            onClick={() => handleTabClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-slate-950"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl text-white tracking-tight">
                  Tiptide
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded">
                  AI + GIS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                AI Landslide Early Warning & Risk Monitoring
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Specialized Disaster Operations Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setModulesDropdownOpen(!modulesDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  ['routes', 'emergency', 'telemetry', 'sensors', 'analytics', 'admin', 'shelters', 'signin'].includes(activeTab)
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Modules</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${modulesDropdownOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`} />
              </button>

              {modulesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider border-b border-slate-800/80">
                    NER Disaster Operations Suite
                  </div>
                  {operationalModules.map((mod) => {
                    const ModIcon = mod.icon;
                    const isModActive = activeTab === mod.id;
                    return (
                      <button
                        key={mod.id}
                        onClick={() => handleTabClick(mod.id)}
                        className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                          isModActive
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'hover:bg-slate-900 text-slate-300'
                        }`}
                      >
                        <ModIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isModActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <div>
                          <div className="text-xs font-bold leading-tight">{mod.label}</div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{mod.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Action / User Name Pill & Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Report Button */}
            {onOpenReportModal && (
              <button
                onClick={onOpenReportModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-rose-600/20 transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Report Incident</span>
              </button>
            )}

            {/* Official Officer Access / Login button */}
            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-800/50 rounded-lg text-xs font-semibold transition-all"
                title="NDRF, GSI & SDMA Official Access"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Officer Sign-In</span>
              </button>
            )}

            {/* Local User Name Display (No account required) */}
            {localUserName ? (
              <button
                onClick={() => handleTabClick('settings')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs rounded-lg transition-colors"
                title="Local identity used for personalized safety alerts"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-medium max-w-[100px] truncate">{localUserName}</span>
              </button>
            ) : (
              <button
                onClick={() => handleTabClick('settings')}
                className="text-xs text-slate-400 hover:text-cyan-300 underline underline-offset-4 hidden lg:inline"
              >
                + Add Name
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2 max-h-[85vh] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800">
            <span className="px-2 text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">
              Disaster Operations Modules
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {operationalModules.map((mod) => {
                const ModIcon = mod.icon;
                const isModActive = activeTab === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleTabClick(mod.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-left transition-all ${
                      isModActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-900/60 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <ModIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{mod.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>Location: {currentLocationName}</span>
            <button
              onClick={() => { onSelectTab('settings'); setMobileMenuOpen(false); }}
              className="text-cyan-400 font-semibold"
            >
              Change Location
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
