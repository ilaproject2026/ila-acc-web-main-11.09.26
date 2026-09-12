import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('gdpr_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gdpr_cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('gdpr_cookie_consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-700/80 shadow-2xl px-4 sm:px-6 py-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Icon & Text */}
        <div className="flex items-start sm:items-center gap-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
          <div className="w-9 h-9 rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Cookie className="w-5 h-5" />
          </div>
          <p className="max-w-3xl">
            Let us help you find the right solution on our site. We use cookies to improve your experience, personalize content, and analyze site traffic.{' '}
            <a 
              href="#privacy-policy" 
              className="text-brand-400 hover:text-brand-300 font-bold underline underline-offset-2 transition-colors inline-flex items-center gap-1"
            >
              Privacy Policy
            </a>.
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={handleDecline}
            className="flex-1 md:flex-none px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white border border-slate-600/80 hover:border-slate-500 rounded-xl hover:bg-slate-800 transition-all cursor-pointer text-center"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 md:flex-none px-5 py-2.5 text-xs font-black text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Accept All Cookies</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CookieBanner;
