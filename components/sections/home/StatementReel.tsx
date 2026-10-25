import MaskText from "@/components/motion/MaskText";
import { Accent } from "@/lib/accent";
import { site } from "@/content/site";
import ReelPill from "./ReelPill";

const [captionA, captionB] = site.reelCaption.split("– ");

export default function StatementReel() {
  return (
    <section className="px-gutter pb-[18vh] pt-[22vh] text-center">
      <MaskText as="p" className="t-label mb-8 opacity-80" start="top 70%">
        <Accent text={site.statement.eyebrow} />
      </MaskText>
      <MaskText as="h2" className="display mx-auto max-w-[22ch] text-[clamp(2.4rem,5.4vw,5.6rem)]" start="top 70%">
        <span className="block">
          <Accent text={site.statement.line1} />
        </span>
        <span className="block">{site.statement.line2}</span>
      </MaskText>

      <div className="mt-[14vh]">
        <ReelPill />
      </div>

      <div data-shift-trigger className="mt-[16vh]">
        <MaskText as="p" className="t-statement mx-auto">
          <span className="block">
            <Accent text={`${captionA}–`} />
          </span>
          <span className="block">
            <Accent text={captionB} />
          </span>
        </MaskText>
      </div>
    </section>
  );
}
