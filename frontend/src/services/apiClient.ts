import type { MealPlanRequest, MealPlanResponse } from "../types/plan";

const baseUrl = "/api/v1";

type RawMealPlanResponse = {
  breakfast: MealPlanResponse["breakfast"];
  lunch: MealPlanResponse["lunch"];
  dinner: MealPlanResponse["dinner"];
  grocery_list: Array<{
    name: string;
    quantity: string;
    estimated_cost: number;
  }>;
  substitutions: MealPlanResponse["substitutions"];
  budget_analysis: {
    estimated_total: number;
    remaining_budget: number;
    is_within_budget: boolean;
    summary: string;
  };
  cooking_tasks: Array<{
    title: string;
    duration_minutes: number;
    status: MealPlanResponse["cooking_tasks"][number]["status"];
    note: string;
  }>;
  completion_message: string;
};

async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return (await response.json()) as TResponse;
}

export function normalizeMealPlanResponse(payload: RawMealPlanResponse): MealPlanResponse {
  return {
    breakfast: payload.breakfast,
    lunch: payload.lunch,
    dinner: payload.dinner,
    grocery_list: payload.grocery_list.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      estimatedCost: item.estimated_cost,
    })),
    substitutions: payload.substitutions,
    budget_analysis: {
      estimatedTotal: payload.budget_analysis.estimated_total,
      remainingBudget: payload.budget_analysis.remaining_budget,
      isWithinBudget: payload.budget_analysis.is_within_budget,
      summary: payload.budget_analysis.summary,
    },
    cooking_tasks: payload.cooking_tasks.map((task) => ({
      title: task.title,
      durationMinutes: task.duration_minutes,
      status: task.status,
      note: task.note,
    })),
    completion_message: payload.completion_message,
  };
}

export const apiClient = {
  async generateMealPlan(payload: MealPlanRequest): Promise<MealPlanResponse> {
    const response = await postJson<RawMealPlanResponse>("/meal-plan/generate", {
      budget: payload.budget,
      dietary_preference: payload.dietaryPreference,
      cooking_time: payload.availableCookingTimeMinutes,
      people_count: payload.peopleCount,
    });

    return normalizeMealPlanResponse(response);
  },
};
