import type { MealPlanRequest } from "../types/plan";
import type { PlanningValidationErrors } from "../utils/validation";

type PlanningFormProps = {
  id?: string;
  value: MealPlanRequest;
  onChange: (next: MealPlanRequest) => void;
  onSubmit: () => void;
  loading: boolean;
  errors: PlanningValidationErrors;
};

export function PlanningForm({ id, value, onChange, onSubmit, loading, errors }: PlanningFormProps) {
  return (
    <form
      id={id}
      aria-label="planning form"
      className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-neutral-800">Budget</span>
          <input
            aria-label="budget"
            type="number"
            min="0"
            step="0.01"
            className="rounded-xl border border-neutral-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            value={value.budget}
            onChange={(event) => onChange({ ...value, budget: Number(event.target.value) })}
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={errors.budget ? "budget-error" : undefined}
          />
          {errors.budget ? <p id="budget-error" className="text-sm text-red-700">{errors.budget}</p> : null}
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-neutral-800">Dietary preference</span>
          <input
            aria-label="dietary preference"
            className="rounded-xl border border-neutral-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            value={value.dietaryPreference}
            onChange={(event) => onChange({ ...value, dietaryPreference: event.target.value })}
            aria-invalid={Boolean(errors.dietaryPreference)}
            aria-describedby={errors.dietaryPreference ? "diet-error" : undefined}
          />
          {errors.dietaryPreference ? (
            <p id="diet-error" className="text-sm text-red-700">{errors.dietaryPreference}</p>
          ) : null}
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-neutral-800">Cooking time</span>
          <input
            aria-label="cooking time"
            type="number"
            min="1"
            className="rounded-xl border border-neutral-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            value={value.availableCookingTimeMinutes}
            onChange={(event) =>
              onChange({ ...value, availableCookingTimeMinutes: Number(event.target.value) })
            }
            aria-invalid={Boolean(errors.availableCookingTimeMinutes)}
            aria-describedby={errors.availableCookingTimeMinutes ? "time-error" : undefined}
          />
          {errors.availableCookingTimeMinutes ? (
            <p id="time-error" className="text-sm text-red-700">{errors.availableCookingTimeMinutes}</p>
          ) : null}
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-neutral-800">People</span>
          <input
            aria-label="number of people"
            type="number"
            min="1"
            className="rounded-xl border border-neutral-300 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            value={value.peopleCount}
            onChange={(event) => onChange({ ...value, peopleCount: Number(event.target.value) })}
            aria-invalid={Boolean(errors.peopleCount)}
            aria-describedby={errors.peopleCount ? "people-error" : undefined}
          />
          {errors.peopleCount ? (
            <p id="people-error" className="text-sm text-red-700">{errors.peopleCount}</p>
          ) : null}
        </label>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-600">ChopChop will generate a mocked meal plan and cooking workflow.</p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-2.5 font-medium text-white transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-amber-300"
        >
          {loading ? "Generating..." : "Generate meal plan"}
        </button>
      </div>
    </form>
  );
}
