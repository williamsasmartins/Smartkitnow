#!/usr/bin/env node

/**
 * SmartKitNow - Auto Page Updater
 * 
 * Este script atualiza AUTOMATICAMENTE todas as páginas do seu projeto
 * com os meta tags e schemas gerados pelo Antigravity.
 * 
 * Uso: node auto-update-pages.js
 * 
 * ⚠️  ATENÇÃO: Este script MODIFICA arquivos! Faça backup primeiro.
 */

const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURAÇÃO
// ============================================

const CONFIG = {
  // Pasta dos outputs do Antigravity
  outputDir: './output',
  
  // Pasta das páginas do projeto
  pagesDir: './src/pages',
  // Para Next.js App Router: './src/app'
  
  // Extensões de arquivo para processar
  extensions: ['.jsx', '.tsx', '.js', '.ts'],
  
  // Arquivo de configuração SEO
  seoConfigPath: './src/config/seo.json',
  
  // Modo dry-run (mostra mudanças sem aplicar)
  dryRun: false,
  
  // Criar backup antes de modificar
  createBackup: true,
};

// ============================================
// DETECTOR DE FRAMEWORK
// ============================================

function detectFramework() {
  // Verificar package.json
  if (fs.existsSync('./package.json')) {
    const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    
    if (deps['next']) {
      // Verificar se é App Router ou Pages Router
      if (fs.existsSync('./src/app') || fs.existsSync('./app')) {
        return { name: 'nextjs-app', pagesDir: fs.existsSync('./src/app') ? './src/app' : './app' };
      }
      return { name: 'nextjs-pages', pagesDir: fs.existsSync('./src/pages') ? './src/pages' : './pages' };
    }
    
    if (deps['gatsby']) return { name: 'gatsby', pagesDir: './src/pages' };
    if (deps['react']) return { name: 'react', pagesDir: './src' };
    if (deps['vue']) return { name: 'vue', pagesDir: './src/views' };
  }
  
  // HTML estático
  if (fs.existsSync('./index.html') || fs.existsSync('./public/index.html')) {
    return { name: 'html', pagesDir: '.' };
  }
  
  return { name: 'unknown', pagesDir: './src' };
}

// ============================================
// CARREGADORES DE DADOS
// ============================================

function loadSEOConfig() {
  if (fs.existsSync(CONFIG.seoConfigPath)) {
    return JSON.parse(fs.readFileSync(CONFIG.seoConfigPath, 'utf-8'));
  }
  
  // Tentar carregar dos CSVs se config não existir
  console.log('⚠️  seo.json não encontrado, gerando a partir dos CSVs...');
  return loadFromCSVs();
}

function loadFromCSVs() {
  const config = {};
  const files = fs.readdirSync(CONFIG.outputDir);
  
  files.filter(f => f.endsWith('_meta_tags.csv')).forEach(file => {
    const content = fs.readFileSync(path.join(CONFIG.outputDir, file), 'utf-8');
    const lines = content.split('\n').slice(1);
    
    lines.forEach(line => {
      if (!line.trim()) return;
      const parts = parseCSVLine(line);
      const [url, , title, , description] = parts;
      const slug = url.split('/').pop() || url.split('/').slice(-2, -1)[0];
      
      config[slug] = { url, title, description };
    });
  });
  
  // Carregar schemas
  files.filter(f => f.endsWith('_schemas.json')).forEach(file => {
    const schemas = JSON.parse(fs.readFileSync(path.join(CONFIG.outputDir, file), 'utf-8'));
    Object.entries(schemas).forEach(([url, schema]) => {
      const slug = url.split('/').pop();
      if (config[slug]) {
        config[slug].schema = schema;
      }
    });
  });
  
  return config;
}

// ============================================
// UPDATERS POR FRAMEWORK
// ============================================

/**
 * Atualiza páginas Next.js (Pages Router)
 */
