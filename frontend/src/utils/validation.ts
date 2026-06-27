import type { MealPlanRequest } from "../types/plan";

export type PlanningValidationErrors = Partial<Record<keyof MealPlanRequest, string>>;

export function validateMealPlanRequest(request: MealPlanRequest): PlanningValidationErrors {
  const errors: PlanningValidationErrors = {};

  if (!Number.isFinite(request.budget) || request.budget <= 0) {
    errors.budget = "Enter a budget greater than 0.";
  }

  if (!request.dietaryPreference.trim()) {
    errors.dietaryPreference = "Enter a dietary preference.";
  }

  if (!Number.isFinite(request.availableCookingTimeMinutes) || request.availableCookingTimeMinutes < 10) {
    errors.availableCookingTimeMinutes = "Cooking time should be at least 10 minutes.";
  }

  if (!Number.isFinite(request.peopleCount) || request.peopleCount < 1) {
    errors.peopleCount = "Enter at least 1 person.";
  }

  return errors;
}

export function hasValidationErrors(errors: PlanningValidationErrors): boolean {
  return Object.values(errors).some(Boolean);
}
