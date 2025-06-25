import uuid
from typing import Literal

from fastapi import HTTPException, UploadFile

import utils
from dao.fit import FitDAO
from dao.user import UserDAO
from dao.item import ItemDAO
from dao.review import ReviewDAO
from services.helpers.fit import get_fit_stats
from services.helpers.user import id_to_token
from services.helpers.item import check_items


class FitService:
    def __init__(
        self,
        fit_dao: FitDAO,
        user_dao: UserDAO,
        item_dao: ItemDAO,
        review_dao: ReviewDAO,
    ):
        self.fit_dao = fit_dao
        self.user_dao = user_dao
        self.item_dao = item_dao
        self.review_dao = review_dao

    def add(self, fit_data: dict, pics: list[UploadFile]) -> dict:
        user_credentials = fit_data["userCredentials"]
        if not self.user_dao.count(user_credentials):
            raise HTTPException(status_code=401, detail="No such user")

        if not check_items(fit_data.get("itemsID", [])):
            raise HTTPException(status_code=403, detail="Error caused by items list")

        fit_id = uuid.uuid4().hex
        fit_data["fitID"] = fit_id
        fit_data["authorToken"] = user_credentials["userToken"]
        del fit_data["userCredentials"]
        fit_data["picnames"] = utils.collect_pics(pics, {"flag": 0})
        fit_data = {
            **fit_data,
            **get_fit_stats(fit_data, self.item_dao, self.review_dao),
        }

        try:
            self.fit_dao.create_one(fit_data.copy())
            return fit_data
        except:
            raise HTTPException(status_code=500, detail="Could not add a fit")

    def get(self, fit_id: str, full: bool) -> dict:
        fit_data = self.fit_dao.find_one({"fitID": fit_id})
        if fit_data is None:
            raise HTTPException(status_code=404, detail="No such fit")

        if full:  # User and Item services should be implemented
            ...

        return fit_data

    def update(
        self, fit_id: str, append_pics: bool, fit_data: dict, pics: list[UploadFile]
    ) -> dict:
        if fit_id != fit_data["fitID"]:
            raise HTTPException(status_code=403, detail="Fit IDs do not match")

        if not check_items(fit_data.get("itemsID", [])):
            raise HTTPException(status_code=403, detail="Error caused by items list")

        original_fit = self.fit_dao.find_one({"fitID": fit_id})
        if original_fit is None:
            raise HTTPException(status_code=404, detail="No such fit")

        user_credentials = fit_data["userCredentials"]
        if not self.user_dao.count(user_credentials):
            raise HTTPException(status_code=401, detail="No such user")
        if original_fit["authorToken"] != user_credentials["userToken"]:
            raise HTTPException(status_code=401, detail="User tokens do not match")
        fit_data["authorToken"] = user_credentials["userToken"]
        del fit_data["userCredentials"]

        pic_status = {"flag": append_pics, "picnames": original_fit["picnames"]}
        fit_data["picnames"] = utils.collect_pics(pics, pic_status)
        fit_data = {
            **fit_data,
            **get_fit_stats(fit_data, self.item_dao, self.review_dao),
        }

        try:
            self.fit_dao.update_one({"fitID": fit_id}, fit_data.copy())
            return fit_data
        except:
            raise HTTPException(status_code=500, detail="Could not update the fit")

    def get_by_user(self, user_id: str) -> list[dict]:
        author_token = id_to_token(user_id, self.user_dao)

        if not self.user_dao.count({"userToken": author_token}):
            raise HTTPException(status_code=404, detail="No such user")

        return list(self.fit_dao.find_many({"authorToken": author_token}))

    def get_all(
        self, start: int, limit: int, sorting: str, direction: Literal["ASC", "DSC"]
    ) -> list[dict]:
        return list(self.fit_dao.all(start, limit, sorting, direction))

    def get_total(self) -> int:
        return self.fit_dao.count({})
