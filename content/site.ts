export const site = {
  name: "Uditha Saumya",
  role: "Graphic Designer",
  heroEyebrow: "Hello, I'm Uditha Saumya",
  heroLine1: "Graphic",
  heroLine2: "Designer",
  heroSub: "Logos and brand identities that help businesses stand out",
  bio: "I create modern, creative and impactful designs that help brands stand out. From logo design to complete brand identity, I turn ideas into visual experiences that make a difference.",
  email: "hello@udithasaumya.com", // TODO: real email
  whatsapp: { label: "+94 7X XXX XXXX", href: "https://wa.me/94700000000" }, // TODO: real WhatsApp number
  socials: [
    { label: "Instagram", short: "IG", href: "https://instagram.com/" }, // TODO: real link
    { label: "Facebook", short: "FB", href: "https://facebook.com/" }, // TODO: real link
    { label: "WhatsApp", short: "WA", href: "https://wa.me/94700000000" }, // TODO: real link
    { label: "YouTube", short: "YT", href: "https://youtube.com/" }, // TODO: real link
    { label: "TikTok", short: "TT", href: "https://tiktok.com/" }, // TODO: real link
    { label: "LinkedIn", short: "IN", href: "https://linkedin.com/" }, // TODO: real link
  ],
  stats: [
    { value: 8, suffix: "+", label: "Years experience" },
    { value: 100, suffix: "+", label: "Happy clients" },
    { value: 2000, suffix: "+", label: "Projects completed" },
  ],
  statement: {
    eyebrow: "Creativity + [meaning]",
    line1: "Professional and [simple].", // [] = accent word
    line2: "Built to be remembered.",
  },
  reelCaption: "[2000+ projects] for [100+ clients] – logos, brands, packaging and print.",
  aboutHero: { line1: "Designing brands", line2: "people remember", since: "since 2018" },
  availability: "Open for new projects in Sri Lanka and worldwide",
  quickInfo: [
    { label: "Based in", value: "Sri Lanka" },
    { label: "Working", value: "Remote, worldwide" },
    { label: "Focus", value: "Logos, brand identity, packaging, social & print" },
    { label: "Tools", value: "Photoshop, Illustrator, After Effects" },
    { label: "Studio", value: "Graphic design partner, High Solution" },
  ],
};

export type Site = typeof site;
