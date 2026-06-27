from enum import Enum

from pydantic import BaseModel, Field, ConfigDict


class MealPlanCreateRequest(BaseModel):
    budget: float = Field(gt=0, le=1000)
    dietary_preference: str = Field(min_length=1, max_length=100)
    available_cooking_time_minutes: int = Field(alias="cooking_time", ge=10, le=480)
    people_count: int = Field(ge=1, le=20)

    model_config = ConfigDict(populate_by_name=True)


class TaskStatus(str, Enum):
    pending = "Pending"
    in_progress = "In Progress"
    done = "Done"


class MealItem(BaseModel):
    title: str
    description: str


class GroceryItem(BaseModel):
    name: str
    quantity: str
    estimated_cost: float


class SubstitutionItem(BaseModel):
    ingredient: str
    substitute: str
    reason: str


class CookingTask(BaseModel):
    title: str
    duration_minutes: int = Field(ge=1)
    status: TaskStatus
    note: str


class BudgetAnalysis(BaseModel):
    estimated_total: float = Field(ge=0)
    remaining_budget: float
    is_within_budget: bool
    summary: str


class MealPlanResponse(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    breakfast: list[MealItem]
    lunch: list[MealItem]
    dinner: list[MealItem]
    grocery_list: list[GroceryItem]
    substitutions: list[SubstitutionItem]
    budget_analysis: BudgetAnalysis
    cooking_tasks: list[CookingTask]
    completion_message: str
