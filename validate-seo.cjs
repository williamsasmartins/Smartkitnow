#!/usr/bin/env node

/**
 * SmartKitNow - SEO Validation Script
 * 
 * Valida se todas as otimizações de SEO foram implementadas corretamente.
 * 
 * Uso: node validate-seo.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ============================================
// CONFIGURAÇÃO
// ============================================

const CONFIG = {
  seoConfigPath: './src/config/seo.json',
  siteUrl: 'https://www.smartkitnow.com',
  localUrl: 'http://localhost:3000', // Para testar localmente
  testLocal: true, // Se false, testa o site em produção
  maxPagesToTest: 20, // Limitar para testes rápidos
};

// ============================================
// VALIDADORES
// ============================================

/**
 * Valida se o arquivo de config existe e está correto
 */
function validateConfigFile() {
  console.log('\n📋 Validando arquivo de configuração...\n');
  
  const issues = [];
  
  if (!fs.existsSync(CONFIG.seoConfigPath)) {
    issues.push('❌ Arquivo seo.json não encontrado');
    return issues;
  }
  
  const config = JSON.parse(fs.readFileSync(CONFIG.seoConfigPath, 'utf-8'));
  const entries = Object.entries(config);
  
  console.log(`   Total de entradas: ${entries.length}`);
  
  let missingTitles = 0;
  let missingDescriptions = 0;
  let longTitles = 0;
  let longDescriptions = 0;
  let missingSchemas = 0;
  
  entries.forEach(([slug, seo]) => {
    if (!seo.title) missingTitles++;
    if (!seo.description) missingDescriptions++;
    if (seo.title && seo.title.length > 60) longTitles++;
    if (seo.description && seo.description.length > 160) longDescriptions++;
    if (!seo.schema) missingSchemas++;
  });
  
  if (missingTitles > 0) issues.push(`⚠️  ${missingTitles} páginas sem título`);
  if (missingDescriptions > 0) issues.push(`⚠️  ${missingDescriptions} páginas sem description`);
  if (longTitles > 0) issues.push(`⚠️  ${longTitles} títulos com mais de 60 caracteres`);
  if (longDescriptions > 0) issues.push(`⚠️  ${longDescriptions} descriptions com mais de 160 caracteres`);
  if (missingSchemas > 0) issues.push(`⚠️  ${missingSchemas} páginas sem schema markup`);
  
  if (issues.length === 0) {
    console.log('   ✅ Arquivo de configuração válido!');
  }
  
  return issues;
}

/**
 * Valida se o componente SEOHead existe
 */
function validateComponents() {
  console.log('\n🧩 Validando componentes...\n');
  
  const issues = [];
  const possiblePaths = [
    './src/components/SEOHead.jsx',
    './src/components/SEOHead.tsx',
    './components/SEOHead.jsx',
    './components/SEOHead.tsx',
  ];
  
  const found = possiblePaths.find(p => fs.existsSync(p));
  
  if (found) {
    console.log(`   ✅ Componente encontrado: ${found}`);
    
    // Verificar conteúdo básico
    const content = fs.readFileSync(found, 'utf-8');
    
    if (!content.includes('title')) {
      issues.push('⚠️  Componente não parece incluir title');
    }
    if (!content.includes('description')) {
      issues.push('⚠️  Componente não parece incluir description');
    }
    if (!content.includes('application/ld+json')) {
      issues.push('⚠️  Componente não parece incluir JSON-LD schema');
    }
  } else {
    issues.push('❌ Componente SEOHead não encontrado');
  }
  
  return issues;
}

/**
 * Valida sitemap
 */
function validateSitemap() {
  console.log('\n🗺️  Validando sitemap...\n');
  
  const issues = [];
  const sitemapPath = './public/sitemap.xml';
  
  if (!fs.existsSync(sitemapPath)) {
    issues.push('❌ sitemap.xml não encontrado em /public');
    return issues;
  }
  
  const content = fs.readFileSync(sitemapPath, 'utf-8');
  
  // Contar URLs
  const urlMatches = content.match(/<loc>/g);
  const urlCount = urlMatches ? urlMatches.length : 0;
  
  console.log(`   URLs no sitemap: ${urlCount}`);
  
  if (urlCount < 700) {
    issues.push(`⚠️  Sitemap tem apenas ${urlCount} URLs (esperado: ~739)`);
  }
  
  // Verificar formato
  if (!content.includes('<?xml')) {
    issues.push('⚠️  Sitemap não tem declaração XML');
  }
  
  if (!content.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    issues.push('⚠️  Sitemap não tem namespace correto');
  }
  
  if (issues.length === 0) {
    console.log('   ✅ Sitemap válido!');
  }
  
  return issues;
}

