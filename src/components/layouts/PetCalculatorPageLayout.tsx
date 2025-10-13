import React from "react";
 
 type Props = {
   /** Coluna esquerda: conteúdo editorial (How to use, How it works, Tables, FAQs, Sources) */
   left: React.ReactNode;
   /** Coluna central: Painel da calculadora (fica sticky) */
   center: React.ReactNode;
   /** Mostrar banner topo (placeholder) */
   showTopAd?: boolean;
   /** Mostrar rail direito (placeholder) */
   showRightAd?: boolean;
   /** Conteúdo (opcional) do rail direito, senão renderiza placeholder */
   right?: React.ReactNode;
 };
 
 /** Grid responsivo:
  *  - Topo: (opcional) banner
  *  - md+: 12 colunas → esquerda (7), centro sticky (4), direita rail (1)
  *  - sm: tudo empilhado
  */
 export default function PetCalculatorPageLayout({
   left,
   center,
   right,
   showTopAd = false,
   showRightAd = false,
 }: Props) {
   return (
     <div className="mx-auto w-full max-w-7xl px-4 py-6">
       {/* Banner topo opcional */}
       {showTopAd && (
         <div className="mb-4 rounded-md border border-dashed border-border/60 bg-muted/30 p-3 text-center text-xs text-muted-foreground">
           {/* Substitua por <AdSlot position="top" size="728x90" /> se já existir */}
           Ad — Top Banner (placeholder)
         </div>
       )}

       <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
         {/* Esquerda: artigo */}
         <section className="md:col-span-7 order-2 md:order-1">{left}</section>

         {/* Centro: calculadora sticky */}
         <aside className="md:col-span-4 order-1 md:order-2">
           <div className="md:sticky md:top-20">{center}</div>
         </aside>

         {/* Direita: rail opcional */}
         <aside className="md:col-span-1 order-3 hidden md:block">
           {showRightAd ? (
             right ?? (
               <div className="sticky top-20 h-[600px] rounded-md border border-dashed border-border/60 bg-muted/30 p-2 text-center text-[10px] text-muted-foreground">
                 {/* Substitua por <AdSlot position="right-rail" size="120x600" /> se já existir */}
                 Ad — Right Rail (placeholder)
               </div>
             )
           ) : null}
         </aside>
       </div>
     </div>
   );
 }