// Cuts the real work out of the portfolio deck screenshots in /assets into /public/images,
// and writes content/media.generated.ts (src, size and alt for every crop).
// Run: node scripts/crop-assets.mjs            (add --sheet for a labelled contact sheet)
// To use high-res originals later: point a manifest entry at the new file / box and re-run.
import sharp from "sharp";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ASSETS = path.resolve("assets");
const OUT = path.resolve("public/images");
const SHEET = process.argv.includes("--sheet");
const SHEET_OUT = process.env.SHEET_OUT || path.resolve("crop-sheet.jpg");

// Slides are matched by their WhatsApp timestamp (filenames contain a narrow no-break space).
const slides = {
  hero: "6.39.53",
  about: "6.39.55",
  coop: "6.39.57",
  logosA: "6.40.00 PM (1)",
  logosB: "6.40.00 PM.",
  mongco: "6.40.03 PM (1)",
  gome: "6.40.03 PM.",
  daladha: "6.40.04",
  lotus: "6.40.06",
  wallLight: "6.40.07 PM (1)",
  wallDark: "6.40.07 PM.",
  covers: "6.40.09 PM (1)",
  print: "6.40.09 PM (2)",
  posts: "6.40.09 PM.",
  packaging: "6.40.10",
};

// [key, slide, [left, top, width, height], alt, scale?, hide?]
// scale defaults to 2 (lanczos upscale); hide = [x, y, w, h] inside the crop painted black (deck watermark).
const crops = [
  ["portrait", "hero", [880, 40, 620, 984], "Uditha Saumya", 1.5, [440, 0, 180, 44]],
  ["avatar", "hero", [925, 40, 330, 330], "Uditha Saumya", 1.2],

  ["coop-fly/logo-sheet", "coop", [1068, 82, 432, 664], "Coop Fly logo, logo variations and brand colours"],
  ["coop-fly/signage", "coop", [1068, 752, 432, 226], "Coop Fly building signage"],
  ["coop-fly/stationery", "coop", [88, 655, 494, 326], "Coop Fly bus ticket, staff ID and takeaway cup"],
  ["coop-fly/uniforms", "coop", [622, 653, 405, 328], "Coop Fly staff polo uniforms"],

  ["logo-design/healing", "logosA", [1027, 97, 300, 171], "Healing Pathways logo"],
  ["logo-design/ecc", "logosA", [1027, 285, 300, 171], "Enaselwatta Condiments Ceylon logo"],
  ["logo-design/jetway", "logosA", [1030, 472, 294, 178], "Jetway Travels logo"],
  ["logo-design/hansana", "logosA", [1030, 675, 298, 193], "Hansana Gems logo"],
  ["logo-design/sathkara", "logosB", [1030, 92, 277, 176], "Sathkara medical service logo"],
  ["logo-design/icesl", "logosB", [1034, 285, 273, 178], "Institute of Cost Engineering Lanka logo"],
  ["logo-design/agro", "logosB", [1030, 480, 278, 181], "Nova Green Zest Agro logo"],
  ["logo-design/waga", "logosB", [1030, 691, 278, 196], "Waga news app logo"],

  ["mongco/grid", "mongco", [826, 300, 639, 676], "Mongco Sweet Mart brand identity applied across cups, tags, tins, bags, apron and mobile"],
  ["mongco/row-1", "mongco", [826, 300, 639, 210], "Mongco logo, cup and hang tag"],
  ["mongco/row-2", "mongco", [826, 513, 639, 212], "Mongco coaster, tin and coffee bag"],
  ["mongco/row-3", "mongco", [826, 728, 639, 248], "Mongco mobile, menu board and apron"],

  ["gome/grid", "gome", [865, 342, 608, 608], "GOME Plantations brand identity applied across apparel, cups, cards and mobile"],
  ["gome/row-1", "gome", [865, 342, 608, 196], "GOME logo, t-shirt and hang tag"],
  ["gome/row-2", "gome", [865, 540, 608, 196], "GOME cup, tumbler and business card"],
  ["gome/row-3", "gome", [865, 738, 608, 212], "GOME brand page, mug and mobile"],

  ["daladha/board", "daladha", [932, 259, 504, 736], "Daladha Traditional Fashion brand board"],
  ["daladha/logo", "daladha", [932, 259, 504, 266], "Daladha logo embossed on olive fabric"],
  ["daladha/cards", "daladha", [932, 529, 268, 146], "Daladha business cards"],
  ["daladha/palette", "daladha", [1206, 529, 230, 146], "Daladha signature colour palette"],
  ["daladha/phone-tag", "daladha", [932, 682, 504, 140], "Daladha app screen and swing tag"],
  ["daladha/merch", "daladha", [932, 827, 504, 124], "Daladha mug, t-shirt, tote bag and cap"],
  ["daladha/tag", "print", [767, 192, 290, 252], "Daladha swing tag on olive fabric"],

  ["lotus-cosmic/board", "lotus", [822, 330, 651, 651], "Lotus Cosmic brand identity board"],
  ["lotus-cosmic/logo", "lotus", [822, 330, 252, 248], "Lotus Cosmic logo embossed in gold"],
  ["lotus-cosmic/cards", "lotus", [1080, 330, 198, 248], "Lotus Cosmic business cards"],
  ["lotus-cosmic/sign", "lotus", [1284, 330, 189, 248], "Lotus Cosmic shop sign"],
  ["lotus-cosmic/bag", "lotus", [822, 585, 192, 179], "Lotus Cosmic shopping bag"],
  ["lotus-cosmic/candle", "lotus", [1020, 585, 256, 152], "Lotus Cosmic candle and packaging"],
  ["lotus-cosmic/polo", "lotus", [1282, 585, 191, 179], "Lotus Cosmic polo shirt"],
  ["lotus-cosmic/laptop", "lotus", [822, 770, 306, 211], "Lotus Cosmic website on a laptop"],
  ["lotus-cosmic/phone", "lotus", [1132, 770, 141, 211], "Lotus Cosmic Instagram profile"],
  ["lotus-cosmic/palette", "lotus", [1280, 770, 193, 211], "Lotus Cosmic colour palette"],

  ["social-media/wildking", "covers", [63, 212, 483, 181], "Wild King Adventure Safari cover design"],
  ["social-media/jdgearup", "covers", [567, 205, 496, 188], "JD GearUp cover design"],
  ["social-media/samagi", "covers", [1083, 202, 410, 196], "Samagi Funeral Directors cover design"],
  ["social-media/hansi", "covers", [63, 412, 483, 176], "Hansi Fashion cover design"],
  ["social-media/ranki", "covers", [567, 412, 496, 173], "Ranki Plant House cover design"],
  ["social-media/freedom", "covers", [1083, 412, 410, 173], "Freedom Haven cover design"],
  ["social-media/aberathna", "covers", [63, 607, 485, 182], "Online food delivery cover design"],
  ["social-media/smart", "covers", [567, 607, 496, 186], "Smart Tile Tech cover design"],
  ["social-media/prm", "covers", [1106, 607, 387, 186], "Perera Reach Marketing cover design"],
  ["social-media/ceylongems", "covers", [63, 817, 483, 186], "Ceylon Gems Royal cover design"],
  ["social-media/colourthreads", "covers", [616, 817, 446, 178], "Colour Threads cover design"],
  ["social-media/matrix", "covers", [1106, 812, 387, 171], "Matrix Moratuwa cover design"],
  ["social-media/post-01", "posts", [82, 265, 226, 226], "Keratin pack social post"],
  ["social-media/post-02", "posts", [331, 265, 226, 226], "Nail products social post"],
  ["social-media/post-03", "posts", [571, 265, 226, 224], "Keraplex keratin social post"],
  ["social-media/novaserve", "posts", [810, 267, 324, 459], "NovaServe commercial cleaning flyer post"],
  ["social-media/maths", "posts", [1157, 267, 370, 466], "Maths online revision class social post"],
  ["social-media/post-04", "posts", [82, 506, 227, 225], "Keratin treatment offer social post"],
  ["social-media/post-05", "posts", [331, 509, 223, 222], "Family restaurant pizza social post"],
  ["social-media/post-06", "posts", [572, 506, 225, 225], "Keraplax keratin social post"],
  ["social-media/post-07", "posts", [86, 747, 224, 224], "Dilanka Salon social post"],
  ["social-media/post-08", "posts", [346, 761, 221, 221], "Ramen social post"],
  ["social-media/post-09", "posts", [583, 759, 233, 232], "Colour Threads social post"],
  ["social-media/post-10", "posts", [833, 761, 224, 226], "Recruitment social post"],
  ["social-media/post-11", "posts", [1073, 761, 223, 226], "New year greeting social post"],
  ["social-media/post-12", "posts", [1320, 750, 190, 228], "Agro recruitment social post"],

  ["print/ludo", "print", [470, 195, 267, 248], "Ludo letterhead and business cards"],
  ["print/embhode", "print", [1076, 192, 346, 254], "Embhode Master presentation folder"],
  ["print/certificate", "print", [469, 465, 344, 253], "Oviken certificate"],
  ["print/flyer", "print", [835, 465, 284, 258], "Commercial cleaning flyer"],
  ["print/invoice", "print", [1141, 465, 301, 261], "Ploceia invoice and business card"],
  ["print/quotation", "print", [551, 728, 194, 276], "Quotation template"],
  ["print/cap", "print", [768, 735, 314, 268], "Embroidered cap"],
  ["print/hoodie", "print", [1106, 741, 297, 258], "Printed hoodie"],

  ["packaging/dhara", "packaging", [43, 250, 457, 269], "Dhara Ayurvedic skincare packaging range"],
  ["packaging/regalo", "packaging", [547, 228, 391, 291], "Regalo coffee pouch, cup and bag"],
  ["packaging/blackpanther", "packaging", [984, 211, 224, 324], "The Black Panther underwear box"],
  ["packaging/janitha", "packaging", [1239, 213, 235, 322], "Janitha Eco Foods spice pouch"],
  ["packaging/chilli", "packaging", [43, 552, 242, 318], "Chilli powder pouch"],
  ["packaging/fish", "packaging", [309, 552, 282, 319], "Cheyana canned fish labels"],
  ["packaging/achcharu", "packaging", [614, 552, 311, 322], "Achcharu jar label"],
  ["packaging/herbaloil", "packaging", [948, 554, 272, 321], "Green herbal hair oil bottle"],
  ["packaging/milk", "packaging", [1240, 554, 253, 321], "Moove flavoured milk bottle"],

  // Logo archive: bands of the two collection slides, kept at native size.
  ["logo-wall/light-1", "wallLight", [36, 98, 1466, 248], "Logo collection", 1],
  ["logo-wall/light-2", "wallLight", [36, 352, 1466, 284], "Logo collection", 1],
  ["logo-wall/light-3", "wallLight", [36, 640, 1466, 274], "Logo collection", 1],
  ["logo-wall/dark-1", "wallDark", [66, 86, 1446, 310], "Logo collection", 1],
  ["logo-wall/dark-2", "wallDark", [66, 400, 1446, 318], "Logo collection", 1],
  ["logo-wall/dark-3", "wallDark", [66, 722, 1446, 300], "Logo collection", 1],
  ["logo-wall/light", "wallLight", [36, 98, 1466, 816], "Collection of more than 100 logos designed by Uditha Saumya", 1],
  ["logo-wall/dark", "wallDark", [66, 86, 1446, 936], "Collection of more than 100 logos designed by Uditha Saumya", 1],
];

