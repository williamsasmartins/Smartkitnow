import { Link } from "react-router-dom";
 
 type Props = { 
   to: string; 
   children: React.ReactNode; 
   className?: string; 
   /** Optional className applied to the Link element for text color, etc. */
   linkClassName?: string;
 }; 
 
 export default function CalcLink({ to, children, className, linkClassName }: Props) { 
   return ( 
     <li className={["list-none", className].filter(Boolean).join(" ")}> 
       <Link 
         to={to} 
         className={[ 
           // block = linha ocupa a largura inteira 
           "block", 
           // padding inferior para dar respiro entre texto e linha 
           "pb-2", 
           // linha azul base (subtil) + reforço no hover/focus 
           "border-b border-[#3c83f6]/40 hover:border-[#3c83f6] focus:border-[#3c83f6]", 
           // acessibilidade do link 
           "outline-none focus-visible:ring-1 focus-visible:ring-[#3c83f6]/60", 
           // optional text color/style override
           linkClassName || "",
         ].join(" ")} 
       > 
         {children} 
       </Link> 
     </li> 
   ); 
 }