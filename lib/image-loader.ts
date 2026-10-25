// Used only for the static export (see next.config.ts): serves the original file from public/.
export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  return src.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH}${src}` : src;
}
