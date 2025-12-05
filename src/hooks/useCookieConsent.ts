import { useState, useEffect } from 'react';

export type CookieConsent = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp?: string;
};

const CONSENT_KEY = 'skn_cookie_consent';

export const defaultConsent: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const loadConsent = () => {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        try {
          setConsent(JSON.parse(stored));
          setShowBanner(false);
        } catch (e) {
          setShowBanner(true);
        }
      } else {
        setShowBanner(true);
      }
    };

    loadConsent();

    const handleUpdate = () => loadConsent();
    window.addEventListener('cookie-consent-updated', handleUpdate);
    
    return () => {
      window.removeEventListener('cookie-consent-updated', handleUpdate);
    };
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    const consentWithTimestamp = {
      ...newConsent,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentWithTimestamp));
    setConsent(consentWithTimestamp);
    setShowBanner(false);
    
    // Trigger custom event so other components update immediately
    window.dispatchEvent(new Event('cookie-consent-updated'));

    // Update GTM/Partytown Consent
    if (typeof (window as any).updateConsent === 'function') {
      (window as any).updateConsent({
        analytics_storage: newConsent.analytics ? 'granted' : 'denied',
        ad_storage: newConsent.marketing ? 'granted' : 'denied',
        ad_user_data: newConsent.marketing ? 'granted' : 'denied',
        ad_personalization: newConsent.marketing ? 'granted' : 'denied',
      });
    }
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  return {
    consent,
    showBanner,
    saveConsent,
    acceptAll,
    rejectAll,
  };
}


