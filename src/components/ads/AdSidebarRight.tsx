import React, { useEffect } from "react";


export default function AdSidebarRight({ topOffset = 0 }: { topOffset?: number }) {
  useEffect(() => {
    // // @ts-ignore
    // window.adsbygoogle = window.adsbygoogle || [];
    // // @ts-ignore
    // window.adsbygoogle.push({});
  }, []);

  return (
    <aside className="hidden lg:block lg:w-[320px]">
      <div className="sticky space-y-4" style={{ top: topOffset }}>
        <div className="w-[300px] h-[600px] border rounded-md bg-muted/40 text-muted-foreground grid place-items-center">
          <span className="text-xs">Sidebar Ad (300×600)</span>
        </div>
        <div className="w-[300px] h-[250px] border rounded-md bg-muted/40 text-muted-foreground grid place-items-center">
          <span className="text-xs">Sidebar Ad (300×250)</span>
        </div>


      </div>
    </aside>
  );
}