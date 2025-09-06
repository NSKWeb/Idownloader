'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === null) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (consentType) => {
    localStorage.setItem('cookie_consent', consentType);
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-900 bg-opacity-90 backdrop-blur-sm text-gray-900 dark:text-white p-4 z-50 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm mb-4 md:mb-0 md:mr-4">
          <p>
            We use cookies to ensure you get the best experience on our website. This site is ad-free and we do not use tracking cookies for marketing. See our{' '}
            <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
              Privacy Policy
            </Link>{' '}
            for more details.
          </p>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => handleConsent('accepted')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-300"
          >
            Accept
          </button>
          <button
            onClick={() => handleConsent('rejected')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-300"
          >
            Reject All
          </button>
           <button
            onClick={() => setShowBanner(false)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Dismiss"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
