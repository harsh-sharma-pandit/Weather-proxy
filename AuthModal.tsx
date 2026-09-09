import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  User, 
  Mail, 
  Key, 
  ArrowRight, 
  CheckCircle2, 
  Building2,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; role: string; organization: string }) => void;
}

const OFFICER_ROLES = [
  {
    role: 'NDRF Disaster Commander',
    name: 'Inspector R. Goswami',
    org: 'NDRF 1st Bn (Patgaon Guwahati)',
    badge: 'NDRF-NER-042'
  },
  {
    role: 'GSI Geotechnical Scientist',
    name: 'Dr. Anita Bhutia',
    org: 'Geological Survey of India (NER Shillong)',
    badge: 'GSI-GEO-118'
  },
  {
    role: 'SDMA Emergency Officer',
    name: 'T. Jamir',
    org: 'State Disaster Management Authority',
    badge: 'SDMA-NER-509'
  },
  {
    role: 'Field Volunteer / First Responder',
    name: 'Harsh Sharma',
    org: 'North East Mountain Rescue Corps',
    badge: 'NER-VOL-882'
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  if (!isOpen) return null;

  const handleQuickOfficerLogin = (officer: typeof OFFICER_ROLES[0]) => {
    onLoginSuccess({
      name: officer.name,
      role: officer.role,
      organization: officer.org
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      name: email.split('@')[0] || 'Field Officer',
      role: 'Authorized Incident Responder',
      organization: 'Emergency Operations Command'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white font-heading">
            Official Responder & Agency Access
          </h2>
          <p className="text-xs text-slate-400">
            Authenticate to unlock administrative SITREP broadcasting, sensor calibration, and evacuation dispatch.
          </p>
        </div>

        {/* Quick Demo Credentials */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block text-center">
            Demo Responder Profiles (One-Click Sign-In)
          </span>
          <div className="grid grid-cols-1 gap-2">
            {OFFICER_ROLES.map((officer, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickOfficerLogin(officer)}
                className="flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-left transition-all group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                    {officer.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {officer.role} • {officer.badge}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] font-mono text-slate-500 uppercase shrink-0">
            or government credential login
          </span>
          <div className="border-t border-slate-800 w-full" />
        </div>

        {/* Standard Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Official NIC / Agency Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="officer@ndma.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Security Token / Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-md shadow-cyan-600/20 transition-all text-xs"
          >
            Authenticate Official Session
          </button>
        </form>

      </div>
    </div>
  );
};
