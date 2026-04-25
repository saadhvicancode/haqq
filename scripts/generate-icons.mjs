import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../public/icons');
mkdirSync(outDir, { recursive: true });

const icons = [
  {
    name: 'notes',
    bg: '#4F46E5',
    svg: (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
      <rect width="${s}" height="${s}" rx="${s*0.2}" fill="#4F46E5"/>
      <rect x="${s*.22}" y="${s*.34}" width="${s*.56}" height="${s*.07}" rx="${s*.035}" fill="white" opacity=".92"/>
      <rect x="${s*.22}" y="${s*.46}" width="${s*.56}" height="${s*.07}" rx="${s*.035}" fill="white" opacity=".92"/>
      <rect x="${s*.22}" y="${s*.58}" width="${s*.38}" height="${s*.07}" rx="${s*.035}" fill="white" opacity=".92"/>
    </svg>`,
  },
  {
    name: 'calculator',
    bg: '#0D9488',
    svg: (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
      <rect width="${s}" height="${s}" rx="${s*0.2}" fill="#0D9488"/>
      <rect x="${s*.18}" y="${s*.15}" width="${s*.64}" height="${s*.18}" rx="${s*.04}" fill="white" opacity=".93"/>
      <rect x="${s*.18}" y="${s*.40}" width="${s*.18}" height="${s*.18}" rx="${s*.04}" fill="white" opacity=".9"/>
      <rect x="${s*.41}" y="${s*.40}" width="${s*.18}" height="${s*.18}" rx="${s*.04}" fill="white" opacity=".9"/>
      <rect x="${s*.64}" y="${s*.40}" width="${s*.18}" height="${s*.18}" rx="${s*.04}" fill="white" opacity=".9"/>
      <rect x="${s*.18}" y="${s*.63}" width="${s*.18}" height="${s*.18}" rx="${s*.04}" fill="white" opacity=".9"/>
      <rect x="${s*.41}" y="${s*.63}" width="${s*.18}" height="${s*.18}" rx="${s*.04}" fill="white" opacity=".9"/>
      <rect x="${s*.64}" y="${s*.63}" width="${s*.18}" height="${s*.18}" rx="${s*.04}" fill="white" opacity=".6"/>
    </svg>`,
  },
  {
    name: 'recipes',
    bg: '#EA580C',
    svg: (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
      <rect width="${s}" height="${s}" rx="${s*0.2}" fill="#EA580C"/>
      <ellipse cx="${s*.5}" cy="${s*.48}" rx="${s*.28}" ry="${s*.22}" fill="white" opacity=".92"/>
      <rect x="${s*.22}" y="${s*.48}" width="${s*.56}" height="${s*.2}" fill="white" opacity=".92"/>
      <rect x="${s*.14}" y="${s*.43}" width="${s*.1}" height="${s*.07}" rx="${s*.025}" fill="white" opacity=".85"/>
      <rect x="${s*.76}" y="${s*.43}" width="${s*.1}" height="${s*.07}" rx="${s*.025}" fill="white" opacity=".85"/>
      <rect x="${s*.46}" y="${s*.22}" width="${s*.08}" height="${s*.18}" rx="${s*.025}" fill="white" opacity=".85"/>
    </svg>`,
  },
  {
    name: 'budget',
    bg: '#16A34A',
    svg: (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
      <rect width="${s}" height="${s}" rx="${s*0.2}" fill="#16A34A"/>
      <rect x="${s*.18}" y="${s*.50}" width="${s*.16}" height="${s*.35}" rx="${s*.03}" fill="white" opacity=".9"/>
      <rect x="${s*.42}" y="${s*.36}" width="${s*.16}" height="${s*.49}" rx="${s*.03}" fill="white" opacity=".9"/>
      <rect x="${s*.66}" y="${s*.22}" width="${s*.16}" height="${s*.63}" rx="${s*.03}" fill="white" opacity=".9"/>
    </svg>`,
  },
];

const sizes = [192, 512];

for (const icon of icons) {
  for (const size of sizes) {
    const svg = Buffer.from(icon.svg(size));
    await sharp(svg)
      .png()
      .toFile(join(outDir, `${icon.name}-${size}.png`));
    console.log(`✓ ${icon.name}-${size}.png`);
  }
  // Apple touch icon (180px) — same as 192 crop
  const svg = Buffer.from(icon.svg(180));
  await sharp(svg)
    .png()
    .toFile(join(outDir, `${icon.name}-180.png`));
  console.log(`✓ ${icon.name}-180.png`);
}

console.log('Icons generated in public/icons/');
