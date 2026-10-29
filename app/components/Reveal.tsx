"use client";

import { useEffect, useRef, type ElementType, type HTMLAttributes } from "react";

// Fades its content in when it scrolls into view (styles in globals.css).
//
// variant  direction it comes from: up, down, left, right, zoom or fade; leave it out for no effect
// stagger  reveal each child in turn instead of the whole block
// as       the element to render, e.g. "section", "ul", "form"
//
// The "seen" mark (data-in) is set from this component's own effect, after React has hydrated it:
// marking server HTML before that would make it differ from what React expects.
type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  variant?: "up" | "down" | "left" | "right" | "zoom" | "fade";
  stagger?: boolean;
};

let observer: IntersectionObserver | undefined;

function watch(el: Element) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-in", "");
        observer!.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  if (!el.hasAttribute("data-in")) observer.observe(el);
}

export default function Reveal({ as: Tag = "div", variant, stagger = false, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !variant) return;
    // With reduced motion there's no "motion" class and nothing is hidden, so nothing to watch.
    if (!document.documentElement.classList.contains("motion")) return;
    if (!stagger) {
      watch(el);
      return () => observer?.unobserve(el);
    }
    // Children can change later (filters, sorting), so keep watching new ones.
    const watchChildren = () => Array.from(el.children).forEach(watch);
    watchChildren();
    const children = new MutationObserver(watchChildren);
    children.observe(el, { childList: true });
    return () => {
      children.disconnect();
      Array.from(el.children).forEach((c) => observer?.unobserve(c));
    };
  }, [variant, stagger]);

  return (
    <Tag
      ref={ref}
      data-reveal={variant && !stagger ? variant : undefined}
      data-stagger={variant && stagger ? variant : undefined}
      {...rest}
    />
  );
}
