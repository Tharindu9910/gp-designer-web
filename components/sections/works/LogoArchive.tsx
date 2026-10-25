import MaskText from "@/components/motion/MaskText";
import { Accent } from "@/lib/accent";
import { Shot } from "@/components/sections/project/ProjectGallery";
import { media } from "@/content/media.generated";

/** The full logo collection under the project stream: proof of volume for clients. */
export default function LogoArchive() {
  return (
    <section className="relative z-10 px-gutter pb-[18vh] pt-[10vh]" aria-labelledby="archive">
      <div id="archive" className="t-label mb-6 text-muted">
        Logo archive
      </div>
      <MaskText as="h2" className="display mb-[8vh] text-[clamp(2.4rem,5.4vw,5.6rem)]">
        <Accent text="And [200+] more marks" />
      </MaskText>
      <div className="mx-auto max-w-[1500px] space-y-4 md:space-y-6">
        <Shot media={media["logo-wall/light"]} />
        <Shot media={media["logo-wall/dark"]} />
      </div>
    </section>
  );
}
