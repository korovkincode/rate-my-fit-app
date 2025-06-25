from fastapi import HTTPException

from dao.user import UserDAO
from dao.fit import FitDAO
from dao.review import ReviewDAO


def get_twin_id(user_id: str, user_dao: UserDAO) -> str:
    if user_id.startswith("@"):
        twin_id = "userToken"
        user_data = user_dao.find_one({"username": user_id[1:]})
    else:
        twin_id = "username"
        user_data = user_dao.find_one({"userToken": user_id})

    if user_data is None:
        raise HTTPException(status_code=404, detail="No such user")

    return user_data[twin_id]


def id_to_token(user_id: str, user_dao: UserDAO) -> str:
    if user_id.startswith("@"):
        user_token = get_twin_id(user_id, user_dao)
    else:
        user_token = user_id

    return user_token


def get_user_stats(
    user_id: str, user_dao: UserDAO, fit_dao: FitDAO, review_dao: ReviewDAO
) -> dict:
    user_token = id_to_token(user_id, user_dao)

    return {
        "fits": fit_dao.count({"authorToken": user_token}),
        "reviews": review_dao.count({"authorToken": user_token}),
    }
