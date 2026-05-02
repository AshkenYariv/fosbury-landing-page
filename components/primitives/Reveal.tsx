"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { fadeUp, reducedMotionVariants, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  as?: "div" | "section" | "article" | "header" | "footer";
};

export function Reveal({
  children,
  className,
  delay = 0,
  variants,
  as = "div",
}: Props) {
  const reduced = useReducedMotion();
  const v = reduced ? reducedMotionVariants : variants ?? fadeUp;
  const Tag = motion[as];

  return (
    <Tag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={v}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}
