import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Adicione isso
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter> {/* ✅ Envolve todo o App */}
    <App />
  </BrowserRouter>
);
