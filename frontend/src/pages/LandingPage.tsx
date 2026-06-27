import { useMemo } from "react";
import { LandingHero } from "../components/LandingHero";
import { PlanningForm } from "../components/PlanningForm";
import { MealPlanCard } from "../components/MealPlanCard";
import { GroceryListPanel } from "../components/GroceryListPanel";
import { BudgetSummary } from "../components/BudgetSummary";
import { SubstitutionSuggestions } from "../components/SubstitutionSuggestions";
import { CookingKanban } from "../components/CookingKanban";
import { ChatWindow } from "../components/ChatWindow";
import { CompletionBanner } from "../components/CompletionBanner";
import { useMealPlanSession } from "../hooks/useMealPlanSession";
import { AppHeader } from "../components/AppHeader";

export function LandingPage() {
  const session = useMealPlanSession();
  const allDone = useMemo(() => session.completeWhenDone, [session.completeWhenDone]);

  const visiblePlan = session.plan;

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl gap-6 px-4 py-6 md:px-6 lg:px-8">
      <AppHeader />
      <LandingHero />
      <PlanningForm
        id="planning-form"
        value={session.request}
        onChange={session.setRequest}
        onSubmit={session.generateMealPlan}
        loading={session.loading}
        errors={session.validationErrors}
      />
      {session.loading ? (
        <p
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <img
            src="/recipeci-logo.svg"
            alt=""
            aria-hidden="true"
            width={20}
            height={20}
            className="h-5 w-5 shrink-0 opacity-80"
          />
          ChopChop is generating your meal plan...
        </p>
      ) : null}
      {session.error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {session.error}
        </p>
      ) : null}
      {visiblePlan ? (
        <>
          <section aria-label="meal planning results" className="grid gap-4 xl:grid-cols-2">
            <div className="grid gap-4">
              <BudgetSummary {...visiblePlan.budget_analysis} />
              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
                <MealPlanCard title="Breakfast" items={visiblePlan.breakfast} />
                <MealPlanCard title="Lunch" items={visiblePlan.lunch} />
                <MealPlanCard title="Dinner" items={visiblePlan.dinner} />
              </div>
            </div>
            <div className="grid gap-4">
              <GroceryListPanel items={visiblePlan.grocery_list} />
              <SubstitutionSuggestions items={visiblePlan.substitutions} />
              <ChatWindow
                message={
                  session.startedCooking
                    ? "Cooking mode active. Keep moving tasks forward."
                    : "Review the plan, then start cooking."
                }
              />
            </div>
          </section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-600">
              Tip: click each task again to move it from Pending to In Progress to Done.
            </p>
            <button
              type="button"
              onClick={session.startCooking}
              disabled={session.startedCooking || !visiblePlan.cooking_tasks.length}
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-2.5 font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              Start Cooking
            </button>
          </div>
          {session.startedCooking ? (
            <CookingKanban tasks={visiblePlan.cooking_tasks} onAdvance={session.updateTaskStatus} />
          ) : null}
          <CompletionBanner visible={allDone} />
        </>
      ) : null}
    </main>
  );
}
