import { media, type Media, type MediaKey } from "./media.generated";

export type Aspect = "portrait" | "landscape" | "square";

/** One gallery image; consecutive `half` / `third` shots are grouped into rows. */
export type Shot = { key: MediaKey; span?: "full" | "half" | "third" };

export type LogoBrief = { name: string; industry: string; country: string; concept: string; logo: MediaKey };

export type Project = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  country: string;
  services: string[];
  kind: "identity" | "collection";
  aspect: Aspect;
  summary: string;
  brief: string;
  concept: string;
  delivered: string;
  deliverables: string[];
  palette?: string[];
  briefs?: LogoBrief[];
  cover: MediaKey;
  gallery: Shot[];
};

export const getMedia = (key: MediaKey): Media => media[key];

export const projects: Project[] = [
  {
    slug: "coop-fly",
    title: "Coop Fly",
    client: "Co-operative Group Sri Lanka",
    industry: "Public bus transport",
    country: "Sri Lanka",
    services: ["Logo", "Brand identity"],
    kind: "identity",
    aspect: "portrait",
    summary: "Brand identity for a new public bus service launched by Sri Lanka's Co-operative group.",
    brief:
      "The Co-operative group of institutions was launching a new public transport service. It needed a brand that felt like a fresh start while still clearly belonging to the CO-OP family everyone knows.",
    concept:
      "A bird in flight paired with a rounded \"coop fly\" wordmark, finished in the colours of the original CO-OPERATIVE logo, just as the client asked.",
    delivered:
      "A logo with horizontal, stacked and reversed versions, a brand colour palette, and the identity applied to bus tickets, staff IDs, cups, polo uniforms and building signage.",
    deliverables: ["Logo & variations", "Colour palette", "Tickets", "Staff ID", "Cups", "Uniforms", "Signage"],
    palette: ["#7B1E1E", "#E46A1F", "#F29A4A"],
    cover: "coop-fly/logo-sheet",
    gallery: [
      { key: "coop-fly/signage", span: "full" },
      { key: "coop-fly/logo-sheet", span: "half" },
      { key: "coop-fly/uniforms", span: "half" },
      { key: "coop-fly/stationery", span: "full" },
    ],
  },
  {
    slug: "lotus-cosmic",
    title: "Lotus Cosmic",
    client: "Lotus Cosmic",
    industry: "Astrology service",
    country: "Sri Lanka",
    services: ["Logo", "Brand identity", "Social"],
    kind: "identity",
    aspect: "square",
    summary: "An astrology brand that steps away from the usual zodiac clichés.",
    brief:
      "Astrology logos tend to look alike. Lotus Cosmic wanted something simple and creative that would suit every occasion, from a business card to a shop sign.",
    concept:
      "A gold-lined lotus, a soft blush palette and a classic serif wordmark: calm, premium and spiritual without leaning on stars and zodiac wheels.",
    delivered:
      "A complete brand kit: business cards, shop signage, shopping bags, candle packaging, apparel, a website design and an Instagram profile, all from one palette.",
    deliverables: ["Logo", "Business cards", "Signage", "Shopping bags", "Packaging", "Apparel", "Website", "Instagram"],
    palette: ["#FCE8F1", "#F6CDE0", "#D4AF37", "#8B6B3A"],
    cover: "lotus-cosmic/logo",
    gallery: [
      { key: "lotus-cosmic/board", span: "full" },
      { key: "lotus-cosmic/logo", span: "third" },
      { key: "lotus-cosmic/cards", span: "third" },
      { key: "lotus-cosmic/sign", span: "third" },
      { key: "lotus-cosmic/laptop", span: "half" },
      { key: "lotus-cosmic/candle", span: "half" },
      { key: "lotus-cosmic/bag", span: "third" },
      { key: "lotus-cosmic/phone", span: "third" },
      { key: "lotus-cosmic/palette", span: "third" },
    ],
  },
  {
    slug: "daladha",
    title: "Daladha",
    client: "Daladha Traditional Fashion",
    industry: "Fashion & clothing",
    country: "Sri Lanka",
    services: ["Logo", "Brand identity"],
    kind: "identity",
    aspect: "portrait",
    summary: "A clothing brand rooted in the traditional Kandyan style.",
    brief:
      "Daladha sells traditional fashion and wanted a brand that honours Kandyan heritage while still feeling right for a modern shopper.",
    concept:
      "An elephant and lotus mark drawn in the Kandyan tradition, set with a refined serif and an olive green and off-white palette. The entire kit was finalised around that same theme.",
    delivered:
      "Logo, signature palette, business cards, swing tags, an app screen and merchandise including mugs, t-shirts, tote bags and caps.",
    deliverables: ["Logo", "Signature palette", "Business cards", "Swing tags", "App screen", "Merchandise"],
    cover: "daladha/board",
    gallery: [
      { key: "daladha/logo", span: "full" },
      { key: "daladha/cards", span: "half" },
      { key: "daladha/palette", span: "half" },
      { key: "daladha/tag", span: "half" },
      { key: "daladha/board", span: "half" },
      { key: "daladha/phone-tag", span: "full" },
      { key: "daladha/merch", span: "full" },
    ],
  },
  {
    slug: "logo-design",
    title: "Logo Design",
    client: "Eight businesses",
    industry: "Health, tea, travel, gems, education, agro, media",
    country: "Sri Lanka & international",
    services: ["Logo design"],
    kind: "collection",
    aspect: "landscape",
    summary: "Eight concept-led logos, each built on one clear idea about the business.",
    brief:
      "Every client came with a different industry and audience, from a recovery centre to a tea exporter and a news app. Each needed a mark that is unique, memorable and easy to recognise.",
    concept:
      "Each logo starts from the meaning behind the business: a healthy figure for recovery, a leaf for tea, an airplane for travel, a gem for jewellery. That idea is then reduced to something simple and professional.",
    delivered: "Final logos with colour themes and the concept behind each one, ready for print, signage and digital use.",
    deliverables: ["Concept", "Logo", "Colour theme", "Usage files"],
    briefs: [
      { name: "Healing Pathways", industry: "Active recovery centre", country: "Sri Lanka", concept: "A blue colour theme with a strong, healthy figure at the heart of the mark.", logo: "logo-design/healing" },
      { name: "Enaselwatta Condiments Ceylon", industry: "Tea export", country: "Sri Lanka & international", concept: "Red, green and blue, with the letters \"ECC\" forming the icon and a leaf set inside the first C.", logo: "logo-design/ecc" },
      { name: "Jetway Travels", industry: "Air ticketing", country: "Sri Lanka", concept: "A maroon colour theme with an airplane carried through the mark.", logo: "logo-design/jetway" },
      { name: "Hansana Gems", industry: "Gems", country: "Sri Lanka & international", concept: "A gold colour theme with an HG monogram and a gem icon.", logo: "logo-design/hansana" },
      { name: "Sathkara", industry: "Medical service", country: "Sri Lanka", concept: "Blue and red, with 24-hour, doctor and hospital icons inside a shield: a doctor at your doorstep.", logo: "logo-design/sathkara" },
      { name: "Institute of Cost Engineering Lanka", industry: "Campus", country: "Sri Lanka & international", concept: "A blue colour theme with a lion and a graduation cap.", logo: "logo-design/icesl" },
      { name: "Nova Green Zest", industry: "Agro", country: "Sri Lanka & international", concept: "Fresh green leaves growing from a world icon.", logo: "logo-design/agro" },
      { name: "Waga (වග)", industry: "News mobile app", country: "Sri Lanka & international", concept: "A red colour theme built from the Sinhala letters වග.", logo: "logo-design/waga" },
    ],
    cover: "logo-design/cover",
    gallery: [
      { key: "logo-wall/light", span: "full" },
      { key: "logo-wall/dark", span: "full" },
    ],
  },
  {
    slug: "gome",
    title: "GOME Plantations",
    client: "GOME Group of Companies",
    industry: "Plantations",
    country: "Sri Lanka",
    services: ["Logo", "Brand identity"],
    kind: "identity",
    aspect: "square",
    summary: "A fresh, growing identity for a plantation-led group of companies.",
    brief:
      "GOME is a corporate group driven primarily by its plantation business. It needed a logo and brand that could carry the whole group with confidence.",
    concept:
      "A \"G\" formed from a leaf, set in a bright, healthy green with the line \"Nature grows a better tomorrow\".",
    delivered: "Logo and brand applied to apparel, hang tags, cups, a tumbler, business cards, mugs and mobile screens.",
    deliverables: ["Logo", "Apparel", "Hang tags", "Cups & mugs", "Business cards", "Mobile"],
    cover: "gome/grid",
    gallery: [
      { key: "gome/grid", span: "full" },
      { key: "gome/row-1", span: "full" },
      { key: "gome/row-2", span: "full" },
      { key: "gome/row-3", span: "full" },
    ],
  },
  {
    slug: "packaging",
    title: "Packaging Design",
    client: "Food, cosmetics & retail brands",
    industry: "FMCG",
    country: "Sri Lanka",
    services: ["Packaging"],
    kind: "collection",
    aspect: "landscape",
    summary: "Packs, labels and bottles that stand out on the shelf.",
    brief:
      "Stand out on the retail shelf and make a striking first impression. Packaging has to protect the product while lifting the brand's perceived value in the market.",
    concept:
      "Creative, functional and visually compelling packaging, from premium Ayurvedic skincare and coffee to spices, canned fish and flavoured milk.",
    delivered: "Packaging for Dhara, Regalo, The Black Panther, Janitha Eco Foods, chilli powder, Cheyana canned fish, achcharu, herbal hair oil and Moove milk.",
    deliverables: ["Boxes", "Pouches", "Labels", "Bottles", "Cans", "Jars"],
    cover: "packaging/regalo",
    gallery: [
      { key: "packaging/dhara", span: "half" },
      { key: "packaging/regalo", span: "half" },
      { key: "packaging/blackpanther", span: "third" },
      { key: "packaging/janitha", span: "third" },
      { key: "packaging/chilli", span: "third" },
      { key: "packaging/fish", span: "third" },
      { key: "packaging/achcharu", span: "third" },
      { key: "packaging/herbaloil", span: "third" },
      { key: "packaging/milk", span: "third" },
    ],
  },
  {
    slug: "mongco",
    title: "Mongco Sweet Mart",
    client: "Mongco Sweet Mart",
    industry: "Café & sweets",
    country: "Sri Lanka",
    services: ["Logo", "Brand identity"],
    kind: "identity",
    aspect: "square",
    summary: "A playful café and sweet-mart brand with a cheeky monkey mascot.",
    brief: "A new business launched to sell a wide variety of café items and sweets needed a brand that felt warm, fun and premium.",
    concept: "A friendly monkey mascot with a rounded wordmark, set in a rich chocolate and cream palette.",
    delivered: "Logo and brand kit applied to takeaway cups, hang tags, coasters, tins, coffee bags, an apron, a menu board and mobile.",
    deliverables: ["Logo & mascot", "Cups", "Tags", "Tins", "Coffee bags", "Apron", "Menu"],
    cover: "mongco/grid",
    gallery: [
      { key: "mongco/grid", span: "full" },
      { key: "mongco/row-1", span: "full" },
      { key: "mongco/row-2", span: "full" },
      { key: "mongco/row-3", span: "full" },
    ],
  },
  {
    slug: "social-media",
    title: "Social Media Design",
    client: "Retail, beauty, food & education brands",
    industry: "Various",
    country: "Sri Lanka & international",
    services: ["Social media"],
    kind: "collection",
    aspect: "square",
    summary: "Eye-catching posts and cover designs that stop the scroll.",
    brief:
      "Stand out on crowded social feeds with eye-catching, high-converting visual assets that align with the brand and engage the right audience on every major platform.",
    concept: "Bold layouts, clear offers and strong typography, in Sinhala and English, tailored to each brand's identity.",
    delivered: "Facebook and page cover designs plus campaign posts for salons, restaurants, retail, education and service businesses.",
    deliverables: ["Cover designs", "Post designs", "Offer campaigns", "Templates"],
    cover: "social-media/cover",
    gallery: [
      { key: "social-media/samagi", span: "half" },
      { key: "social-media/jdgearup", span: "half" },
      { key: "social-media/wildking", span: "half" },
      { key: "social-media/freedom", span: "half" },
      { key: "social-media/hansi", span: "half" },
      { key: "social-media/ranki", span: "half" },
      { key: "social-media/smart", span: "half" },
      { key: "social-media/prm", span: "half" },
      { key: "social-media/ceylongems", span: "half" },
      { key: "social-media/matrix", span: "half" },
      { key: "social-media/aberathna", span: "half" },
      { key: "social-media/colourthreads", span: "half" },
      { key: "social-media/novaserve", span: "half" },
      { key: "social-media/maths", span: "half" },
      { key: "social-media/post-01", span: "third" },
      { key: "social-media/post-02", span: "third" },
      { key: "social-media/post-03", span: "third" },
      { key: "social-media/post-04", span: "third" },
      { key: "social-media/post-05", span: "third" },
      { key: "social-media/post-06", span: "third" },
      { key: "social-media/post-07", span: "third" },
      { key: "social-media/post-08", span: "third" },
      { key: "social-media/post-09", span: "third" },
      { key: "social-media/post-10", span: "third" },
      { key: "social-media/post-11", span: "third" },
      { key: "social-media/post-12", span: "third" },
    ],
  },
  {
    slug: "print",
    title: "Print & Merchandise",
    client: "Corporate & retail clients",
    industry: "Various",
    country: "Sri Lanka & international",
    services: ["Print", "Merchandise"],
    kind: "collection",
    aspect: "landscape",
    summary: "Print that makes a powerful physical impression.",
    brief:
      "From business cards to marketing collateral, print materials have to capture attention and represent the brand with perfection.",
    concept: "High-quality, professional print design that carries each brand's identity onto paper, fabric and products.",
    delivered: "Business cards, letterheads, invoices, quotations, presentation folders, certificates, flyers, brochures, tags, t-shirts, caps and hoodies.",
    deliverables: ["Business cards", "Letterheads", "Invoices", "Quotations", "Flyers & brochures", "Certificates", "Tags", "Apparel"],
    cover: "print/embhode",
    gallery: [
      { key: "print/embhode", span: "half" },
      { key: "print/certificate", span: "half" },
      { key: "print/ludo", span: "third" },
      { key: "print/flyer", span: "third" },
      { key: "print/invoice", span: "third" },
      { key: "print/quotation", span: "third" },
      { key: "print/cap", span: "third" },
      { key: "print/hoodie", span: "third" },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
