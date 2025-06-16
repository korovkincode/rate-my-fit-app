import uuid

from fastapi import APIRouter, HTTPException

import utils
from config.database import Database
from models.review import ReviewModel


router = APIRouter()


@router.post("/add", response_model=None)
async def add_review(review_data: ReviewModel) -> HTTPException | dict:
    review_data = review_data.model_dump()
    if not 1 <= review_data["grade"] <= 5:
        raise HTTPException(
            status_code=403, detail="Grade should be an integer from 1 to 5"
        )
    if Database.Users.find_one(review_data["userCredentials"]) is None:
        raise HTTPException(status_code=404, detail="No such user")
    if Database.Fits.find_one({"fitID": review_data["fitID"]}) is None:
        raise HTTPException(status_code=404, detail="No such fit")

    review_id = uuid.uuid4().hex
    review_data["reviewID"] = review_id
    review_data["authorToken"] = review_data["userCredentials"]["userToken"]
    del review_data["userCredentials"]

    try:
        Database.Reviews.insert_one(review_data)
        review_data.pop("_id", None)
        return {
            "message": "Successful adding", 
            "data": review_data
        }
    except:
        raise HTTPException(status_code=500, detail="Could not add a review")


@router.get("/{review_id}", response_model=None)
async def get_review(review_id: str) -> HTTPException | dict:
    review_data = Database.Reviews.find_one({"reviewID": review_id}, {"_id": 0})
    if review_data is None:
        raise HTTPException(status_code=404, detail="No such review")

    return {
        "message": "Successful retrieving",
        "data": review_data
    }


@router.get("/by/{user_id}", response_model=None)
async def get_user_reviews(user_id: str) -> HTTPException | dict:
    if user_id.startswith("@"):
        author_token = utils.get_twin_id(user_id)
    else:
        author_token = user_id

    if Database.Users.find_one({"userToken": author_token}) is None:
        raise HTTPException(status_code=404, detail="No such user")

    return {
        "message": "Successful retrieving",
        "data": utils.find_by_relation(
            Database.Reviews, {"authorToken": author_token}, {"_id": 0}
        )
    }


@router.get("/on/{fit_id}", response_model=None)
async def get_fit_reviews(fit_id: str) -> HTTPException | dict:
    if Database.Fits.find_one({"fitID": fit_id}) is None:
        raise HTTPException(status_code=404, detail="No such fit")

    return {
        "message": "Successful retrieving",
        "data": utils.find_by_relation(Database.Reviews, {"fitID": fit_id}, {"_id": 0})
    }
