import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const productosDir = path.join(root, 'productos');
const outFile = path.join(root, 'assets', 'products.auto.js');

function slugify(s) {
  return (s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .replace(/&/g, ' y ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .replace(/-{2,}/g, '-');
}

function titleCase(s) {
  return (s || '').replace(/\w[^\s-]*/g, w => w.charAt(0).toUpperCase() + w.slice(1));
}

function normalizeBaseName(name) {
  // Fix some known typos observed in repo
  return name
    .replace(/^l\.icra/gi, 'licra')
    .replace(/marr[óo]n/gi, 'marron')
    .replace(/negral/gi, 'negra')
    // unify connectors
    .replace(/\+/g, ' mas ')
    .replace(/más/gi, 'mas')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferCatsPrice(base) {
  const b = base.toLowerCase();
  if (b.startsWith('licra corta')) return { cats: ['licras cortas'], price: 60000 };
  if (b.startsWith('licra larga')) return { cats: ['licras largas'], price: 60000 };
  if (b.startsWith('camiseta oversize')) return { cats: ['camisetas oversize','oversize'], price: 65000 };
  if (b.startsWith('set oversize')) return { cats: ['sets','oversize'], price: 95000 };
  if (b.startsWith('set short')) return { cats: ['sets'], price: 60000 };
  // Cualquier otro set identificado por nombre
  if (b.startsWith('set ')) return { cats: ['sets'], price: 60000 };
  // Default fallback
  return { cats: [], price: 0 };
}

async function main() {
  const entries = await fs.readdir(productosDir, { withFileTypes: true });
  const files = entries.filter(e => e.isFile()).map(e => e.name)
    .filter(n => /\.(webp|jpe?g|png)$/i.test(n));

  // Group by base name (without trailing number)
  const groups = new Map();
  for (const file of files) {
    const noExt = file.replace(/\.[^.]+$/, '');
    const norm = normalizeBaseName(noExt);
    // Try to split trailing index " ... <num>"
    const m = norm.match(/^(.*?)(?:\s*-\s*)?([^\d]*?)\s*(?:([0-9]+))?$/); // permissive
    let base = norm;
    let index = 0;
    if (m) {
      const left = (m[1] || '').trim();
      const mid = (m[2] || '').trim();
      const num = m[3];
      if (left && mid && /\b(licra|camiseta|set)\b/i.test(left)) {
        base = `${left} - ${mid}`.replace(/\s+/g, ' ').trim();
      } else if (/\s\d+$/.test(norm)) {
        base = norm.replace(/\s*\d+$/, '').trim();
      } else {
        base = norm;
      }
      if (num) index = parseInt(num, 10) || 0;
    }
    const key = base.toLowerCase();
    if (!groups.has(key)) groups.set(key, { base, images: [] });
    groups.get(key).images.push({ file, index });
  }

  const products = [];
  for (const { base, images } of groups.values()) {
    // Order numerically if index present else alphabetically
    images.sort((a,b)=> (a.index||0)-(b.index||0) || a.file.localeCompare(b.file));
    const imgs = images.map(i => `productos/${i.file}`);
    let niceName = titleCase(base.replace(/\s+/g,' '))
      .replace(/Licra Corta/i, 'Licra Corta')
      .replace(/Licra Larga/i, 'Licra Larga')
      .replace(/Camiseta Oversize/i, 'Camiseta Oversize')
      .replace(/Marron/i, 'Marrón')
      .replace(/ Mas /g, ' + ');

    // Canonical IDs for sets to avoid duplicates
    let id = slugify(base);
    if (/^set oversize/i.test(base)) {
      id = 'set-oversize';
      niceName = 'Set Oversize + Push Up + Medias';
    }
    if (/^set short/i.test(base)) {
      id = 'set-short-top';
      niceName = 'Set Short + Top';
    }
    const { cats, price } = inferCatsPrice(base);
    // Skip groups with no recognizable category
    if (!cats.length) continue;
    products.push({ id, name: niceName, price, cats, images: imgs });
  }

  const header = '// Archivo generado automáticamente. No editar a mano.\n';
  const js = `${header}window.PRODUCTS_AUTO = ${JSON.stringify(products, null, 2)};\n`;
  await fs.writeFile(outFile, js, 'utf8');
  console.log(`Generado ${outFile} con ${products.length} productos.`);
}

main().catch(err => { console.error(err); process.exit(1); });
