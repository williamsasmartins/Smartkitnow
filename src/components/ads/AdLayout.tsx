import { AdSense } from "./AdSense";

interface AdLayoutProps {
  children: React.ReactNode;
  showCenterAd?: boolean;
}

export function AdLayout({ children, showCenterAd = true }: AdLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Top Ad */}
      <div className="w-full py-4 px-4">
        <AdSense slot="ad-top-center" size="top-banner" />
      </div>

      {/* Main Content with Side Ads */}
      <div className="relative">
        {/* Left Side Ad - Desktop Only */}
        <div className="hidden xl:block fixed left-2 top-1/2 transform -translate-y-1/2 z-10">
          <AdSense slot="ad-left-side" size="side-banner" />
        </div>

        {/* Right Side Ad - Desktop Only */}
        <div className="hidden xl:block fixed right-2 top-1/2 transform -translate-y-1/2 z-10">
          <AdSense slot="ad-right-side" size="side-banner" />
        </div>

        {/* Central Content Area */}
        <div className="xl:mx-[320px] mx-auto max-w-7xl px-4">
          {children}
          
          {/* Center Ad (appears between content) */}
          {showCenterAd && (
            <div className="py-8 hidden sm:block">
              <AdSense slot="ad-center" size="center-banner" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Ad */}
      <div className="w-full py-4 px-4">
        <AdSense slot="ad-bottom" size="bottom-banner" />
      </div>
    </div>
  );
}