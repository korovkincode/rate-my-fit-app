from fastapi import HTTPException

import utils
from dao.aggregator import DAO


def get_twin_id(user_id: str, dao: DAO) -> str:
    if user_id.startswith("@"):
        twin_id = "userToken"
        user_data = dao.users.find_one({"username": user_id[1:]})
    else:
        twin_id = "username"
        user_data = dao.users.find_one({"userToken": user_id})

    if user_data is None:
        raise HTTPException(status_code=404, detail="No such user")

    return user_data[twin_id]


def id_to_token(user_id: str, dao: DAO) -> str:
    if user_id.startswith("@"):
        user_token = get_twin_id(user_id, dao)
    else:
        user_token = user_id

    return user_token


def get_user_stats(user_id: str, dao: DAO) -> dict:
    user_token = id_to_token(user_id, dao)

    return {
        "fits": dao.fits.count({"authorToken": user_token}),
        "reviews": dao.reviews.count({"authorToken": user_token}),
    }


def get_public_data(user_id: str, dao: DAO) -> dict:
    user_token = id_to_token(user_id, dao)
    user_data = dao.users.find_one({"userToken": user_token})

    if user_data is None:
        return HTTPException(status_code=404, detail="No such user")

    return {
        "username": user_data["username"],
        "bio": user_data.get("bio"),
        "pfpLink": utils.find_pfp(user_token),
    }
