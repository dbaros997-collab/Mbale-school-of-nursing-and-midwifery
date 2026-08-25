import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "navy" | "secondary" | "outline" | "ghost" | "green";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
};

const variants = {
  primary: "bg-brand-green text-white hover:bg-brand-green-dark shadow-sm",
  green: "bg-brand-green text-white hover:bg-brand-green-dark shadow-sm",
  navy: "bg-primary text-white hover:bg-primary-dark shadow-sm",
  secondary: "bg-brand-sky text-primary hover:bg-brand-sky-soft shadow-sm",
  outline: "border-2 border-primary/30 text-primary hover:bg-brand-sky-soft bg-transparent",
  ghost: "bg-panel text-primary hover:bg-brand-sky-soft border border-border",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled,
  onClick,
  ariaLabel,
}: ButtonProps) {
  const classes = cn(
    "btn-pill inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-ring disabled:opacity-60 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
