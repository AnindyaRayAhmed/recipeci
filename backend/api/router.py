from fastapi import APIRouter

from backend.api.v1.health import router as health_router
from backend.api.v1.plans import router as meal_plan_router


api_router = APIRouter()
api_router.include_router(health_router, prefix="/health", tags=["health"])
api_router.include_router(meal_plan_router, prefix="/meal-plan", tags=["meal-plan"])
