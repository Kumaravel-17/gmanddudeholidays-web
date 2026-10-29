import Image from "next/image";
import Parallax from "./Parallax";

// Photo-only banner; `title` is the page's (visually hidden) heading, since the image carries its
// own text. The crop below suits images with the headline top left and the buses in the middle.
export default function PhotoBanner({ title, image }: { title: string; image: { src: string; alt: string } }) {
  return (
    // Desktop fills most of the screen below the navbar. Smaller screens use a 3:2 frame, the tallest that
    // still fits the "PREMIUM BUS TRAVEL" text and the Kiran bus; the crop is shifted left of
    // centre to keep both in view.
    <section className="relative aspect-3/2 overflow-hidden w-full lg:aspect-auto lg:h-[calc(100svh-72px-5rem)]">
      <h1 className="sr-only">{title}</h1>
      <Parallax speed={0.3} hero>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-[20%_top] lg:object-top"
        />
      </Parallax>
      {/* Light white tint on desktop only; on phones the image's own
          text needs full contrast */}
      <div className="absolute inset-0 hidden bg-white/10 lg:block" />
    </section>
  );
}
