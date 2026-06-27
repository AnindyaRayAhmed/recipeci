export type MealPlanRequest = {
  budget: number;
  dietaryPreference: string;
  availableCookingTimeMinutes: number;
  peopleCount: number;
};

export type MealItem = {
  title: string;
  description: string;
};

export type GroceryItem = {
  name: string;
  quantity: string;
  estimatedCost: number;
};

export type SubstitutionItem = {
  ingredient: string;
  substitute: string;
  reason: string;
};

export type CookingTaskStatus = "Pending" | "In Progress" | "Done";

export type CookingTask = {
  title: string;
  durationMinutes: number;
  status: CookingTaskStatus;
  note: string;
};

export type MealPlanResponse = {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  grocery_list: GroceryItem[];
  substitutions: SubstitutionItem[];
  budget_analysis: {
    estimatedTotal: number;
    remainingBudget: number;
    isWithinBudget: boolean;
    summary: string;
  };
  cooking_tasks: CookingTask[];
  completion_message: string;
};
