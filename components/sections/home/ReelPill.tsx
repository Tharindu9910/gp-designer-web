"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "@/lib/useLenis";
import { projects, getMedia } from "@/content/projects";

const thumbs = projects.slice(0, 5).map((p) => getMedia(p.cover).src);
const rotations = [-5, 4, -2, 6, -4];

export default function ReelPill() {
  const ref = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const hoverVideo = useRef<HTMLVideoElement>(null);
  const modalVideo = useRef<HTMLVideoElement>(null);
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();
  useEffect(() => setMounted(true), []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const cards = q<HTMLElement>("[data-thumb]");
      const text = q("[data-reel-text]")[0];
      cards.forEach((c, i) => gsap.set(c, { rotation: rotations[i], zIndex: cards.length - i }));
      if (prefersReducedMotion()) return;

      // Flip-book: every 0.35s the top card drops out and goes to the back; text color alternates.
      const order = [...cards];
      let tick = 0;
      const step = () => {
        const top = order.shift()!;
        order.push(top);
        tick++;
        gsap.to(top, {
          y: 50,
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            order.forEach((c, i) => gsap.set(c, { zIndex: order.length - i }));
            gsap.set(top, { y: 0, opacity: 1 });
          },
        });
        gsap.set(text, { color: tick % 2 ? "var(--accent)" : "var(--fg)" });
      };
      const flip = gsap.timeline({ repeat: -1, paused: true }).call(step, [], 0.35);

      gsap.fromTo(
        capsuleRef.current,
        { scale: 0.85, y: 60 },
        {
          scale: 1.15,
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: capsuleRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            onToggle: (self) => flip.paused(!self.isActive),
          },
        },
      );
    },
    { scope: ref },
  );

  const onEnter = () => {
    setHover(true);
    hoverVideo.current?.play().catch(() => {});
  };
  const onLeave = () => {
    setHover(false);
    hoverVideo.current?.pause();
  };

  // Capsule → full-screen FLIP expansion (0.8s)
  const openModal = () => {
    const modal = modalRef.current;
    if (!modal) return;
    const r = capsuleRef.current!.getBoundingClientRect();
    setOpen(true);
    lenis.current?.stop();
    gsap.set(modal, { visibility: "visible", left: r.left, top: r.top, width: r.width, height: r.height, borderRadius: 999 });
    gsap.to(modal, {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      duration: prefersReducedMotion() ? 0 : 0.8,
      ease: "expo.inOut",
      onComplete: () => {
        modalVideo.current!.currentTime = 0;
        modalVideo.current?.play().catch(() => {});
      },
    });
  };
  const closeModal = () => {
    const modal = modalRef.current!;
    const r = capsuleRef.current!.getBoundingClientRect();
    modalVideo.current?.pause();
    gsap.to(modal, {
      left: r.left,
      top: r.top,
      width: r.width,
      height: r.height,
      borderRadius: 999,
      duration: prefersReducedMotion() ? 0 : 0.7,
      ease: "expo.inOut",
      onComplete: () => {
        gsap.set(modal, { visibility: "hidden" });
        setOpen(false);
        lenis.current?.start();
      },
    });
  };

  return (
    <div ref={ref} className="flex justify-center">
      <button
        ref={capsuleRef}
        onClick={openModal}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        aria-label="Play showreel"
        className="relative isolate grid h-[31vw] w-[86vw] place-items-center overflow-clip rounded-full bg-dark will-change-transform md:h-[13vw] md:w-[36vw]"
      >
        {/* thumbnail flip-book */}
        <span className={`absolute inset-0 grid place-items-center transition-opacity duration-300 ${hover ? "opacity-0" : "opacity-100"}`}>
          {thumbs.map((src, i) => (
            <span
              key={src}
              data-thumb
              className="absolute aspect-[4/5] h-[80%] overflow-hidden rounded-md shadow-xl"
              style={{ zIndex: thumbs.length - i }}
            >
              <Image src={src} alt="" fill sizes="12vw" className="object-cover" />
            </span>
          ))}
        </span>
        {/* hover video */}
        <video
          ref={hoverVideo}
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/video/reel.mp4`}
          muted
          loop
          playsInline
          preload="none"
          poster={`${process.env.NEXT_PUBLIC_BASE_PATH}/video/reel-poster.jpg`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${hover ? "opacity-70" : "opacity-0"}`}
        />
        <span
          data-reel-text
          className="display relative z-10 whitespace-nowrap text-[16vw] font-medium uppercase leading-none text-fg md:text-[6.6vw]"
          style={{ letterSpacing: "-0.05em" }}
        >
          Play Reel
        </span>
      </button>

      {mounted &&
        createPortal(
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Showreel"
        aria-hidden={!open}
        className="invisible fixed z-[100] overflow-hidden bg-dark"
      >
        <video
          ref={modalVideo}
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/video/reel.mp4`}
          controls={open}
          playsInline
          loop
          preload="none"
          poster={`${process.env.NEXT_PUBLIC_BASE_PATH}/video/reel-poster.jpg`}
          className="h-full w-full object-contain"
        />
        <button
          onClick={closeModal}
          className="t-label absolute right-5 top-5 rounded-full bg-accent px-4 py-2.5 font-medium text-on-accent"
        >
          Close ×
        </button>
      </div>,
          document.body,
        )}
    </div>
  );
}
