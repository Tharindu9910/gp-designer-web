import type { Metadata } from "next";
import ScatterStream from "@/components/sections/works/ScatterStream";
import LogoArchive from "@/components/sections/works/LogoArchive";

export const metadata: Metadata = { title: "Works" };

export default function WorksPage() {
  return (
    <>
      <ScatterStream />
      <LogoArchive />
    </>
  );
}
