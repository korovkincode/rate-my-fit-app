import os
import uuid

from fastapi import APIRouter, Body, File, Header, HTTPException, UploadFile

import utils
from config.database import Database
from models.user import UserAuthModel, UserCredentialsModel, UserModel


router = APIRouter()


@router.post("/auth", response_model=None)
async def auth_user(user_auth: UserAuthModel) -> HTTPException | dict:
    user_auth = user_auth.model_dump()
    user_data = Database.Users.find_one(user_auth)
    if user_data is None:
        raise HTTPException(status_code=404, detail="No such user")

    return {
        "message": "Successful auth",
        "data": {
            "userToken": user_data["userToken"],
            "secretToken": user_data["secretToken"]
        }
    }


@router.post("/add", response_model=None)
async def add_user(user_data: UserModel) -> HTTPException | dict:
    user_data = user_data.model_dump()
    if Database.Users.find_one({"username": user_data["username"]}):
        raise HTTPException(status_code=403, detail="Username is already taken")

    user_credentials = {
        "userToken": uuid.uuid4().hex,
        "secretToken": uuid.uuid4().hex
    }
    try:
        Database.Users.insert_one({
            **user_credentials, **user_data
        })
        return {
            "message": "Successful signup",
            "data": user_credentials
        }
    except:
        raise HTTPException(status_code=500, detail="Could not signup a user")


@router.get("/{user_id}", response_model=None)
async def get_user(
    user_id: str, secret_token: str | None = Header(default=None)
) -> HTTPException | dict:
    query_options = hidden_data = {}
    if user_id.startswith("@") or secret_token is None:
        # Retrieving public info
        if user_id.startswith("@"):
            query_options = {"username": user_id[1:]}
        else:
            query_options = {"userToken": user_id}
        hidden_data = {"secretToken": 0, "password": 0}
    else:
        # Retrieving full info
        query_options = {"userToken": user_id}
    hidden_data["_id"] = 0

    user_data = Database.Users.find_one(query_options, hidden_data)
    if user_data is None:
        raise HTTPException(status_code=404, detail="No such user")
    if secret_token is not None and secret_token != user_data["secretToken"]:
        raise HTTPException(status_code=403, detail="Wrong secret token")

    user_stats = utils.getUserStats(user_id)
    return {
        "message": "Successful retrieving",
        "data": {
            **user_data,
            "totalFits": user_stats["fits"],
            "totalReviews": user_stats["reviews"]
        }
    }


@router.put("/{user_token}", response_model=None)
async def update_user(user_token: str, user_data: UserModel) -> HTTPException | dict:
    user_data = user_data.model_dump()
    user_credentials = user_data["userCredentials"]
    if user_token != user_credentials["userToken"]:
        raise HTTPException(status_code=403, detail="User tokens do not match")

    find_user = Database.Users.find_one(user_credentials)
    if find_user is None:
        raise HTTPException(status_code=404, detail="No such user")
    if Database.Users.find_one(
        {"userToken": {"$ne": user_token}, "username": user_data["username"]}
    ) is not None:
        raise HTTPException(status_code=403, detail="Username is already taken")

    try:
        del user_data["userCredentials"]
        user_data = {**user_credentials, **user_data}
        Database.Users.find_one_and_replace(user_credentials, user_data)
        return {
            "message": "Successful update",
            "data": user_credentials
        }
    except:
        raise HTTPException(status_code=500, detail="Could not update the user")


@router.post("/{user_token}/pfp", response_model=None)
async def set_user_pfp(
    user_token: str,
    user_credentials: UserCredentialsModel = Body(...),
    pfp: UploadFile = File(...),
) -> HTTPException | dict:
    user_credentials = user_credentials.model_dump()
    if user_token != user_credentials["userToken"]:
        raise HTTPException(status_code=403, detail="User tokens do not match")

    find_user = Database.Users.find_one(user_credentials)
    if find_user is None:
        raise HTTPException(status_code=404, detail="No such user")

    picname = user_token + utils.get_file_extension(pfp.filename)
    with open(os.path.join("pfp", picname), "wb") as f:
        f.write(pfp.file.read())

    return {"message": "Successful pfp setting"}


@router.get("/{user_id}/pfp", response_model=None)
async def get_user_pfp(user_id: str) -> HTTPException | dict:
    if user_id.startswith("@"):
        user_token = utils.get_twin_id(user_id)
    else:
        user_token = user_id

    return {
        "message": "Successful retrieving",
        "data": utils.find_pfp(user_token)
    }
