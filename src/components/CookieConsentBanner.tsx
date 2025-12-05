import { Link } from 'react-router-dom';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectAll } = useCookieConsent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showBanner) {
      // Small delay for animation
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [showBanner]);

  if (!showBanner && !isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border p-4 shadow-lg transition-transform duration-500 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <p>
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies. 
            <Link to="/privacy" className="underline hover:text-foreground ml-1">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center shrink-0">
          <Link to="/cookie-settings">
            <Button variant="outline" size="sm">
              Customize
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={rejectAll}>
            Reject All
          </Button>
          <Button variant="default" size="sm" onClick={acceptAll}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