function updateNextJsPages(seoConfig, pagesDir) {
  let updated = 0;
  
  function processDir(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('_') && !item.startsWith('.')) {
        processDir(fullPath);
      } else if (stat.isFile() && CONFIG.extensions.some(ext => item.endsWith(ext))) {
        const slug = item.replace(/\.(jsx|tsx|js|ts)$/, '');
        const seo = seoConfig[slug];
        
        if (seo) {
          updateNextJsPage(fullPath, seo, slug);
          updated++;
        }
      }
    });
  }
  
  processDir(pagesDir);
  return updated;
}

function updateNextJsPage(filePath, seo, slug) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Verificar se já tem import do Head
  const hasHeadImport = content.includes("from 'next/head'") || content.includes('from "next/head"');
  const hasSEOHeadImport = content.includes('SEOHead');
  
  // Se não tem nenhum, adicionar import do SEOHead
  if (!hasSEOHeadImport) {
    // Encontrar onde adicionar o import
    const importMatch = content.match(/^import .+ from .+;?\n/m);
    if (importMatch) {
      const insertPos = content.indexOf(importMatch[0]) + importMatch[0].length;
      content = content.slice(0, insertPos) + 
                `import SEOHead from '@/components/SEOHead';\n` + 
                content.slice(insertPos);
    }
  }
  
  // Adicionar <SEOHead> se não existe
  if (!content.includes('<SEOHead') && !content.includes('<Head>')) {
    // Encontrar o return do componente
    const returnMatch = content.match(/return\s*\(\s*\n?\s*(<[A-Za-z]+)/);
    if (returnMatch) {
      const insertPos = content.indexOf(returnMatch[0]) + returnMatch[0].length - returnMatch[1].length;
      content = content.slice(0, insertPos) + 
                `<>\n        <SEOHead slug="${slug}" />\n        ` + 
                content.slice(insertPos).replace(returnMatch[1], returnMatch[1]);
      
      // Fechar o fragment no final
      const lastReturnParen = content.lastIndexOf(');');
      if (lastReturnParen > -1) {
        // Encontrar o fechamento do JSX
        const closeMatch = content.slice(0, lastReturnParen).match(/(<\/[A-Za-z]+>)\s*$/);
        if (closeMatch) {
          const closePos = content.lastIndexOf(closeMatch[1]) + closeMatch[1].length;
          content = content.slice(0, closePos) + '\n      </>' + content.slice(closePos);
        }
      }
    }
  }
  
  // Salvar se houve mudanças
  if (content !== originalContent) {
    if (CONFIG.dryRun) {
      console.log(`  [DRY RUN] Atualizaria: ${filePath}`);
    } else {
      if (CONFIG.createBackup) {
        fs.writeFileSync(filePath + '.bak', originalContent);
      }
      fs.writeFileSync(filePath, content);
      console.log(`  ✓ Atualizado: ${filePath}`);
    }
  }
}

/**
 * Atualiza páginas Next.js (App Router) - metadata export
 */
function updateNextJsAppRouter(seoConfig, pagesDir) {
  let updated = 0;
  
  function processDir(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('_') && !item.startsWith('.')) {
        // Verificar se tem page.tsx/jsx
        const pageFile = ['page.tsx', 'page.jsx', 'page.js'].find(f => 
          fs.existsSync(path.join(fullPath, f))
        );
        
        if (pageFile) {
          const slug = item;
          const seo = seoConfig[slug];
          
          if (seo) {
            updateAppRouterPage(path.join(fullPath, pageFile), seo, slug);
            updated++;
          }
        }
        
        processDir(fullPath);
      }
    });
  }
  
  processDir(pagesDir);
  return updated;
}

