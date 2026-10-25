"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useTransition } from "./TransitionProvider";

type Props = ComponentProps<typeof Link> & {
  href: string;
  /** Selector (inside the link) of the image to FLIP into the next page's hero. */
  flipSelector?: string;
};

export default function TransitionLink({ href, flipSelector, onClick, children, ...rest }: Props) {
  const { navigate } = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const flipFrom = flipSelector ? e.currentTarget.querySelector<HTMLElement>(flipSelector) : null;
    navigate(href, { flipFrom });
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
