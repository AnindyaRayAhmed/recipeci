import type { SubstitutionItem } from "../types/plan";

type SubstitutionSuggestionsProps = {
  items: SubstitutionItem[];
};

export function SubstitutionSuggestions({ items }: SubstitutionSuggestionsProps) {
  return (
    <section aria-label="substitution suggestions" className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-900">Substitutions</h3>
      <ul className="mt-3 grid gap-3">
        {items.map((item) => (
          <li key={`${item.ingredient}-${item.substitute}`} className="rounded-xl bg-neutral-50 p-3">
            <strong className="block text-neutral-900">{item.ingredient}</strong>
            <p className="mt-1 text-sm text-neutral-700">{item.substitute}</p>
            <p className="mt-1 text-sm text-neutral-500">{item.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
