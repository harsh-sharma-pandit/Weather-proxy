import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle,
  Loader
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; role: string; organization: string }) => void;
}

interface OfficerRole {
  role: string;
  name: string;
  org: string;
  badge: string;
}

// Move demo profiles to environment-specific config
// Only show in development mode
const DEMO_OFFICER_ROLES: OfficerRole[] = 
  process.env.NODE_ENV === 'development' 
    ? [
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
      ]
    : [];

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Extract name from email safely
const extractNameFromEmail = (email: string): string => {
  const name = email.split('@')[0];
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/[._-]/g, ' ') || 'Officer';
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickOfficerLogin = async (officer: OfficerRole) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onLoginSuccess({
        name: officer.name,
        role: officer.role,
        organization: officer.org
      });
      onClose();
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setError('Password is required');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual authentication API call
      // Example: const response = await authenticateUser(email, password);
      // For now, simulating the API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate authentication success
      // In production, verify credentials with backend
      const userName = extractNameFromEmail(email);
      
      onLoginSuccess({
        name: userName,
        role: 'Authorized Incident Responder',
        organization: 'Emergency Operations Command'
      });
      
      // Clear form on success
      setEmail('');
      setPassword('');
      onClose();
    } catch (err) {
      setError('Authentication failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close only if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
          aria-label="Close authentication modal"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 
            id="auth-modal-title"
            className="text-xl font-bold text-white font-heading"
          >
            Official Responder & Agency Access
          </h2>
          <p className="text-xs text-slate-400">
            Authenticate to unlock administrative SITREP broadcasting, sensor calibration, and evacuation dispatch.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        {/* Quick Demo Credentials - Only in development */}
        {DEMO_OFFICER_ROLES.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block text-center">
              Demo Responder Profiles (Development Only)
            </span>
            <div className="grid grid-cols-1 gap-2">
              {DEMO_OFFICER_ROLES.map((officer) => (
                <button
                  key={officer.badge}
                  type="button"
                  onClick={() => handleQuickOfficerLogin(officer)}
                  disabled={isLoading}
                  className="flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Login as ${officer.name} - ${officer.role}`}
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                      {officer.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {officer.role} • {officer.badge}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        )}

        {DEMO_OFFICER_ROLES.length > 0 && (
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] font-mono text-slate-500 uppercase shrink-0">
              or government credential login
            </span>
            <div className="border-t border-slate-800 w-full" />
          </div>
        )}

        {/* Standard Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label 
              htmlFor="email-input"
              className="block text-slate-300 font-medium mb-1"
            >
              Official NIC / Agency Email
            </label>
            <div className="relative">
              <Mail 
                className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" 
                aria-hidden="true"
              />
              <input
                id="email-input"
                type="email"
                placeholder="officer@ndma.gov.in"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(''); // Clear error on user input
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                required
                disabled={isLoading}
                autoComplete="email"
                aria-invalid={!!error}
                aria-describedby={error ? 'error-message' : undefined}
              />
            </div>
          </div>

          <div>
            <label 
              htmlFor="password-input"
              className="block text-slate-300 font-medium mb-1"
            >
              Security Token / Password
            </label>
            <div className="relative">
              <Lock 
                className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" 
                aria-hidden="true"
              />
              <input
                id="password-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(''); // Clear error on user input
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                required
                disabled={isLoading}
                autoComplete="current-password"
                aria-invalid={!!error}
                aria-describedby={error ? 'error-message' : undefined}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-600/50 text-white rounded-xl font-bold shadow-md shadow-cyan-600/20 transition-all text-xs flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            aria-busy={isLoading}
          >
            {isLoading && <Loader className="w-4 h-4 animate-spin" aria-hidden="true" />}
            {isLoading ? 'Authenticating...' : 'Authenticate Official Session'}
          </button>

          <p className="text-[10px] text-slate-500 text-center">
            Secure government authentication • End-to-end encrypted
          </p>
        </form>

      </div>
    </div>
  );
};