/**
 * Valida robots.txt
 */
function validateRobotsTxt() {
  console.log('\n🤖 Validando robots.txt...\n');
  
  const issues = [];
  const robotsPath = './public/robots.txt';
  
  if (!fs.existsSync(robotsPath)) {
    issues.push('❌ robots.txt não encontrado em /public');
    return issues;
  }
  
  const content = fs.readFileSync(robotsPath, 'utf-8');
  
  if (!content.includes('User-agent:')) {
    issues.push('⚠️  robots.txt não tem User-agent');
  }
  
  if (!content.includes('Sitemap:')) {
    issues.push('⚠️  robots.txt não referencia o sitemap');
  }
  
  if (issues.length === 0) {
    console.log('   ✅ robots.txt válido!');
  }
  
  return issues;
}

/**
 * Testa algumas páginas para verificar meta tags
 */
async function testLivePages() {
  console.log('\n🌐 Testando páginas ao vivo...\n');
  
  const issues = [];
  const baseUrl = CONFIG.testLocal ? CONFIG.localUrl : CONFIG.siteUrl;
  
  const config = JSON.parse(fs.readFileSync(CONFIG.seoConfigPath, 'utf-8'));
  const slugs = Object.keys(config).slice(0, CONFIG.maxPagesToTest);
  
  console.log(`   Testando ${slugs.length} páginas em ${baseUrl}...\n`);
  
  for (const slug of slugs) {
    const seo = config[slug];
    if (!seo.url) continue;
    
    const url = CONFIG.testLocal 
      ? seo.url.replace(CONFIG.siteUrl, CONFIG.localUrl)
      : seo.url;
    
    try {
      const html = await fetchPage(url);
      
      // Verificar title
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      if (!titleMatch) {
        issues.push(`⚠️  ${slug}: Sem tag <title>`);
      } else if (titleMatch[1] !== seo.title) {
        // Title diferente do esperado
        if (titleMatch[1].includes('Smart Kit Now') && !seo.title) {
          // OK, título padrão
        } else {
          issues.push(`⚠️  ${slug}: Title não corresponde ao configurado`);
        }
      }
      
      // Verificar description
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      if (!descMatch) {
        issues.push(`⚠️  ${slug}: Sem meta description`);
      }
      
      // Verificar schema
      if (!html.includes('application/ld+json')) {
        issues.push(`⚠️  ${slug}: Sem JSON-LD schema`);
      }
      
      console.log(`   ✓ ${slug}`);
      
    } catch (err) {
      issues.push(`❌ ${slug}: Erro ao acessar página (${err.message})`);
    }
  }
  
  return issues;
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, { timeout: 5000 }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n🔍 SmartKitNow - SEO Validation\n');
  console.log('='.repeat(50));
  
  const allIssues = [];
  
  // Validar config
  allIssues.push(...validateConfigFile());
  
  // Validar componentes
  allIssues.push(...validateComponents());
  
  // Validar sitemap
  allIssues.push(...validateSitemap());
  
  // Validar robots.txt
  allIssues.push(...validateRobotsTxt());
  
  // Teste de páginas (opcional)
  if (CONFIG.testLocal && fs.existsSync(CONFIG.seoConfigPath)) {
    try {
      const liveIssues = await testLivePages();
      allIssues.push(...liveIssues);
    } catch (err) {
      console.log(`\n⚠️  Não foi possível testar páginas ao vivo: ${err.message}`);
      console.log('   (Certifique-se de que o servidor local está rodando)');
    }
  }
  
  // Resumo
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 RESUMO DA VALIDAÇÃO\n');
  
  if (allIssues.length === 0) {
    console.log('✅ Tudo OK! Nenhum problema encontrado.\n');
  } else {
    console.log(`⚠️  ${allIssues.length} problema(s) encontrado(s):\n`);
    allIssues.forEach(issue => console.log(`   ${issue}`));
    console.log('');
  }
}

main().catch(console.error);
