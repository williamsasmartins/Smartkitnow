#!/usr/bin/env node

/**
 * SmartKitNow SEO Implementation Script v2
 * Ajustado para o formato CSV gerado pelo Antigravity
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  outputDir: './output',
  seoConfigFile: './src/config/seo.json',
  projectType: 'nextjs',
  createBackup: true,
};

// Lê CSV com o formato do Antigravity
function readMetaTagsFromCSVs() {
  const metaTags = [];
  const files = fs.readdirSync(CONFIG.outputDir);
  const csvFiles = files.filter(f => f.endsWith('_optimized.csv'));

  console.log(`   Encontrados ${csvFiles.length} arquivos CSV`);

  csvFiles.forEach(file => {
    const content = fs.readFileSync(path.join(CONFIG.outputDir, file), 'utf-8');
    const lines = content.split('\n');
    const header = lines[0];

    // Pular header
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        // Parse CSV considerando campos com JSON (que têm vírgulas dentro)
        const parsed = parseCSVLineWithJSON(line);

        if (parsed && parsed.url) {
          metaTags.push({
            url: parsed.url,
            slug: parsed.slug,
            category: parsed.category,
            title: parsed.title,
            description: parsed.description,
            webAppSchema: parsed.webAppSchema,
            faqSchema: parsed.faqSchema,
          });
        }
      } catch (e) {
        // Skip linhas com problema
      }
    }
  });

  console.log(`   ✓ Carregados ${metaTags.length} meta tags`);
  return metaTags;
}

// Parser especial para CSV com campos JSON
function parseCSVLineWithJSON(line) {
  // Formato: URL,Category,Page_Slug,Optimized_Title,Optimized_Meta,WebApp_Schema,FAQ_Schema
  // Os schemas são JSON com aspas escapadas

  const result = {
    url: '',
    category: '',
    slug: '',
    title: '',
    description: '',
    webAppSchema: null,
    faqSchema: null
  };

  // Encontrar os JSONs (começam com "{" e terminam com "}")
  const firstJsonStart = line.indexOf(',"{');

  if (firstJsonStart === -1) {
    // Sem JSON, parse normal
    const parts = line.split(',');
    result.url = parts[0] || '';
    result.category = parts[1] || '';
    result.slug = parts[2] || '';
    result.title = parts[3] || '';
    result.description = parts[4] || '';
    return result;
  }

  // Parte antes dos JSONs
  const beforeJson = line.substring(0, firstJsonStart);
  const parts = beforeJson.split(',');

  result.url = parts[0] || '';
  result.category = parts[1] || '';
  result.slug = parts[2] || '';
  result.title = (parts[3] || '').replace(/\.\.\.$/, '').trim();
  result.description = (parts[4] || '').replace(/\[tool\]/g, result.slug.replace(/-/g, ' ')).replace(/\[sport\]/g, 'sports');

  // Extrair JSONs
  const jsonPart = line.substring(firstJsonStart + 1);

  // Encontrar o primeiro JSON (WebApp)
  const webAppMatch = jsonPart.match(/^"(\{.*?\})",(.*)/s);
  if (webAppMatch) {
    try {
      const webAppStr = webAppMatch[1].replace(/""/g, '"');
      result.webAppSchema = JSON.parse(webAppStr);
    } catch (e) { }

    // FAQ schema é o resto
    const faqPart = webAppMatch[2];
    if (faqPart && faqPart.startsWith('"')) {
      try {
        const faqStr = faqPart.slice(1, -1).replace(/""/g, '"');
        result.faqSchema = JSON.parse(faqStr);
      } catch (e) { }
    }
  }

  return result;
}

// Gera arquivo de configuração SEO centralizado
function generateSEOConfig(metaTags) {
  const config = {};

  metaTags.forEach(meta => {
    const key = meta.slug || meta.url.split('/').pop();
    config[key] = {
      title: meta.title,
      description: meta.description,
      url: meta.url,
      category: meta.category,
      schema: {
        webApp: meta.webAppSchema,
        faq: meta.faqSchema
      }
    };
  });

  const dir = path.dirname(CONFIG.seoConfigFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(CONFIG.seoConfigFile, JSON.stringify(config, null, 2));
  console.log(`   ✓ Gerado ${CONFIG.seoConfigFile} com ${Object.keys(config).length} entradas`);

  return config;
}

// Gera componente SEO Head para Next.js
function generateNextJsSEOComponent() {
  const component = `// components/SEOHead.jsx
// Gerado automaticamente pelo script de implementação SEO

import Head from 'next/head';
import seoConfig from '@/config/seo.json';

export default function SEOHead({ slug, customTitle, customDescription }) {
  const seo = seoConfig[slug] || {};
  
  const title = customTitle || seo.title || 'SmartKitNow - Free Online Calculators';
  const description = customDescription || seo.description || 'Free online calculators for every need.';
  const schemas = seo.schema || {};
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seo.url || ''} />
      <meta property="og:site_name" content="SmartKitNow" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Schema.org JSON-LD - WebApplication */}
      {schemas.webApp && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.webApp) }}
        />
      )}
      
      {/* Schema.org JSON-LD - FAQ */}
      {schemas.faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }}
        />
      )}
    </Head>
  );
}

