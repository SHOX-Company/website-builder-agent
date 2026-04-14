import { HTMLAttributes } from "react";

interface SectionWrapperProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  as?: "section" | "div" | "article";
  tight?: boolean;
}

export default function SectionWrapper({
  id,
  as: Tag = "section",
  tight = false,
  className = "",
  children,
  ...props
}: SectionWrapperProps) {
  const padding = tight ? "py-16" : "py-24";
  return (
    <Tag
      id={id}
      className={`${padding} ${className}`}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-6">{children}</div>
    </Tag>
  );
}
