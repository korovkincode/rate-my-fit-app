import uuid

from fastapi import HTTPException

from dao.aggregator import DAO
from services.helpers.user import id_to_token, get_public_data
from services.helpers.review import get_fit_reviews


class ReviewService:
    def __init__(self, dao: DAO):
        self.dao = dao

    def add(self, review_data: dict) -> dict:
        if not 1 <= review_data["grade"] <= 5:
            raise HTTPException(
                status_code=403, detail="Grade should be an integer from 1 to 5"
            )

        user_credentials = review_data["userCredentials"]
        if not self.dao.users.count(user_credentials):
            raise HTTPException(status_code=401, detail="No such user")
        if not self.dao.fits.count({"fitID": review_data["fitID"]}):
            raise HTTPException(status_code=404, detail="No such fit")

        review_id = uuid.uuid4().hex
        review_data["reviewID"] = review_id
        review_data["authorToken"] = user_credentials["userToken"]
        del review_data["userCredentials"]

        try:
            self.dao.reviews.create_one(review_data.copy())
            return review_data
        except:
            raise HTTPException(status_code=500, detail="Could not add a review")

    def get(self, review_id: str) -> dict:
        review_data = self.dao.reviews.find_one({"reviewID": review_id})
        if review_data is None:
            raise HTTPException(status_code=404, detail="No such review")

        return review_data

    def get_by_user(self, user_id: str) -> list[dict]:
        author_token = id_to_token(user_id, self.dao)
        if not self.dao.users.count({"userToken": author_token}):
            raise HTTPException(status_code=401, detail="No such user")

        return list(self.dao.reviews.find_many({"authorToken": author_token}))

    def get_on_fit(self, fit_id: str, full: bool) -> list[dict]:
        reviews_data = get_fit_reviews(fit_id, self.dao)

        if full:
            # Retrieving every reviewer public data
            for review in reviews_data:
                review["author"] = get_public_data(review["authorToken"], self.dao)

        return reviews_data
