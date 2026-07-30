import { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto border border-brand-border rounded-lg">
      <table className="w-full text-sm text-left border-collapse">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-brand-surface-2 border-b border-brand-border">
      <tr>{children}</tr>
    </thead>
  );
}

export function TableHeaderCell({ children }: { children: ReactNode }) {
  return (
    <th className="px-5 py-3 text-xs uppercase tracking-widest font-sans font-medium text-brand-muted whitespace-nowrap">
      {children}
    </th>
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-brand-border">{children}</tbody>;
}

export function TableRow({ children }: { children: ReactNode }) {
  return <tr className="bg-brand-surface hover:bg-brand-surface-2/60 transition-colors duration-150">{children}</tr>;
}

export function TableCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-5 py-3.5 text-brand-text align-middle ${className}`}>{children}</td>;
}