export function useSEO(slug) {
  return seoConfig[slug] || null;
}
`;

  const dir = './src/components';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync('./src/components/SEOHead.jsx', component);
  console.log('   ✓ Gerado componente SEOHead.jsx');
}

// Gera sitemap
function generateSitemap(metaTags) {
  const today = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.smartkitnow.com/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>
`;

  metaTags.forEach(meta => {
    const priority = ['sports', 'financial', 'health', 'video', 'conversion'].includes(meta.category?.toLowerCase())
      ? '0.8' : '0.6';

    sitemap += `  <url>
    <loc>${meta.url}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority}</priority>
  </url>
`;
  });

  sitemap += '</urlset>';

  const publicDir = './public';
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync('./public/sitemap.xml', sitemap);
  console.log(`   ✓ Gerado sitemap.xml com ${metaTags.length + 1} URLs`);
}

// Gera robots.txt
function generateRobotsTxt() {
  const robots = `# SmartKitNow Robots.txt
User-agent: *
Allow: /

Sitemap: https://www.smartkitnow.com/sitemap.xml

Disallow: /api/
Disallow: /_next/
`;

  fs.writeFileSync('./public/robots.txt', robots);
  console.log('   ✓ Gerado robots.txt');
}

// Main
async function main() {
  console.log('\n🚀 SmartKitNow SEO Implementation Script v2\n');
  console.log('='.repeat(50));

  if (!fs.existsSync(CONFIG.outputDir)) {
    console.error(`\n❌ Pasta ${CONFIG.outputDir} não encontrada!`);
    process.exit(1);
  }

  console.log('\n📂 Lendo arquivos do Antigravity...\n');
  const metaTags = readMetaTagsFromCSVs();

  if (metaTags.length === 0) {
    console.error('\n❌ Nenhum meta tag encontrado nos CSVs!');
    process.exit(1);
  }

  console.log('\n⚙️  Gerando configurações...\n');
  generateSEOConfig(metaTags);

  console.log('\n🧩 Gerando componentes...\n');
  generateNextJsSEOComponent();

  console.log('\n🗺️  Gerando arquivos de SEO...\n');
  generateSitemap(metaTags);
  generateRobotsTxt();

  console.log('\n' + '='.repeat(50));
  console.log('\n✅ IMPLEMENTAÇÃO CONCLUÍDA!\n');
  console.log(`   📊 ${metaTags.length} páginas processadas`);
  console.log('   📁 Arquivos gerados:');
  console.log('      - src/config/seo.json');
  console.log('      - src/components/SEOHead.jsx');
  console.log('      - public/sitemap.xml');
  console.log('      - public/robots.txt\n');
}

main().catch(console.error);
