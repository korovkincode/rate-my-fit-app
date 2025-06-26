import os
import uuid

from fastapi import HTTPException, UploadFile

from config.database import Database


def get_file_extension(filename: str) -> str:
    return filename[filename.rindex(".") :]


def get_file_basename(filename: str) -> str:
    return filename[: filename.rindex(".")]


def collect_pics(pics: list[UploadFile], pic_status: dict) -> list[str]:
    if not pic_status["flag"] and pic_status.get("picnames", None):
        for picname in pic_status["picnames"]:
            os.remove(os.path.join("static", picname))

    picnames = [] if not pic_status["flag"] else pic_status["picnames"]
    for pic in pics:
        pic_id = uuid.uuid4().hex
        picname = pic_id + get_file_extension(pic.filename)
        with open(os.path.join("static", picname), "wb") as f:
            f.write(pic.file.read())
        picnames.append(picname)

    return picnames


def get_twin_id(user_id: str) -> str:
    if user_id.startswith("@"):
        twin_id = "userToken"
        user_data = Database.Users.find_one({"username": user_id[1:]})
    else:
        twin_id = "username"
        user_data = Database.Users.find_one({"userToken": user_id})

    if user_data is None:
        raise HTTPException(status_code=404, detail="No such user")

    return user_data[twin_id]


def find_by_relation(
    collection, condition: dict, hide: dict, start: int = None, limit: int = None
) -> list:
    result_start = start if start is not None else 0

    query_params = {}
    if limit is not None:
        query_params["skip"] = start
        query_params["limit"] = result_start + limit

    results_cursor = collection.find(condition, hide, **query_params)
    return list(results_cursor)


def check_items(items_id: list[str]) -> bool:
    check = True
    for item_id in items_id:
        if Database.Items.find_one({"itemID": item_id}) is None:
            check = False

    return check


def find_pfp(user_token: str) -> str:
    pfp_files = os.listdir("pfp")
    for filename in pfp_files:
        if user_token == get_file_basename(filename):
            return filename

    raise HTTPException(status_code=404, detail="No pfp for this user")


def get_user_stats(user_id: str) -> dict:
    if user_id.startswith("@"):
        user_token = get_twin_id(user_id)
    else:
        user_token = user_id

    user_fits = list(Database.Fits.find({"authorToken": user_token}))
    user_reviews = list(Database.Reviews.find({"authorToken": user_token}))

    return {"fits": len(user_fits), "reviews": len(user_reviews)}


def get_fit_stats(fit_data: dict) -> dict:
    total_price = 0
    for item_id in fit_data["itemsID"]:
        total_price += Database.Items.find_one({"itemID": item_id})["price"]

    fit_reviews = list(Database.Reviews.find({"fitID": fit_data["fitID"]}))
    total_reviews = len(fit_reviews)
    grades_sum = sum(review["grade"] for review in fit_reviews)
    avg_grade = grades_sum / total_reviews if total_reviews else 0

    return {
        "totalPrice": total_price,
        "totalReviews": total_reviews,
        "avgGrade": avg_grade,
    }
