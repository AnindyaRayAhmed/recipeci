import type { MealItem } from "../types/plan";

type MealPlanCardProps = {
  title: string;
  items: MealItem[];
};

export function MealPlanCard({ title, items }: MealPlanCardProps) {
  return (
    <section aria-label={title} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <ul className="mt-3 grid gap-3">
        {items.map((item) => (
          <li key={item.title} className="rounded-xl bg-neutral-50 p-3">
            <strong className="block text-neutral-900">{item.title}</strong>
            <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
