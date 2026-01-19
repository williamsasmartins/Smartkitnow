import { Helmet } from 'react-helmet-async';

interface RecipeSchemaProps {
    name: string;
    description: string;
    image?: string;
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    recipeYield?: string;
    recipeCategory?: string;
    recipeCuisine?: string;
    keywords?: string;
    recipeIngredient?: string[];
    recipeInstructions?: string[];
}

export function RecipeSchema({
    name,
    description,
    image = '/favicon.png',
    prepTime,
    cookTime,
    totalTime,
    recipeYield,
    recipeCategory = 'Recipe',
    recipeCuisine,
    keywords,
    recipeIngredient = [],
    recipeInstructions = []
}: RecipeSchemaProps) {
    const baseUrl = 'https://www.smartkitnow.com';
    const absoluteImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name,
        description,
        image: absoluteImage,
        author: {
            '@type': 'Organization',
            name: 'Smart Kit Now'
        },
        ...(prepTime && { prepTime }),
        ...(cookTime && { cookTime }),
        ...(totalTime && { totalTime }),
        ...(recipeYield && { recipeYield }),
        recipeCategory,
        ...(recipeCuisine && { recipeCuisine }),
        ...(keywords && { keywords }),
        ...(recipeIngredient.length > 0 && { recipeIngredient }),
        ...(recipeInstructions.length > 0 && {
            recipeInstructions: recipeInstructions.map((instruction, index) => ({
                '@type': 'HowToStep',
                position: index + 1,
                text: instruction
            }))
        }),
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.5',
            ratingCount: '100'
        }
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}
