import { motion, useReducedMotion } from "motion/react";
import { useRef, useState, type ReactNode, type MouseEvent } from "react";

export function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  type,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [xy, setXy] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const handleMove = (e: MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    setXy({ x: x * 0.3, y: y * 0.3 });
  };
  const handleLeave = () => setXy({ x: 0, y: 0 });

  const inner = (
    <motion.div
      animate={{ x: xy.x, y: xy.y }}
      transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a
        href={href}
        ref={ref as never}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="inline-block"
      >
        {inner}
      </a>
    );
  }
  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="inline-block"
    >
      <button type={type ?? "button"} onClick={onClick} disabled={disabled} className="block w-full disabled:cursor-not-allowed">
        {inner}
      </button>
    </div>
  );
}