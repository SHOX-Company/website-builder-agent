import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
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
      <input
        ref={ref}
        id={id}
        className={`w-full bg-brand-dark border border-brand-border rounded-md px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors duration-150 ${className}`}
        {...props}
      />
    </div>
  );
});

export default Input;
