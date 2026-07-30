interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export default function Switch({ checked, onChange, label, description }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-4 w-full text-left"
    >
      <span className="flex flex-col gap-0.5">
        <span className="text-sm text-brand-text font-sans">{label}</span>
        {description && <span className="text-xs text-brand-muted">{description}</span>}
      </span>
      <span
        className={`relative inline-flex flex-shrink-0 w-10 h-6 rounded-full transition-colors duration-200 ${
          checked ? "bg-brand-gold" : "bg-brand-surface-2 border border-brand-border"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-brand-dark shadow transition-transform duration-200 ${
            checked ? "translate-x-4 bg-brand-dark" : "translate-x-0 bg-brand-muted"
          }`}
        />
      </span>
    </button>
  );
}
