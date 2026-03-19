#!/usr/bin/env node

/**
 * SmartKitNow SEO Implementation Script
 * 
 * Este script pega os arquivos gerados pelo Antigravity (CSVs e JSONs)
 * e aplica automaticamente no seu projeto.
 * 
 * Uso: node implement-seo.js
 * 
 * Compatível com: Next.js, React, HTML estático, ou qualquer framework
 */

const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURAÇÃO - AJUSTE PARA SEU PROJETO
// ============================================

const CONFIG = {
  // Pasta onde o Antigravity salvou os outputs
  outputDir: './output',
  
  // Pasta das suas páginas (ajuste conforme seu framework)
  pagesDir: './src/pages',  // Next.js pages router
  // pagesDir: './src/app',  // Next.js app router
  // pagesDir: './pages',    // Outro
  
  // Tipo de projeto
  projectType: 'nextjs', // 'nextjs' | 'react' | 'html' | 'custom'
  
  // Arquivo de configuração de SEO (se usar um centralizado)
  seoConfigFile: './src/config/seo.json',
  
  // Gerar componente Head customizado?
  generateHeadComponent: true,
  
  // Backup antes de modificar?
  createBackup: true,
};

// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

/**
 * Lê todos os CSVs de meta tags do output
 */
function readMetaTagsFromCSVs() {
  const metaTags = [];
  const files = fs.readdirSync(CONFIG.outputDir);
  
  files.filter(f => f.endsWith('_meta_tags.csv')).forEach(file => {
    const content = fs.readFileSync(path.join(CONFIG.outputDir, file), 'utf-8');
    const lines = content.split('\n').slice(1); // Skip header
    
    lines.forEach(line => {
      if (!line.trim()) return;
      const [url, currentTitle, optimizedTitle, currentMeta, optimizedMeta] = parseCSVLine(line);
      
      metaTags.push({
        url,
        slug: extractSlug(url),
        category: extractCategory(url),
        title: optimizedTitle,
        description: optimizedMeta,
      });
    });
  });
  
  console.log(`✓ Carregados ${metaTags.length} meta tags de ${files.length} arquivos`);
  return metaTags;
}

/**
 * Lê todos os schemas JSON do output
 */
function readSchemasFromJSON() {
  const schemas = {};
  const files = fs.readdirSync(CONFIG.outputDir);
  
  files.filter(f => f.endsWith('_schemas.json')).forEach(file => {
    const content = JSON.parse(fs.readFileSync(path.join(CONFIG.outputDir, file), 'utf-8'));
    Object.assign(schemas, content);
  });
  
  console.log(`✓ Carregados schemas para ${Object.keys(schemas).length} páginas`);
  return schemas;
}

/**
 * Gera arquivo de configuração SEO centralizado
 */
function generateSEOConfig(metaTags, schemas) {
  const config = {};
  
  metaTags.forEach(meta => {
    const key = meta.slug || meta.url;
    config[key] = {
      title: meta.title,
      description: meta.description,
      schema: schemas[meta.url] || null,
      url: meta.url,
      category: meta.category,
    };
  });
  
  const dir = path.dirname(CONFIG.seoConfigFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(CONFIG.seoConfigFile, JSON.stringify(config, null, 2));
  console.log(`✓ Gerado ${CONFIG.seoConfigFile} com ${Object.keys(config).length} entradas`);
  
  return config;
}

/**
 * Gera componente SEO Head para Next.js
 */
function generateNextJsSEOComponent() {
  const component = `
// components/SEOHead.jsx
// Gerado automaticamente pelo script de implementação SEO
// Uso: <SEOHead slug="dog-calorie-calculator" />

import Head from 'next/head';
import seoConfig from '@/config/seo.json';

export default function SEOHead({ slug, customTitle, customDescription }) {
  const seo = seoConfig[slug] || {};
  
  const title = customTitle || seo.title || 'SmartKitNow - Free Online Calculators';
  const description = customDescription || seo.description || 'Free online calculators for every need.';
  const schema = seo.schema || null;
  
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
      
      {/* Schema.org JSON-LD */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  );
}

// Hook para usar em qualquer componente
export function useSEO(slug) {
  return seoConfig[slug] || null;
}
`;

  fs.writeFileSync('./src/components/SEOHead.jsx', component);
  console.log('✓ Gerado componente SEOHead.jsx');
}

/**
 * Gera componente SEO para React (sem Next.js)
 */
function generateReactSEOComponent() {
  const component = `
// components/SEOHead.jsx
// Gerado automaticamente pelo script de implementação SEO
// Uso: <SEOHead slug="dog-calorie-calculator" />

import { Helmet } from 'react-helmet-async';
import seoConfig from '../config/seo.json';

export default function SEOHead({ slug, customTitle, customDescription }) {
  const seo = seoConfig[slug] || {};
  
  const title = customTitle || seo.title || 'SmartKitNow - Free Online Calculators';
  const description = customDescription || seo.description || 'Free online calculators for every need.';
  const schema = seo.schema || null;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

export default SEOHead;
`;

  fs.writeFileSync('./src/components/SEOHead.jsx', component);
  console.log('✓ Gerado componente SEOHead.jsx (React/Helmet)');
}

/**
 * Gera arquivo HTML de includes para sites estáticos
 */
function generateHTMLIncludes(metaTags, schemas) {
  const outputDir = './seo-includes';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  metaTags.forEach(meta => {
    const slug = meta.slug;
    const schema = schemas[meta.url] || {};
    
    const html = `<!-- SEO Include for ${slug} -->
<!-- Cole isso no <head> da página ${meta.url} -->

<title>${meta.title}</title>
<meta name="description" content="${meta.description}">

<!-- Open Graph -->
<meta property="og:title" content="${meta.title}">
<meta property="og:description" content="${meta.description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${meta.url}">
<meta property="og:site_name" content="SmartKitNow">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${meta.title}">
<meta name="twitter:description" content="${meta.description}">

<!-- Schema.org JSON-LD -->
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
`;
    
    fs.writeFileSync(path.join(outputDir, `${slug}.html`), html);
  });
  
  console.log(`✓ Gerados ${metaTags.length} arquivos HTML em ${outputDir}/`);
}

/**
 * Gera sitemap atualizado
 */
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
    const priority = meta.category === 'sports' || meta.category === 'financial' || 
                     meta.category === 'health' ? '0.8' : '0.6';
    
    sitemap += `  <url>
    <loc>${meta.url}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority}</priority>
  </url>
`;
  });

  sitemap += '</urlset>';
  
  fs.writeFileSync('./public/sitemap.xml', sitemap);
  console.log(`✓ Gerado sitemap.xml com ${metaTags.length + 1} URLs`);
}

