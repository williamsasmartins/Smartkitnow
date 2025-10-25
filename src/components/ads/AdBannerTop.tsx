import React, { useEffect } from "react";

/**
 * Placeholder for Google AdSense top banner.
 * Replace the div with your <ins class="adsbygoogle"> and push script when you add your client/slot.
 */
export default function AdBannerTop() {
  useEffect(() => {
    // If using AdSense, uncomment after adding global script in index.html
    // // @ts-ignore
    // window.adsbygoogle = window.adsbygoogle || [];
    // // @ts-ignore
    // window.adsbygoogle.push({});
  }, []);

  return (
    <div className="w-full flex items-center justify-center py-3">
      <div className="w-full max-w-[970px] h-[90px] border rounded-md bg-muted/40 text-muted-foreground grid place-items-center">
        <span className="text-xs">Top Banner Ad (970×90 / 728×90 / 320×100)</span>
      </div>
    </div>
  );
}