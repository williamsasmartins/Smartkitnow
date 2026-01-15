import { Navigate, useParams } from "react-router-dom";

/**
 * Handles legacy 3-path URLs (/:category/:subcategory/:slug)
 * and redirects them to the new 2-path standard (/:category/:slug).
 * ensuring 301-like behavior logic for the client.
 */
export default function LegacyRedirect() {
    const { category, slug } = useParams();

    if (!category || !slug) {
        // Fallback to home if parameters are missing for some reason
        return <Navigate to="/" replace />;
    }

    // Redirect to the flat URL structure
    return <Navigate to={`/${category}/${slug}`} replace />;
}
