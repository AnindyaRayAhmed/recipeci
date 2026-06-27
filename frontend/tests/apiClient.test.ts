import { describe, expect, it } from "vitest";
import { normalizeMealPlanResponse } from "../src/services/apiClient";

describe("meal plan API normalization", () => {
  it("maps nested snake_case response fields into the frontend contract", () => {
    const normalized = normalizeMealPlanResponse({
      breakfast: [{ title: "Fruit bowl", description: "Seasonal fruit and yogurt" }],
      lunch: [],
      dinner: [],
      grocery_list: [{ name: "Fruit", quantity: "1 bowl", estimated_cost: 4 }],
      substitutions: [],
      budget_analysis: {
        estimated_total: 22,
        remaining_budget: 18,
        is_within_budget: true,
        summary: "Within budget",
      },
      cooking_tasks: [{ title: "Wash fruit", duration_minutes: 5, status: "Pending", note: "Quick rinse" }],
      completion_message: "",
    });

    expect(normalized.grocery_list[0].estimatedCost).toBe(4);
    expect(normalized.budget_analysis.estimatedTotal).toBe(22);
    expect(normalized.cooking_tasks[0].durationMinutes).toBe(5);
  });
});
