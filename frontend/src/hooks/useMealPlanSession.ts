import { useState } from "react";
import type { MealPlanRequest, MealPlanResponse } from "../types/plan";
import { apiClient } from "../services/apiClient";
import { hasValidationErrors, validateMealPlanRequest, type PlanningValidationErrors } from "../utils/validation";
import { areAllTasksDone, advanceCookingTaskStatuses } from "../utils/cookingWorkflow";

const initialRequest: MealPlanRequest = {
  budget: 45,
  dietaryPreference: "balanced",
  availableCookingTimeMinutes: 45,
  peopleCount: 2,
};

export function useMealPlanSession() {
  const [request, setRequest] = useState<MealPlanRequest>(initialRequest);
  const [plan, setPlan] = useState<MealPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startedCooking, setStartedCooking] = useState(false);
  const [validationErrors, setValidationErrors] = useState<PlanningValidationErrors>({});

  async function generateMealPlan() {
    const nextErrors = validateMealPlanRequest(request);
    setValidationErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      setError("Please review the highlighted fields.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.generateMealPlan(request);
      setPlan(response);
      setStartedCooking(false);
    } catch (err) {
      setError("We could not generate a meal plan right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function updateTaskStatus(taskTitle: string) {
    if (!plan) return;
    const updatedTasks = advanceCookingTaskStatuses(plan.cooking_tasks, taskTitle);

    setPlan({
      ...plan,
      cooking_tasks: updatedTasks,
      completion_message: areAllTasksDone(updatedTasks)
        ? "Great work. ChopChop is proud of your completed cooking session."
        : "",
    });
  }

  function startCooking() {
    setStartedCooking(true);
    if (plan?.cooking_tasks?.length) {
      const firstPending = plan.cooking_tasks.find((task) => task.status === "Pending");
      if (firstPending) updateTaskStatus(firstPending.title, "In Progress");
    }
  }

  return {
    request,
    setRequest,
    plan,
    loading,
    error,
    validationErrors,
    startedCooking,
    generateMealPlan,
    startCooking,
    updateTaskStatus,
    completeWhenDone: Boolean(plan && areAllTasksDone(plan.cooking_tasks)),
  };
}
