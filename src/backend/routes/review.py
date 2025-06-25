from fastapi import APIRouter, Depends

from dao.review import ReviewDAO
from dao.user import UserDAO
from dao.fit import FitDAO
from models.review import ReviewModel
from services.review import ReviewService


router = APIRouter()


def get_service() -> ReviewService:
    return ReviewService(ReviewDAO(), UserDAO(), FitDAO())


@router.post("/add", response_model=None)
async def add_review(
    review_data: ReviewModel, service: ReviewService = Depends(get_service)
) -> dict:
    review_data = review_data.model_dump()
    result = service.add(review_data)

    return {"message": "Successful adding", "data": result}


@router.get("/{review_id}", response_model=None)
async def get_review(
    review_id: str, service: ReviewService = Depends(get_service)
) -> dict:
    return {"message": "Successful retrieving", "data": service.get(review_id)}


@router.get("/by/{user_id}", response_model=None)
async def get_user_reviews(
    user_id: str, service: ReviewService = Depends(get_service)
) -> dict:
    return {"message": "Successful retrieving", "data": service.get_by_user(user_id)}


@router.get("/on/{fit_id}", response_model=None)
async def get_fit_reviews(
    fit_id: str, service: ReviewService = Depends(get_service)
) -> dict:
    return {"message": "Successful retrieving", "data": service.get_on_fit(fit_id)}
