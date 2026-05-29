import { useState, useEffect } from 'react';
import { useCookieConsent, defaultConsent, CookieConsent } from '@/hooks/useCookieConsent';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

export default function CookieSettings() {
  const { consent, saveConsent } = useCookieConsent();
  const [localConsent, setLocalConsent] = useState<CookieConsent>(defaultConsent);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (consent) {
      setLocalConsent(consent);
    }
  }, [consent]);

  const handleSave = () => {
    saveConsent(localConsent);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateCategory = (category: keyof CookieConsent, value: boolean) => {
    setLocalConsent(prev => ({
      ...prev,
      [category]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title="Cookie Settings | Smart Kit Now"
        description="Manage your cookie preferences for Smart Kit Now."
        robots="noindex, follow"
      />
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-4xl font-bold text-foreground text-center">Cookie Settings</h1>
          <p className="mb-8 text-center text-muted-foreground">
            Manage your cookie preferences here. Essential cookies are required for the website to function properly.
          </p>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl">Essential Cookies</CardTitle>
                  <CardDescription>Strictly necessary for the site to work.</CardDescription>
                </div>
                <Switch checked={true} disabled />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl">Analytics Cookies</CardTitle>
                  <CardDescription>Help us improve our website.</CardDescription>
                </div>
                <Switch 
                  checked={localConsent.analytics} 
                  onCheckedChange={(c) => updateCategory('analytics', c)} 
                />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl">Marketing Cookies</CardTitle>
                  <CardDescription>Used to deliver relevant ads.</CardDescription>
                </div>
                <Switch 
                  checked={localConsent.marketing} 
                  onCheckedChange={(c) => updateCategory('marketing', c)} 
                />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} size="lg" className="min-w-[150px]">
                {saved ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Saved
                  </>
                ) : (
                  "Save Preferences"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export const pageMeta = { allowAds: false, minContentScore: 1 };