/**
 * Gera robots.txt otimizado
 */
function generateRobotsTxt() {
  const robots = `# SmartKitNow Robots.txt
# Gerado automaticamente

User-agent: *
Allow: /

# Sitemaps
Sitemap: https://www.smartkitnow.com/sitemap.xml

# Crawl-delay (opcional)
Crawl-delay: 1

# Bloquear páginas não importantes
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
`;

  fs.writeFileSync('./public/robots.txt', robots);
  console.log('✓ Gerado robots.txt otimizado');
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

function extractSlug(url) {
  const parts = url.replace('https://www.smartkitnow.com/', '').split('/');
  return parts[parts.length - 1] || parts[parts.length - 2] || 'index';
}

function extractCategory(url) {
  const parts = url.replace('https://www.smartkitnow.com/', '').split('/');
  return parts[0] || 'home';
}

function createBackup() {
  const backupDir = `./backup-${Date.now()}`;
  
  if (fs.existsSync(CONFIG.seoConfigFile)) {
    fs.mkdirSync(backupDir, { recursive: true });
    fs.copyFileSync(CONFIG.seoConfigFile, path.join(backupDir, 'seo.json'));
    console.log(`✓ Backup criado em ${backupDir}/`);
  }
}

// ============================================
// EXECUÇÃO PRINCIPAL
// ============================================

async function main() {
  console.log('\n🚀 SmartKitNow SEO Implementation Script\n');
  console.log('=' .repeat(50));
  
  // Verificar se pasta output existe
  if (!fs.existsSync(CONFIG.outputDir)) {
    console.error(`❌ Pasta ${CONFIG.outputDir} não encontrada!`);
    console.log('   Execute primeiro o prompt no Antigravity para gerar os arquivos.');
    process.exit(1);
  }
  
  // Criar backup se configurado
  if (CONFIG.createBackup) {
    createBackup();
  }
  
  // Ler dados gerados pelo Antigravity
  console.log('\n📂 Lendo arquivos do Antigravity...\n');
  const metaTags = readMetaTagsFromCSVs();
  const schemas = readSchemasFromJSON();
  
  // Gerar configuração centralizada
  console.log('\n⚙️  Gerando configurações...\n');
  generateSEOConfig(metaTags, schemas);
  
  // Gerar componentes baseado no tipo de projeto
  if (CONFIG.generateHeadComponent) {
    console.log('\n🧩 Gerando componentes...\n');
    
    switch (CONFIG.projectType) {
      case 'nextjs':
        generateNextJsSEOComponent();
        break;
      case 'react':
        generateReactSEOComponent();
        break;
      case 'html':
        generateHTMLIncludes(metaTags, schemas);
        break;
      default:
        generateHTMLIncludes(metaTags, schemas);
    }
  }
  
  // Gerar sitemap e robots.txt
  console.log('\n🗺️  Gerando arquivos de SEO...\n');
  generateSitemap(metaTags);
  generateRobotsTxt();
  
  // Resumo final
  console.log('\n' + '=' .repeat(50));
  console.log('✅ IMPLEMENTAÇÃO CONCLUÍDA!\n');
  console.log('Próximos passos:');
  console.log('1. Revise os arquivos gerados');
  console.log('2. Importe o componente SEOHead nas suas páginas');
  console.log('3. Faça deploy e teste no Google Search Console');
  console.log('\n');
}

main().catch(console.error);
