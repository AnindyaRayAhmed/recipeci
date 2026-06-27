type BudgetSummaryProps = {
  estimatedTotal: number;
  remainingBudget: number;
  isWithinBudget: boolean;
  summary: string;
};

export function BudgetSummary({ estimatedTotal, remainingBudget, isWithinBudget, summary }: BudgetSummaryProps) {
  return (
    <section aria-label="budget summary" className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-900">Budget summary</h3>
      <p className="mt-2 text-sm text-neutral-700">{summary}</p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-neutral-50 p-3">
          <dt className="text-sm text-neutral-600">Estimated total</dt>
          <dd className="mt-1 text-lg font-semibold text-neutral-900">${estimatedTotal.toFixed(2)}</dd>
        </div>
        <div className="rounded-xl bg-neutral-50 p-3">
          <dt className="text-sm text-neutral-600">Remaining budget</dt>
          <dd className="mt-1 text-lg font-semibold text-neutral-900">${remainingBudget.toFixed(2)}</dd>
        </div>
        <div className="rounded-xl bg-neutral-50 p-3">
          <dt className="text-sm text-neutral-600">Status</dt>
          <dd className={`mt-1 text-lg font-semibold ${isWithinBudget ? "text-emerald-700" : "text-red-700"}`}>
            {isWithinBudget ? "Within budget" : "Over budget"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
