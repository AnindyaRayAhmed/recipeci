import type { GroceryItem } from "../types/plan";

type GroceryListPanelProps = {
  items: GroceryItem[];
};

export function GroceryListPanel({ items }: GroceryListPanelProps) {
  return (
    <aside aria-label="grocery list" className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-900">Grocery list</h3>
      <ul className="mt-3 grid gap-2">
        {items.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-3 rounded-xl bg-neutral-50 px-3 py-2">
            <span className="font-medium text-neutral-800">{item.name}</span>
            <span className="text-sm text-neutral-600">{item.quantity}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
