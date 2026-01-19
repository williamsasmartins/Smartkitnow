import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title: string;
    description?: string;
    canonical?: string;
    type?: string;
    name?: string;
    image?: string;
    robots?: string;
}

export function SEO({
    title,
    description,
    canonical,
    type = 'website',
    name = 'Smart Kit Now',
    image = '/favicon.png',
    robots = 'index, follow'
}: SEOProps) {
    const location = useLocation();
    const siteTitle = 'Smart Kit Now';
    const baseUrl = 'https://www.smartkitnow.com';

    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
    const safeDescription = description || "Discover powerful smart tools and utilities designed to enhance your productivity and streamline your workflow.";

    // Generate absolute canonical URL
    const absoluteCanonical = canonical || `${baseUrl}${location.pathname}`;

    // Generate absolute image URL
    const absoluteImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={safeDescription} />
            <meta name="robots" content={robots} />
            <link rel="canonical" href={absoluteCanonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={absoluteCanonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={safeDescription} />
            <meta property="og:site_name" content={name} />
            <meta property="og:image" content={absoluteImage} />

            {/* Twitter */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={safeDescription} />
            <meta name="twitter:image" content={absoluteImage} />
        </Helmet>
    );
}
