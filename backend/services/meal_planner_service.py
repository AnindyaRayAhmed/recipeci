import logging

from pydantic import ValidationError

from backend.schemas.plan import (
    BudgetAnalysis,
    CookingTask,
    GroceryItem,
    MealItem,
    MealPlanCreateRequest,
    MealPlanResponse,
    SubstitutionItem,
    TaskStatus,
)
from backend.services.gemini_service import GeminiService, GeminiServiceError


logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are ChopChop, a structured meal planning assistant for ReciPeci.
Generate realistic meal plans using the user's budget, dietary preference, time limit, and people count.
Optimize for practical home cooking, useful grocery lists, realistic substitutions, and safe cooking steps.
Cooking tasks must be chronological and dependency-aware.
Do not provide unsafe or unrealistic cooking advice.
Return strict JSON only with no markdown, no code fences, and no extra commentary.
All cooking task statuses must be "Pending".
The completion_message field must be an empty string.
""".strip()


class MealPlannerService:
    def __init__(self, gemini_service: GeminiService | None = None) -> None:
        self.gemini_service = gemini_service or GeminiService()

    def create_plan(self, payload: MealPlanCreateRequest) -> MealPlanResponse:
        try:
            generated = self.gemini_service.generate_structured_json(
                system_instruction=SYSTEM_PROMPT,
                user_prompt=self._build_user_prompt(payload),
                response_schema=MealPlanResponse,
            )
            plan = MealPlanResponse.model_validate(generated)
            return self._normalize_generated_plan(plan)
        except (GeminiServiceError, ValidationError, ValueError, TypeError) as exc:
            logger.warning("Falling back to deterministic meal plan: %s", exc)
            return self._build_fallback_plan(payload)

    def _normalize_generated_plan(self, plan: MealPlanResponse) -> MealPlanResponse:
        return plan.model_copy(
            update={
                "completion_message": "",
                "cooking_tasks": [
                    task.model_copy(update={"status": TaskStatus.pending}) for task in plan.cooking_tasks
                ],
            }
        )

    def _build_user_prompt(self, payload: MealPlanCreateRequest) -> str:
        dietary_preference = payload.dietary_preference.strip()
        return f"""
Create a meal plan for {payload.people_count} people.
Budget: {payload.budget:.2f} USD total.
Dietary preference: {dietary_preference}.
Available cooking time: {payload.available_cooking_time_minutes} minutes.

Return JSON matching this structure:
- breakfast: array of meal items with title and description
- lunch: array of meal items with title and description
- dinner: array of meal items with title and description
- grocery_list: array of grocery items with name, quantity, estimated_cost
- substitutions: array of substitution items with ingredient, substitute, reason
- budget_analysis: object with estimated_total, remaining_budget, is_within_budget, summary
- cooking_tasks: array of chronological cooking tasks with title, duration_minutes, status, note
- completion_message: empty string

Constraints:
- Keep the plan realistic for a single household grocery run.
- Grocery quantities should be practical.
- Budget analysis should reflect the user's total budget.
- Cooking tasks must be in the order someone would actually perform them.
- All task statuses must be "Pending".
""".strip()

    def _build_fallback_plan(self, payload: MealPlanCreateRequest) -> MealPlanResponse:
        estimated_total = round(
            18.75 + (payload.people_count * 7.85) + (payload.available_cooking_time_minutes * 0.35),
            2,
        )
        remaining_budget = round(payload.budget - estimated_total, 2)
        within_budget = remaining_budget >= 0

        return MealPlanResponse(
            breakfast=[
                MealItem(title="Yogurt parfait", description="Greek yogurt, berries, and toasted oats"),
            ],
            lunch=[
                MealItem(title="Chickpea grain bowl", description="Roasted chickpeas, greens, rice, and lemon dressing"),
            ],
            dinner=[
                MealItem(title="Sheet-pan herb chicken", description="Chicken, vegetables, olive oil, and garlic rice"),
            ],
            grocery_list=[
                GroceryItem(name="Greek yogurt", quantity="2 tubs", estimated_cost=4.99),
                GroceryItem(name="Berries", quantity="2 pints", estimated_cost=6.49),
                GroceryItem(name="Chickpeas", quantity="2 cans", estimated_cost=2.58),
                GroceryItem(name="Chicken thighs", quantity="2 lb", estimated_cost=9.98),
                GroceryItem(name="Mixed vegetables", quantity="3 bags", estimated_cost=7.50),
            ],
            substitutions=[
                SubstitutionItem(
                    ingredient="Chicken thighs",
                    substitute="Tofu or tempeh",
                    reason=self._fit_diet(payload.dietary_preference),
                ),
                SubstitutionItem(
                    ingredient="Greek yogurt",
                    substitute="Unsweetened coconut yogurt",
                    reason="Keeps the breakfast creamy for dairy-free diets",
                ),
            ],
            budget_analysis=BudgetAnalysis(
                estimated_total=estimated_total,
                remaining_budget=remaining_budget,
                is_within_budget=within_budget,
                summary=(
                    "This plan stays within budget." if within_budget else "This plan exceeds budget and should be adjusted."
                ),
            ),
            cooking_tasks=[
                CookingTask(
                    title="Wash and prep produce",
                    duration_minutes=10,
                    status=TaskStatus.pending,
                    note="Rinse berries, greens, and vegetables before cooking.",
                ),
                CookingTask(
                    title="Start rice and grain base",
                    duration_minutes=15,
                    status=TaskStatus.pending,
                    note="Cook rice first so it is ready for lunch and dinner.",
                ),
                CookingTask(
                    title="Cook lunch components",
                    duration_minutes=20,
                    status=TaskStatus.pending,
                    note="Roast chickpeas and assemble the grain bowl.",
                ),
                CookingTask(
                    title="Finish dinner",
                    duration_minutes=25,
                    status=TaskStatus.pending,
                    note="Bake the sheet-pan dinner and plate the meal.",
                ),
            ],
            completion_message="",
        )

    def _fit_diet(self, dietary_preference: str) -> str:
        if "vegan" in dietary_preference.lower():
            return "Aligned with vegan preferences and keeps protein high."
        if "vegetarian" in dietary_preference.lower():
            return "Supports a vegetarian-friendly variation."
        return "A flexible protein swap for this meal plan."
