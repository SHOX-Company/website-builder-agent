import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg" | "none";
  hover?: boolean;
}

const PADDING = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  padding = "md",
  hover = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-brand-surface border border-brand-border rounded-lg ${PADDING[padding]} ${
        hover ? "transition-colors duration-200 hover:border-brand-gold/40" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
