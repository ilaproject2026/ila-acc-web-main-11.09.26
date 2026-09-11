import React, { useState, useEffect } from 'react';

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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 flex flex-col sm:flex-row items-center justify-between shadow-lg">
      <div className="mb-4 sm:mb-0 text-sm md:text-base max-w-4xl">
        <p>
          Let us help you find the right solution on our site. We use cookies to improve your experience and deliver better results.{' '}
          <a href="#privacy-policy" className="text-blue-400 hover:underline font-semibold">
            Privacy Policy
          </a>.
        </p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleDecline}
          className="px-4 py-2 text-sm border border-gray-500 rounded hover:bg-gray-800 transition-colors"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-2 text-sm bg-blue-600 rounded hover:bg-blue-700 transition-colors font-medium"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
