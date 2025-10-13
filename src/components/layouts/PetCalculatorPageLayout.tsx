import React from "react";
 
 type Props = {
   left: React.ReactNode;   // editorial
   center: React.ReactNode; // calculadora (sticky)
   showTopAd?: boolean;     // banner topo opcional
 };
 
 export default function PetCalculatorPageLayout({
   left,
   center,
   showTopAd = false,
 }: Props) {
   return (
     // Container ocupa a largura total, ancorado no lado esquerdo
     <div className="w-screen max-w-none mx-0 px-2 sm:px-4 md:pl-6 md:pr-4 py-6">
       {/* Top banner (opcional) */}
       {showTopAd && (
         <div className="mb-4 rounded-md border border-dashed border-border/60 bg-muted/30 p-3 text-center text-xs text-muted-foreground">
           Ad — Top Banner (placeholder)
         </div>
       )}
 
       {/* 2 colunas: esquerda flexível + direita largura controlada */}
       <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(520px,600px)]">
         {/* Esquerda (artigo) */}
         <section className="order-2 md:order-1">
           {left}
         </section>
 
         {/* Direita (calculadora) — sticky e com largura estável */}
         <aside className="order-1 md:order-2">
           <div className="md:sticky md:top-16">
             {center}
           </div>
         </aside>
       </div>
     </div>
   );
 }