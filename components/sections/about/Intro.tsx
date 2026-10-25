import Image from "next/image";
import MaskText from "@/components/motion/MaskText";
import Parallax from "@/components/motion/Parallax";
import { Accent } from "@/lib/accent";
import { about } from "@/content/about";
import { media } from "@/content/media.generated";

// Mobile reads heading → paragraph → photo; desktop puts the paragraph in an offset right column.
export default function Intro() {
  return (
    <section className="grid gap-x-10 gap-y-8 px-gutter pb-[clamp(80px,14vh,200px)] pt-[clamp(72px,14vh,180px)] lg:grid-cols-12 lg:gap-y-[clamp(40px,8vh,96px)]">
      <MaskText as="h2" className="t-statement max-w-[26ch] text-balance lg:col-span-8 lg:max-w-[30ch]">
        {about.intro.line1} {about.intro.line2}
      </MaskText>

      <div className="lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:pt-[clamp(48px,12vh,160px)]">
        <MaskText as="p" className="max-w-[46ch] text-base leading-relaxed text-fg/80 lg:text-[17px]">
          <Accent text={about.intro.side} />
        </MaskText>
        <ul className="mt-6 flex flex-wrap gap-2 text-xs text-fg/70">
          {about.tools.map((t) => (
            <li key={t} className="rounded-full border border-[var(--line)] px-3 py-1.5">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <Parallax speed={1.2} className="mt-4 w-[min(64vw,300px)] lg:col-span-7 lg:mt-0 lg:w-[min(18vw,320px)]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md">
          <Image
            src={media.portrait.src}
            alt={media.portrait.alt}
            fill
            sizes="(max-width: 1024px) 300px, 18vw"
            className="object-cover object-top grayscale"
          />
        </div>
      </Parallax>
    </section>
  );
}
