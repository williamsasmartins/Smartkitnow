import fs from 'fs/promises';
import path from 'path';
import https from 'https';

// Country codes to fetch official Twemoji flags for
const codes = [
  'it', 'mx', 'fr', 'jp', 'cn', 'kr', 'in', 'th', 'ae', 'gr', 'br', 'pt'
];

const TWEMOJI_CDN_BASE = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg';

function codeToTwemojiSlug(code) {
  const A = 'A'.charCodeAt(0);
  return code
    .toUpperCase()
    .split('')
    .map((ch) => (0x1f1e6 + (ch.charCodeAt(0) - A)).toString(16))
    .join('-');
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          res.resume();
          return;
        }
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', (err) => reject(err));
  });
}

async function fetchFlagSvg(code) {
  const slug = codeToTwemojiSlug(code);
  const url = `${TWEMOJI_CDN_BASE}/${slug}.svg`;
  const svg = await fetchText(url);
  const outDir = path.join('public', 'flags');
  const outPath = path.join(outDir, `${code}.svg`);
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outPath, svg, 'utf8');
  return outPath;
}

async function main() {
  console.log('Fetching official Twemoji flags and saving to public/flags ...');
  for (const code of codes) {
    try {
      const saved = await fetchFlagSvg(code);
      console.log(`✅ Saved: ${saved}`);
    } catch (err) {
      console.error(`❌ Failed for ${code}:`, err.message || err);
    }
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error('Script error:', err);
  process.exit(1);
});