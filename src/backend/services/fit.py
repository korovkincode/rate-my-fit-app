import uuid
from typing import Literal

from fastapi import HTTPException, UploadFile

import utils
from dao.aggregator import DAO
from services.helpers.fit import get_fit_stats
from services.helpers.user import id_to_token
from services.helpers.item import check_items


class FitService:
    def __init__(self, dao: DAO):
        self.dao = dao

    def add(self, fit_data: dict, pics: list[UploadFile]) -> dict:
        user_credentials = fit_data["userCredentials"]
        if not self.dao.users.count(user_credentials):
            raise HTTPException(status_code=401, detail="No such user")

        if not check_items(fit_data.get("itemsID", []), self.dao):
            raise HTTPException(status_code=403, detail="Error caused by items list")

        fit_id = uuid.uuid4().hex
        fit_data["fitID"] = fit_id
        fit_data["authorToken"] = user_credentials["userToken"]
        del fit_data["userCredentials"]
        fit_data["picnames"] = utils.collect_pics(pics, {"flag": 0})
        fit_data = {**fit_data, **get_fit_stats(fit_data, self.dao)}

        try:
            self.dao.fits.create_one(fit_data.copy())
            return fit_data
        except:
            raise HTTPException(status_code=500, detail="Could not add a fit")

    def get(self, fit_id: str, full: bool) -> dict:
        fit_data = self.dao.fits.find_one({"fitID": fit_id})
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

        if not check_items(fit_data.get("itemsID", []), self.dao):
            raise HTTPException(status_code=403, detail="Error caused by items list")

        original_fit = self.dao.fits.find_one({"fitID": fit_id})
        if original_fit is None:
            raise HTTPException(status_code=404, detail="No such fit")

        user_credentials = fit_data["userCredentials"]
        if not self.dao.users.count(user_credentials):
            raise HTTPException(status_code=401, detail="No such user")
        if original_fit["authorToken"] != user_credentials["userToken"]:
            raise HTTPException(status_code=401, detail="User tokens do not match")
        fit_data["authorToken"] = user_credentials["userToken"]
        del fit_data["userCredentials"]

        pic_status = {"flag": append_pics, "picnames": original_fit["picnames"]}
        fit_data["picnames"] = utils.collect_pics(pics, pic_status)
        fit_data = {**fit_data, **get_fit_stats(fit_data, self.dao)}

        try:
            self.dao.fits.update_one({"fitID": fit_id}, fit_data.copy())
            return fit_data
        except:
            raise HTTPException(status_code=500, detail="Could not update the fit")

    def get_by_user(self, user_id: str) -> list[dict]:
        author_token = id_to_token(user_id, self.dao)

        if not self.dao.users.count({"userToken": author_token}):
            raise HTTPException(status_code=404, detail="No such user")

        return list(self.dao.fits.find_many({"authorToken": author_token}))

    def get_all(
        self, start: int, limit: int, sorting: str, direction: Literal["ASC", "DSC"]
    ) -> list[dict]:
        return list(self.dao.fits.all(start, limit, sorting, direction))

    def get_total(self) -> int:
        return self.dao.fits.count({})
