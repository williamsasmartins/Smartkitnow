import React from "react";
import { Navigate } from "react-router-dom";

// Redirect placeholder to keep TS happy when this file is opened by the editor.
// Recipes moved to the dedicated top-level page at /recipes (RecipePage).
export default function RecipesCategory() {
  return <Navigate to="/recipes" replace />;
}