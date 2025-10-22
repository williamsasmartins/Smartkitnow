import React from "react";

 type Props = {
   left: React.ReactNode;   // editorial (canto esquerdo)
   center: React.ReactNode; // calculadora (coluna central, sticky)
   showTopAd?: boolean;     // banner topo opcional
   showRightAd?: boolean;   // rail direito opcional
   right?: React.ReactNode; // conteúdo custom da rail (senão placeholder)
   /** opcional: deslocamento do sticky (altura do header) */
   stickyOffsetPx?: number; // default 80
 };
 
 export default function PetCalculatorPageLayout({
   left,
   center,
   showTopAd = true,
   showRightAd = true,
   right,
   stickyOffsetPx = 88, // altura típica do Header; ajuste se mudar
 }: Props) {
   return (
     <div
       className="w-screen max-w-none mx-0 pl-4 md:pl-8 pr-2 md:pr-4 py-6 relative"
       style={{ overflow: "visible", transform: "none" }} // garante que sticky funcione e não seja afetado por transform
     >
       {/* Top banner (placeholder de ad) */}
       {showTopAd && (
         <div className="mb-4 rounded-md border border-dashed border-border/60 bg-muted/30 p-3 text-center text-xs text-muted-foreground">
           Ad — Top Banner (placeholder)
         </div>
       )}
 
       {/* Grid 3 colunas: esquerda (estreita) / centro (calc sticky) / direita (rail) */}
       <div
         className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(200px,400px)_minmax(400px,440px)_minmax(180px,220px)] items-start"
         style={{ overflow: "visible" }} // evita quebrar sticky
       >
         {/* ESQUERDA */}
         <section className="order-2 md:order-1 overflow-visible">
           {left}
         </section>
 
         {/* CENTRO (calculadora sticky) */}
         <aside className="order-1 md:order-2 self-start overflow-visible">
           <div
             className="md:sticky"
             style={{ top: stickyOffsetPx, overflow: "visible" }}
           >
             {center}
           </div>
         </aside>
 
         {/* DIREITA (rail) */}
         <aside className="order-3 hidden md:block self-start overflow-visible">
           {showRightAd ? (
             right ?? (
               <div
                 className="rounded-md border border-dashed border-border/60 bg-muted/30 p-2 text-center text-[10px] text-muted-foreground"
                 style={{ position: "sticky", top: stickyOffsetPx, height: 600, overflow: "visible" }}
               >
                 Ad — Right Rail (placeholder)
               </div>
             )
           ) : null}
         </aside>
       </div>
     </div>
   );
 }