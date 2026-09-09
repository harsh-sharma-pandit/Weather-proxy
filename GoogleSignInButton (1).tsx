import React, { useState } from 'react';

export interface GoogleButtonConfig {
  mode: 'custom_graphic' | 'auto_render';
  theme: 'dark' | 'light' | 'neutral';
  width: number;
  height: number;
  borderRadius: number;
  longtitle: boolean;
  scope: string;
  buttonText?: string;
}

interface GoogleSignInButtonProps {
  config?: Partial<GoogleButtonConfig>;
  onSuccess?: (googleUser: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    idToken: string;
    scopes: string[];
  }) => void;
  onFailure?: (error: { message: string }) => void;
  className?: string;
  disabled?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  config,
  onSuccess,
  onFailure,
  className = '',
  disabled = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const finalConfig: GoogleButtonConfig = {
    mode: config?.mode || 'custom_graphic',
    theme: config?.theme || 'light',
    width: config?.width || 240,
    height: config?.height || 48,
    borderRadius: config?.borderRadius ?? 6,
    longtitle: config?.longtitle ?? true,
    scope: config?.scope || 'profile email',
    buttonText: config?.buttonText
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled || isLoading) return;

    setIsLoading(true);

    // Simulate Google Identity Services / GAPI auth2 attachClickHandler / signin2.render callback
    setTimeout(() => {
      setIsLoading(false);
      const mockGoogleUser = {
        id: '109823487192837419283',
        name: 'Harsh Sharma',
        email: 'sharma171harsh@gmail.com',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFkMm...ner_gov_token_2026',
        scopes: finalConfig.scope.split(' ')
      };

      if (onSuccess) {
        onSuccess(mockGoogleUser);
      }
    }, 600);
  };

  // Label text determination
  const displayText = finalConfig.buttonText || (finalConfig.longtitle ? 'Sign in with Google' : 'Google');

  // Theme-specific styles adhering to Google's Branding Guidelines
  const isDark = finalConfig.theme === 'dark';
  const isNeutral = finalConfig.theme === 'neutral';

  let bgClass = 'bg-white text-slate-800 border-slate-300';
  let hoverBg = 'hover:bg-slate-50';
  let activeBg = 'active:bg-slate-100';
  let textColor = '#3c4043';
  let iconBg = '#ffffff';

  if (isDark) {
    bgClass = 'bg-[#131314] text-white border-[#8e918f]/40';
    hoverBg = 'hover:bg-[#1f1f1f]';
    activeBg = 'active:bg-[#2b2b2b]';
    textColor = '#e3e3e3';
    iconBg = '#131314';
  } else if (isNeutral) {
    bgClass = 'bg-slate-900 text-slate-100 border-slate-700';
    hoverBg = 'hover:bg-slate-850';
    activeBg = 'active:bg-slate-800';
    textColor = '#f1f5f9';
    iconBg = 'transparent';
  }

  // Render official Google "G" 4-color SVG icon according to branding rules
  const GoogleGIcon = () => (
    <svg 
      className="shrink-0"
      width={Math.min(22, Math.max(18, finalConfig.height * 0.42))} 
      height={Math.min(22, Math.max(18, finalConfig.height * 0.42))} 
      viewBox="0 0 24 24"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );

  return (
    <div className={`inline-block ${className}`}>
      {/* Custom Graphic Implementation adhering to User prompt (#customBtn + Roboto font) */}
      <button
        type="button"
        id="customBtn"
        onClick={handleClick}
        disabled={disabled || isLoading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        style={{
          width: `${finalConfig.width}px`,
          height: `${finalConfig.height}px`,
          borderRadius: `${finalConfig.borderRadius}px`,
          color: textColor,
          fontFamily: "'Roboto', 'Plus Jakarta Sans', sans-serif",
          boxShadow: isHovered 
            ? '0 2px 6px rgba(0, 0, 0, 0.25)' 
            : '0 1px 2px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.18s ease-in-out',
        }}
        className={`relative flex items-center justify-center border select-none overflow-hidden font-medium text-sm leading-none transition-all cursor-pointer ${bgClass} ${hoverBg} ${activeBg} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${isLoading ? 'opacity-80' : ''}`}
      >
        {/* Left Google Icon wrapper */}
        <span 
          className="absolute left-2 top-0 bottom-0 flex items-center justify-center px-1"
          style={{ width: `${Math.max(36, finalConfig.height - 4)}px` }}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoogleGIcon />
          )}
        </span>

        {/* Button Label Text */}
        <span 
          className="font-medium tracking-normal text-center truncate px-3"
          style={{
            paddingLeft: `${Math.max(36, finalConfig.height - 4) + 6}px`,
            paddingRight: '12px',
            fontSize: finalConfig.height >= 50 ? '15px' : finalConfig.height <= 40 ? '13px' : '14px',
            fontWeight: 500
          }}
        >
          {isLoading ? 'Signing in...' : displayText}
        </span>
      </button>
    </div>
  );
};
