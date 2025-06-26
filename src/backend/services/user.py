import os
import uuid

from fastapi import HTTPException, UploadFile

import utils
from dao.aggregator import DAO
from services.helpers.user import get_user_stats, id_to_token


class UserService:
    def __init__(self, dao: DAO):
        self.dao = dao

    def auth(self, user_auth: dict) -> dict:
        user_data = self.dao.users.find_one(user_auth)
        if user_data is None:
            raise HTTPException(status_code=401, detail="No such user")

        return {
            "userToken": user_data["userToken"],
            "secretToken": user_data["secretToken"],
        }

    def add(self, user_data: dict) -> dict:
        if self.dao.users.count({"username": user_data["username"]}):
            raise HTTPException(status_code=403, detail="Username is already taken")

        user_credentials = {
            "userToken": uuid.uuid4().hex,
            "secretToken": uuid.uuid4().hex,
        }
        try:
            self.dao.users.create_one({**user_credentials, **user_data})
            return user_credentials
        except:
            raise HTTPException(status_code=500, detail="Could not signup a user")

    def get(self, user_id: str, secret_token: str | None) -> dict:
        params = projection = {}
        if user_id.startswith("@") or secret_token is None:
            # Retrieving public info
            if user_id.startswith("@"):
                params = {"username": user_id[1:]}
            else:
                params = {"userToken": user_id}
            projection = {"secretToken": 0, "password": 0}
        else:
            # Retrieving full info
            params = {"userToken": user_id}
        projection["_id"] = 0

        user_data = self.dao.users.find_one(params, projection)
        if user_data is None:
            raise HTTPException(status_code=404, detail="No such user")
        if secret_token is not None and secret_token != user_data["secretToken"]:
            raise HTTPException(status_code=401, detail="Wrong secret token")

        user_stats = get_user_stats(user_id, self.dao)

        return {
            **user_data,
            "totalFits": user_stats["fits"],
            "totalReviews": user_stats["reviews"],
        }

    def update(self, user_token: str, user_data: dict) -> dict:
        user_credentials = user_data["userCredentials"]
        if user_token != user_credentials["userToken"]:
            raise HTTPException(status_code=403, detail="User tokens do not match")

        find_user = self.dao.users.find_one(user_credentials)
        if find_user is None:
            raise HTTPException(status_code=404, detail="No such user")
        if (
            self.dao.users.find_one(
                {"userToken": {"$ne": user_token}, "username": user_data["username"]}
            )
            is not None
        ):
            raise HTTPException(status_code=403, detail="Username is already taken")

        try:
            del user_data["userCredentials"]
            user_data = {**user_credentials, **user_data}
            self.dao.users.find_one_and_replace(user_credentials, user_data)
            return user_credentials
        except:
            raise HTTPException(status_code=500, detail="Could not update the user")

    def set_pfp(self, user_token: str, user_credentials: dict, pfp: UploadFile) -> str:
        if user_token != user_credentials["userToken"]:
            raise HTTPException(status_code=403, detail="User tokens do not match")
        if not self.dao.users.count(user_credentials):
            raise HTTPException(status_code=404, detail="No such user")

        picname = user_token + utils.get_file_extension(pfp.filename)
        with open(os.path.join("pfp", picname), "wb") as f:
            f.write(pfp.file.read())

        return picname

    def get_pfp(self, user_id: str) -> str:
        return utils.find_pfp(id_to_token(user_id, self.dao))