// 2×2 composite covers: [key, sources, cell w, cell h, gap, background, alt]
const composites = [
  ["logo-design/cover", ["logo-design/jetway", "logo-design/hansana", "logo-design/ecc", "logo-design/healing"], 600, 360, 12, "#121110", "Jetway, Hansana Gems, ECC and Healing Pathways logos"],
  ["social-media/cover", ["social-media/post-07", "social-media/post-02", "social-media/post-05", "social-media/post-09"], 460, 460, 12, "#121110", "A selection of social media post designs"],
];

const files = await readdir(ASSETS);
const findSlide = (id) => {
  const stamp = slides[id];
  // "6.40.00 PM." style stamps mean "no (n) suffix"; normalize the narrow no-break space first.
  const f = files.find((name) => {
    const n = name.normalize("NFKC").replace(/\s/g, " ");
    return stamp.endsWith(".") ? n.includes(stamp.slice(0, -1) + ".jpeg") : n.includes(stamp);
  });
  if (!f) throw new Error(`Slide not found: ${id} (${stamp})`);
  return path.join(ASSETS, f);
};

const media = {};
const buffers = {};

for (const [key, slide, [left, top, width, height], alt, scale = 2, hide] of crops) {
  let img = sharp(findSlide(slide)).extract({ left, top, width, height });
  if (hide) {
    const [x, y, w, h] = hide;
    const patch = await sharp({ create: { width: w, height: h, channels: 3, background: "#070707" } }).png().toBuffer();
    img = sharp(await img.composite([{ input: patch, left: x, top: y }]).toBuffer());
  }
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  if (scale !== 1) img = img.resize(w, h, { kernel: "lanczos3" }).sharpen({ sigma: 0.6 });
  const buf = await img.jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  const out = path.join(OUT, `${key}.jpg`);
  await mkdir(path.dirname(out), { recursive: true });
  await sharp(buf).toFile(out);
  buffers[key] = buf;
  media[key] = { src: `/images/${key}.jpg`, w, h, alt };
}

