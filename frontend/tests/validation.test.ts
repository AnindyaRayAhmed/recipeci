import { describe, expect, it } from "vitest";
import { validateMealPlanRequest } from "../src/utils/validation";

describe("meal plan validation", () => {
  it("flags invalid request fields", () => {
    const errors = validateMealPlanRequest({
      budget: 0,
      dietaryPreference: "",
      availableCookingTimeMinutes: 5,
      peopleCount: 0,
    });

    expect(errors.budget).toBeTruthy();
    expect(errors.dietaryPreference).toBeTruthy();
    expect(errors.availableCookingTimeMinutes).toBeTruthy();
    expect(errors.peopleCount).toBeTruthy();
  });
});
