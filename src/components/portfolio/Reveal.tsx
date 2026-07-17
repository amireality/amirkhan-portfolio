import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SplitHeading({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  if (reduce) return <h1 className={className}>{text}</h1>;
  return (
    <h1 className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pr-[0.25em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}