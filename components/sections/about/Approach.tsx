import MaskText from "@/components/motion/MaskText";
import RuleDraw from "@/components/motion/RuleDraw";
import { Accent } from "@/lib/accent";
import { about } from "@/content/about";

export default function Approach() {
  return (
    <section className="px-gutter pt-[clamp(96px,16vh,200px)]">
      <div className="t-label mb-3 text-muted">Approach</div>
      <RuleDraw />
      <MaskText as="p" className="display mt-[clamp(32px,6vh,72px)] text-[clamp(2rem,4.4vw,4.6rem)]">
        {about.approach.lines.map((line) => (
          <span key={line} className="md:block">
            {" "}
            <Accent text={line} />
          </span>
        ))}
      </MaskText>
    </section>
  );
}
