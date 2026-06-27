from backend.services.meal_planner_service import MealPlannerService


class PlanService(MealPlannerService):
    """Compatibility wrapper while the app transitions to the dedicated meal planner service."""
