import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, id, className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-xs uppercase tracking-widest text-brand-muted font-sans">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`w-full bg-brand-dark border border-brand-border rounded-md px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors duration-150 resize-y ${className}`}
        {...props}
      />
    </div>
  );
});

export default Textarea;
