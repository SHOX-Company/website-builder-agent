import { formatPrice } from "@/lib/inventory";

export default function PriceDisplay({
  price,
  label = "Acquisition price",
}: {
  price: number | null;
  label?: string;
}) {
  const isInquiry = price === null;
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-brand-muted/40 text-[10px] uppercase tracking-[0.25em] font-sans">
        {isInquiry ? "Private acquisition" : label}
      </p>
      <p
        className={`font-display font-light text-brand-text ${
          isInquiry ? "text-2xl italic text-brand-text/60" : "text-4xl"
        }`}
      >
        {formatPrice(price)}
      </p>
    </div>
  );
}
