from backend.schemas.plan import MealPlanCreateRequest
from backend.services.gemini_service import GeminiServiceError
from backend.services.meal_planner_service import MealPlannerService


class FakeGeminiService:
    def __init__(self, payload=None, error: Exception | None = None):
        self.payload = payload
        self.error = error

    def generate_structured_json(self, **_kwargs):
        if self.error is not None:
            raise self.error
        return self.payload


def build_request() -> MealPlanCreateRequest:
    return MealPlanCreateRequest(
        budget=55,
        dietary_preference="vegetarian",
        cooking_time=40,
        people_count=2,
    )


def test_meal_planner_returns_valid_gemini_payload():
    service = MealPlannerService(
        gemini_service=FakeGeminiService(
            payload={
                "breakfast": [{"title": "Overnight oats", "description": "Oats, milk, and fruit"}],
                "lunch": [{"title": "Lentil wrap", "description": "Lentils, greens, and flatbread"}],
                "dinner": [{"title": "Veggie stir-fry", "description": "Tofu, broccoli, and rice"}],
                "grocery_list": [{"name": "Oats", "quantity": "1 bag", "estimated_cost": 4.5}],
                "substitutions": [
                    {"ingredient": "Tofu", "substitute": "Tempeh", "reason": "Keeps the meal high in protein"}
                ],
                "budget_analysis": {
                    "estimated_total": 27.5,
                    "remaining_budget": 27.5,
                    "is_within_budget": True,
                    "summary": "The plan is comfortably within budget.",
                },
                "cooking_tasks": [
                    {
                        "title": "Rinse rice",
                        "duration_minutes": 5,
                        "status": "Pending",
                        "note": "Prep the rice before heating the pan.",
                    }
                ],
                "completion_message": "",
            }
        )
    )

    plan = service.create_plan(build_request())

    assert plan.breakfast[0].title == "Overnight oats"
    assert plan.cooking_tasks[0].status == "Pending"


def test_meal_planner_falls_back_on_gemini_failure():
    service = MealPlannerService(gemini_service=FakeGeminiService(error=GeminiServiceError("boom")))

    plan = service.create_plan(build_request())

    assert plan.breakfast
    assert plan.cooking_tasks
    assert plan.completion_message == ""


def test_meal_planner_falls_back_on_invalid_payload():
    service = MealPlannerService(
        gemini_service=FakeGeminiService(
            payload={
                "breakfast": [],
                "lunch": [],
                "dinner": [],
                "grocery_list": [],
                "substitutions": [],
                "budget_analysis": {"estimated_total": 10, "remaining_budget": 5, "is_within_budget": True, "summary": "ok"},
                "cooking_tasks": [{"title": "Cook", "status": "Wrong", "note": "bad", "duration_minutes": 5}],
                "completion_message": "",
            }
        )
    )

    plan = service.create_plan(build_request())

    assert plan.cooking_tasks[0].status == "Pending"