function updateAppRouterPage(filePath, seo, slug) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Verificar se já tem export de metadata
  if (!content.includes('export const metadata') && !content.includes('export function generateMetadata')) {
    // Adicionar metadata export no topo
    const metadataExport = `
// SEO Metadata - Auto-generated
export const metadata = {
  title: '${seo.title.replace(/'/g, "\\'")}',
  description: '${seo.description.replace(/'/g, "\\'")}',
  openGraph: {
    title: '${seo.title.replace(/'/g, "\\'")}',
    description: '${seo.description.replace(/'/g, "\\'")}',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${seo.title.replace(/'/g, "\\'")}',
    description: '${seo.description.replace(/'/g, "\\'")}',
  },
};

`;
    
    // Inserir depois dos imports
    const lastImportMatch = content.match(/^import .+$/gm);
    if (lastImportMatch) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1];
      const insertPos = content.indexOf(lastImport) + lastImport.length + 1;
      content = content.slice(0, insertPos) + metadataExport + content.slice(insertPos);
    } else {
      content = metadataExport + content;
    }
  }
  
  // Salvar
  if (content !== originalContent) {
    if (CONFIG.dryRun) {
      console.log(`  [DRY RUN] Atualizaria: ${filePath}`);
    } else {
      if (CONFIG.createBackup) {
        fs.writeFileSync(filePath + '.bak', originalContent);
      }
      fs.writeFileSync(filePath, content);
      console.log(`  ✓ Atualizado: ${filePath}`);
    }
  }
}

/**
 * Gera arquivos HTML com meta tags para sites estáticos
 */
function generateHTMLMetaTags(seoConfig) {
  const outputDir = './seo-html-snippets';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  let count = 0;
  
  Object.entries(seoConfig).forEach(([slug, seo]) => {
    const schema = seo.schema ? JSON.stringify(seo.schema, null, 2) : '{}';
    
    const html = `<!-- SEO Tags para: ${slug} -->
<!-- Cole no <head> da página -->

<title>${seo.title}</title>
<meta name="description" content="${seo.description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${seo.url || ''}">
<meta property="og:title" content="${seo.title}">
<meta property="og:description" content="${seo.description}">
<meta property="og:site_name" content="SmartKitNow">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="${seo.url || ''}">
<meta name="twitter:title" content="${seo.title}">
<meta name="twitter:description" content="${seo.description}">

<!-- Schema.org JSON-LD -->
<script type="application/ld+json">
${schema}
</script>
`;
    
    fs.writeFileSync(path.join(outputDir, `${slug}.html`), html);
    count++;
  });
  
  console.log(`✓ Gerados ${count} snippets HTML em ${outputDir}/`);
  return count;
}

// ============================================
// AUXILIARES
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

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n🔄 SmartKitNow - Auto Page Updater\n');
  console.log('='.repeat(50));
  
  // Detectar framework
  const framework = detectFramework();
  console.log(`\n📦 Framework detectado: ${framework.name}`);
  console.log(`📁 Pasta de páginas: ${framework.pagesDir}\n`);
  
  // Carregar configuração SEO
  const seoConfig = loadSEOConfig();
  console.log(`📊 Carregadas ${Object.keys(seoConfig).length} configurações SEO\n`);
  
  if (CONFIG.dryRun) {
    console.log('⚠️  MODO DRY-RUN: Nenhum arquivo será modificado\n');
  }
  
  // Atualizar baseado no framework
  let updated = 0;
  
  switch (framework.name) {
    case 'nextjs-pages':
      console.log('🔧 Atualizando páginas Next.js (Pages Router)...\n');
      updated = updateNextJsPages(seoConfig, framework.pagesDir);
      break;
      
    case 'nextjs-app':
      console.log('🔧 Atualizando páginas Next.js (App Router)...\n');
      updated = updateNextJsAppRouter(seoConfig, framework.pagesDir);
      break;
      
    case 'html':
      console.log('🔧 Gerando snippets HTML para site estático...\n');
      updated = generateHTMLMetaTags(seoConfig);
      break;
      
    default:
      console.log('🔧 Framework não reconhecido, gerando snippets HTML...\n');
      updated = generateHTMLMetaTags(seoConfig);
  }
  
  // Resumo
  console.log('\n' + '='.repeat(50));
  console.log(`\n✅ Processo concluído!`);
  console.log(`   ${updated} páginas/arquivos processados\n`);
  
  if (CONFIG.createBackup && !CONFIG.dryRun) {
    console.log('💾 Backups criados com extensão .bak');
  }
  
  console.log('\nPróximos passos:');
  console.log('1. Revise as alterações (git diff)');
  console.log('2. Teste localmente');
  console.log('3. Faça deploy');
  console.log('4. Valide no Google Search Console\n');
}

main().catch(console.error);
