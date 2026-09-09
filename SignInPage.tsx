import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  FileCheck, 
  Users, 
  Sparkles 
} from 'lucide-react';

interface SignInPageProps {
  onSignInSuccess: (user: { name: string; role: string; organization: string }) => void;
  onCancel: () => void;
}

const DEPARTMENTS = [
  'National Disaster Management Authority (NDMA)',
  'National Disaster Response Force (NDRF)',
  'Geological Survey of India (GSI)',
  'Border Roads Organisation (BRO Project Swastik)',
  'State Disaster Management Authority (SDMA)'
];

export const SignInPage: React.FC<SignInPageProps> = ({
  onSignInSuccess,
  onCancel
}) => {
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [officerName, setOfficerName] = useState('Inspector R. Goswami');
  const [officerEmail, setOfficerEmail] = useState('r.goswami@ndrf.gov.in');
  const [pinCode, setPinCode] = useState('482910');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignInSuccess({
      name: officerName,
      role: 'Incident Command Officer',
      organization: department
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-10 space-y-6 shadow-2xl">
        
        {/* Back Button */}
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Landslide Monitor</span>
        </button>

        {/* Brand & Security Header */}
        <div className="space-y-2 text-center">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/10">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white font-heading">
            Tiptide Official Command Gateway
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Secure multi-agency gateway for NDMA, NDRF, GSI, and BRO officers operating across the 8 North Eastern States.
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Assigned Department / Agency</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
            >
              {DEPARTMENTS.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Officer Full Name</label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Government Email</label>
              <input
                type="email"
                value={officerEmail}
                onChange={(e) => setOfficerEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Emergency Officer Token / PIN</label>
            <input
              type="password"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authorize Official Incident Access</span>
            </button>
          </div>
        </form>

        {/* Security Disclaimers */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-500 space-y-1">
          <span className="text-slate-400 font-bold block">Protected Government Network Protocol</span>
          <p>
            This portal is restricted to authorized emergency management personnel. All SITREP broadcasts and sensor calibrations are logged and cryptographically audited.
          </p>
        </div>

      </div>
    </div>
  );
};
