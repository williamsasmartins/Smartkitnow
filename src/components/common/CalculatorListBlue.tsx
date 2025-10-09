import { Link } from "react-router-dom";
 
 type Item = { title: string; to: string };
 
 export default function CalculatorListBlue({ items, linkClassName }: { items: Item[]; linkClassName?: string }) {
   return (
     <ul className="skn-calc-list">
       {items.map((it) => (
         <li key={it.to}>
           <Link to={it.to} className={["skn-calc-link", linkClassName || ""].filter(Boolean).join(" ")}> 
             {it.title}
           </Link>
         </li>
       ))}
     </ul>
   );
 }