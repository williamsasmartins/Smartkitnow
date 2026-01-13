import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    canonical?: string;
    type?: string;
    name?: string;
    image?: string;
}

export function SEO({
    title,
    description,
    canonical,
    type = 'website',
    name = 'Smart Kit Now',
    image = '/favicon.png'
}: SEOProps) {
    const siteTitle = 'Smart Kit Now';
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
    const safeDescription = description || "Discover powerful smart tools and utilities designed to enhance your productivity and streamline your workflow.";

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={safeDescription} />
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={safeDescription} />
            <meta property="og:site_name" content={name} />
            {image && <meta property="og:image" content={image} />}
            {/* Twitter */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={safeDescription} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
}
