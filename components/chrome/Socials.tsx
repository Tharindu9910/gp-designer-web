import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { site } from "@/content/site";

const icons: Record<string, IconType> = {
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
  WhatsApp: FaWhatsapp,
  YouTube: FaYoutube,
  TikTok: FaTiktok,
  LinkedIn: FaLinkedinIn,
};

export default function Socials({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const ink = tone === "dark" ? "text-inverse" : "text-fg";
  return (
    <ul className={`flex flex-wrap items-center gap-4 ${className}`}>
      {site.socials.map((s) => {
        const Icon = icons[s.label];
        return (
          <li key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className={`grid size-6 place-items-center transition-colors hover:text-accent ${ink}`}
            >
              {Icon ? <Icon size={18} aria-hidden /> : s.short}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
