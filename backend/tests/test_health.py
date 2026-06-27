from fastapi.testclient import TestClient
from backend.schemas.plan import MealPlanCreateRequest


def test_health_endpoint(app):
    client = TestClient(app)
    response = client.get("/api/v1/health")
    assert response.status_code == 200


def test_generate_meal_plan_endpoint(app):
    client = TestClient(app)
    response = client.post(
        "/api/v1/meal-plan/generate",
        json={
            "budget": 50,
            "dietary_preference": "vegetarian",
            "cooking_time": 45,
            "people_count": 2,
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert "breakfast" in payload
    assert "cooking_tasks" in payload
    assert "budget_analysis" in payload


def test_meal_plan_request_validation():
    model = MealPlanCreateRequest(budget=50, dietary_preference="vegan", cooking_time=30, people_count=2)
    assert model.available_cooking_time_minutes == 30
