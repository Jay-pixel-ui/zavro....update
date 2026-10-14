import { Plus } from "lucide-react";

export default function Faq({ items, idPrefix = "faq" }) {
  return (
    <div className="divide-y divide-white/10 border-y border-white/10" data-testid={`${idPrefix}-list`}>
      {items.map((f, i) => (
        <details key={f.q} className="group py-1" data-testid={`${idPrefix}-item-${i}`}>
          <summary className="flex min-h-[56px] items-center justify-between gap-6 py-4 text-left text-[17px] font-medium text-white sm:text-lg">
            {f.q}
            <Plus className="faq-icon h-5 w-5 shrink-0 text-z-cyan transition-transform duration-300" aria-hidden="true" />
          </summary>
          <p className="max-w-3xl pb-6 text-z-body">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
