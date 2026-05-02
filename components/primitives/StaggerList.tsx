"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, reducedMotionVariants, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  as?: "div" | "ul" | "ol";
};

export function StaggerList({
  children,
  className,
  staggerChildren = 0.08,
  delayChildren = 0.15,
  as = "div",
}: Props) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={
        reduced ? reducedMotionVariants : stagger(staggerChildren, delayChildren)
      }
    >
      {children}
    </Tag>
  );
}

type ItemProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
};

export function StaggerItem({ children, className, as = "div" }: ItemProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={cn(className)}
      variants={reduced ? reducedMotionVariants : fadeUp}
    >
      {children}
    </Tag>
  );
}
