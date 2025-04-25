from fastapi import APIRouter, HTTPException
from models.review import ReviewModel
from config.database import Database
import uuid
import utils


router = APIRouter()


@router.post("/add", response_model=None)
async def addReview(reviewData: ReviewModel) -> HTTPException | dict:
    reviewData = reviewData.model_dump()
    if not 1 <= reviewData["grade"] <= 5:
        raise HTTPException(
            status_code=403, detail="Grade should be an integer from 1 to 5"
        )
    if Database.Users.find_one(reviewData["userCredentials"]) is None:
        raise HTTPException(
            status_code=404, detail="No such user"
        )
    if Database.Fits.find_one({"fitID": reviewData["fitID"]}) is None:
        raise HTTPException(
            status_code=404, detail="No such fit"
        )
    
    reviewID = uuid.uuid4().hex
    reviewData["reviewID"] = reviewID
    reviewData["authorToken"] = reviewData["userCredentials"]["userToken"]
    del reviewData["userCredentials"]

    try:
        Database.Reviews.insert_one(reviewData)
        reviewData.pop("_id", None)
        return {
            "message": "Successful adding",
            "data": reviewData
        }
    except:
        raise HTTPException(
            status_code=500, detail="Could not add a review"
        )


@router.get("/{reviewID}", response_model=None)
async def getReview(reviewID: str) -> HTTPException | dict:
    reviewData = Database.Reviews.find_one(
        {"reviewID": reviewID}, {"_id": 0}
    )
    if reviewData is None:
        raise HTTPException(
            status_code=404, detail="No such review"
        )
    
    return {
        "message": "Successful retrieving",
        "data": reviewData
    }


@router.get("/by/{userID}", response_model=None)
async def getUserReviews(userID: str) -> HTTPException | dict:
    if userID.startswith("@"):
        authorToken = utils.getTwinID(userID)
    else:
        authorToken = userID
    
    if Database.Users.find_one({"userToken": authorToken}) is None:
        raise HTTPException(
            status_code=404, detail="No such user"
        )
    
    return {
        "message": "Successful retrieving",
        "data": utils.findByRelation(
            Database.Reviews, {"authorToken": authorToken}, {"_id": 0}
        )
    }


@router.get("/on/{fitID}", response_model=None)
async def getFitReviews(fitID: str) -> HTTPException | dict:
    if Database.Fits.find_one({"fitID": fitID}) is None:
        raise HTTPException(
            status_code=404, detail="No such fit"
        )
    
    return {
        "message": "Successful retrieving",
        "data": utils.findByRelation(
            Database.Reviews, {"fitID": fitID}, {"_id": 0}
        )
    }