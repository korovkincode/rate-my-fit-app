import uuid
from typing import Literal

from fastapi import APIRouter, Body, File, HTTPException, UploadFile
from pymongo import ASCENDING, DESCENDING

import utils
from config.database import Database
from models.fit import FitModel


router = APIRouter()


@router.post("/add", response_model=None)
async def add_fit(
    fit_data: FitModel = Body(...), pics: list[UploadFile] = File(...)
) -> HTTPException | dict:
    fit_data = fit_data.model_dump()
    if Database.Users.find_one(fit_data["userCredentials"]) is None:
        raise HTTPException(status_code=404, detail="No such user")
    if "itemsID" in fit_data and not utils.check_items(fit_data["itemsID"]):
        raise HTTPException(status_code=403, detail="Error caused by items list")

    fit_id = uuid.uuid4().hex
    fit_data["fitID"] = fit_id
    fit_data["authorToken"] = fit_data["userCredentials"]["userToken"]
    del fit_data["userCredentials"]
    fit_data["picnames"] = utils.collect_pics(pics, {"flag": 0})
    fit_data = {**fit_data, **utils.get_fit_stats(fit_data)}

    try:
        Database.Fits.insert_one(fit_data)
        fit_data.pop("_id", None)
        return {
            "message": "Successful adding",
            "data": fit_data
        }
    except:
        raise HTTPException(status_code=500, detail="Could not add a fit")


@router.get("/{fit_id}", response_model=None)
async def get_fit(fit_id: str) -> HTTPException | dict:
    fit_data = Database.Fits.find_one({"fitID": fit_id}, {"_id": 0})
    if fit_data is None:
        raise HTTPException(status_code=404, detail="No such fit")

    return {
        "message": "Successful retrieving",
        "data": fit_data
    }


@router.put("/{fit_id}", response_model=None)
async def update_fit(
    fit_id: str, append_pics: bool = False,
    fit_data: FitModel = Body(...),
    pics: list[UploadFile] = File(...),
) -> HTTPException | dict:
    fit_data = fit_data.model_dump()
    if fit_id != fit_data["fitID"]:
        raise HTTPException(status_code=403, detail="Fit IDs do not match")
    if "itemsID" in fit_data and not utils.check_items(fit_data["itemsID"]):
        raise HTTPException(status_code=403, detail="Error caused by items list")
    find_fit = Database.Fits.find_one({"fitID": fit_id})
    if find_fit is None:
        raise HTTPException(status_code=404, detail="No such fit")

    if Database.Users.find_one(fit_data["userCredentials"]) is None:
        raise HTTPException(status_code=404, detail="No such user")
    if find_fit["authorToken"] != fit_data["userCredentials"]["userToken"]:
        raise HTTPException(status_code=403, detail="User tokens do not match")

    fit_data["authorToken"] = fit_data["userCredentials"]["userToken"]
    del fit_data["userCredentials"]
    pic_status = {"flag": append_pics, "picnames": find_fit["picnames"]}
    fit_data["picnames"] = utils.collect_pics(pics, pic_status)
    fit_data = {**fit_data, **utils.get_fit_stats(fit_data)}

    try:
        Database.Fits.find_one_and_replace({"fitID": fit_id}, fit_data)
        fit_data.pop("_id", None)
        return {
            "message": "Successful update",
            "data": fit_data
        }
    except:
        raise HTTPException(status_code=500, detail="Could not update the fit")


@router.get("/by/{user_id}", response_model=None)
async def get_user_fits(user_id: str) -> HTTPException | dict:
    if user_id.startswith("@"):
        author_token = utils.get_twin_id(user_id)
    else:
        author_token = user_id

    if Database.Users.find_one({"userToken": author_token}) is None:
        raise HTTPException(status_code=404, detail="No such user")

    return {
        "message": "Successful retrieving",
        "data": utils.find_by_relation(
            Database.Fits, {"authorToken": author_token}, {"_id": 0}
        )
    }


@router.get("/all/", response_model=None)
async def get_all_fits(
    start: int, limit: int, sorting: str, direction: Literal["ASC", "DSC"]
) -> dict:
    query_fits = (
        Database.Fits.find({}, {"_id": 0})
        .sort(sorting, ASCENDING if direction == "ASC" else DESCENDING)
        .skip(start)
        .limit(limit)
    )

    return {
        "message": "Successful retrieving",
        "data": list(query_fits)
    }


@router.get("/total/", response_model=None)
async def get_total_fits() -> dict:
    return {
        "message": "Successful retrieving",
        "data": Database.Fits.count_documents({})
    }
