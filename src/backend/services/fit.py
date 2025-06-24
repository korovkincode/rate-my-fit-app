import uuid
from typing import Literal

from fastapi import HTTPException, UploadFile

import utils
from dao.fit import FitDAO
from dao.user import UserDAO
from dao.item import ItemDAO


class FitService:
    def __init__(self, fit_dao: FitDAO, user_dao: UserDAO, item_dao: ItemDAO):
        self.fit_dao = fit_dao
        self.user_dao = user_dao
        self.item_dao = item_dao

    def add(self, fit_data: dict, pics: list[UploadFile]) -> dict:
        user_credentials = fit_data["userCredentials"]
        if not self.user_dao.count(user_credentials):
            raise HTTPException(status_code=401, detail="No such user")

        if not self.item_dao.check(fit_data.get("itemsID", [])):
            raise HTTPException(status_code=403, detail="Error caused by items list")

        fit_id = uuid.uuid4().hex
        fit_data["fitID"] = fit_id
        fit_data["authorToken"] = user_credentials["userToken"]
        del fit_data["userCredentials"]
        fit_data["picnames"] = utils.collect_pics(pics, {"flag": 0})
        fit_data = {**fit_data, **utils.get_fit_stats(fit_data)}

        try:
            self.fit_dao.insert_one(fit_data.copy())
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

        if not self.item_dao.check(fit_data.get("itemsID", [])):
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
        fit_data = {**fit_data, **utils.get_fit_stats(fit_data)}

        try:
            self.fit_dao.update_one({"fitID": fit_id}, fit_data.copy())
            return fit_data
        except:
            raise HTTPException(status_code=500, detail="Could not update the fit")

    def get_by_user(self, user_id: str) -> list[dict]:
        if user_id.startswith("@"):
            author_token = self.get_twin_id(user_id)
        else:
            author_token = user_id

        if not self.user_dao.count({"userToken": author_token}):
            raise HTTPException(status_code=404, detail="No such user")

        return list(self.fit_dao.find_many({"authorToken": author_token}))

    def get_all(
        self, start: int, limit: int, sorting: str, direction: Literal["ASC", "DSC"]
    ) -> list[dict]:
        return list(self.fit_dao.all(start, limit, sorting, direction))

    def get_twin_id(self, user_id: str) -> str:
        if user_id.startswith("@"):
            twin_id = "userToken"
            user_data = self.user_dao.find_one({"username": user_id[1:]})
        else:
            twin_id = "username"
            user_data = self.user_dao.find_one({"userToken": user_id})

        if user_data is None:
            raise HTTPException(status_code=404, detail="No such user")

        return user_data[twin_id]

    def get_total(self) -> int:
        return self.fit_dao.count({})
