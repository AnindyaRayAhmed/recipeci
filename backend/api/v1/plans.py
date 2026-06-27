from fastapi import APIRouter

from fastapi import HTTPException, status

from backend.schemas.plan import MealPlanCreateRequest, MealPlanResponse
from backend.services.meal_planner_service import MealPlannerService


router = APIRouter()
service = MealPlannerService()


@router.post("/generate", response_model=MealPlanResponse)
def create_plan(payload: MealPlanCreateRequest) -> MealPlanResponse:
    try:
        return service.create_plan(payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