for (const [key, sources, cw, ch, gap, background, alt] of composites) {
  const w = cw * 2 + gap;
  const h = ch * 2 + gap;
  const tiles = await Promise.all(
    sources.map((s) => sharp(buffers[s]).resize(cw, ch, { fit: "cover" }).toBuffer()),
  );
  const buf = await sharp({ create: { width: w, height: h, channels: 3, background } })
    .composite(tiles.map((input, i) => ({ input, left: (i % 2) * (cw + gap), top: Math.floor(i / 2) * (ch + gap) })))
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  const out = path.join(OUT, `${key}.jpg`);
  await sharp(buf).toFile(out);
  buffers[key] = buf;
  media[key] = { src: `/images/${key}.jpg`, w, h, alt };
}

const ts = `// Generated by scripts/crop-assets.mjs — do not edit by hand.
export const media = ${JSON.stringify(media, null, 2)} as const;

export type MediaKey = keyof typeof media;
export type Media = { src: string; w: number; h: number; alt: string };
`;
await writeFile(path.resolve("content/media.generated.ts"), ts);
console.log(`✓ ${Object.keys(media).length} images`);

if (SHEET) {
  // 24 crops per page so each stays legible.
  const CELL = 300;
  const cols = 6;
  const keys = Object.keys(media);
  for (let page = 0; page * 24 < keys.length; page++) {
    const pageKeys = keys.slice(page * 24, page * 24 + 24);
    const rows = Math.ceil(pageKeys.length / cols);
    const tiles = await Promise.all(
      pageKeys.map(async (k, i) => {
        const img = await sharp(buffers[k]).resize(CELL - 10, CELL - 40, { fit: "contain", background: "#333" }).toBuffer();
        const label = Buffer.from(
          `<svg width="${CELL}" height="30"><text x="5" y="20" font-size="15" font-family="Helvetica" fill="#fff">${k}</text></svg>`,
        );
        return [
          { input: img, left: (i % cols) * CELL + 5, top: Math.floor(i / cols) * CELL + 30 },
          { input: label, left: (i % cols) * CELL, top: Math.floor(i / cols) * CELL },
        ];
      }),
    );
    const out = SHEET_OUT.replace(/\.jpg$/, `-${page + 1}.jpg`);
    await sharp({ create: { width: cols * CELL, height: rows * CELL, channels: 3, background: "#111" } })
      .composite(tiles.flat())
      .jpeg({ quality: 80 })
      .toFile(out);
    console.log(`✓ sheet → ${out}`);
  }
}
