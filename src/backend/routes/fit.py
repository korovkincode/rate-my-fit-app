from typing import Literal
from fastapi import APIRouter, HTTPException, Body, UploadFile, File
from models.fit import FitModel
from config.database import Database
import uuid
import utils
from pymongo import ASCENDING, DESCENDING


router = APIRouter()


@router.post("/add", response_model=None)
async def addFit(fitData: FitModel = Body(...), pics: list[UploadFile] = File(...)) -> HTTPException | dict:
    fitData = fitData.model_dump()
    if Database.Users.find_one(fitData["userCredentials"]) is None:
        raise HTTPException(
            status_code=404, detail="No such user"
        )
    if "itemsID" in fitData and not utils.checkItems(fitData["itemsID"]):
        raise HTTPException(
            status_code=403, detail="Error caused by items list"
        )

    fitID = uuid.uuid4().hex
    fitData["fitID"] = fitID
    fitData["authorToken"] = fitData["userCredentials"]["userToken"]
    del fitData["userCredentials"]
    fitData["picnames"] = utils.collectPics(pics, {"flag": 0})
    fitData = {
        **fitData,
        **utils.getFitStats(fitData)
    }

    try:
        Database.Fits.insert_one(fitData)
        fitData.pop("_id", None)
        return {
            "message": "Successful adding",
            "data": fitData
        }
    except:
        raise HTTPException(
            status_code=500, detail="Could not add a fit"
        )


@router.get("/{fitID}", response_model=None)
async def getFit(fitID: str) -> HTTPException | dict:
    fitData = Database.Fits.find_one({"fitID": fitID}, {"_id": 0})
    if fitData is None:
        raise HTTPException(
            status_code=404, detail="No such fit"
        )
    
    return {
        "message": "Successful retrieving",
        "data": fitData
    }
    

@router.put("/{fitID}", response_model=None)
async def updateFit(fitID: str, appendPics: bool = False, fitData: FitModel = Body(...), pics: list[UploadFile] = File(...)) -> HTTPException | dict:
    fitData = fitData.model_dump()
    if fitID != fitData["fitID"]:
        raise HTTPException(
            status_code=403, detail="Fit IDs do not match"
        )
    if "itemsID" in fitData and not utils.checkItems(fitData["itemsID"]):
        raise HTTPException(
            status_code=403, detail="Error caused by items list"
        )
    findFit = Database.Fits.find_one({"fitID": fitID})
    if findFit is None:
        raise HTTPException(
            status_code=404, detail="No such fit"
        )
    
    if Database.Users.find_one(fitData["userCredentials"]) is None:
        raise HTTPException(
            status_code=404, detail="No such user"
        )
    if findFit["authorToken"] != fitData["userCredentials"]["userToken"]:
        raise HTTPException(
            status_code=403, detail="User tokens do not match"
        )

    fitData["authorToken"] = fitData["userCredentials"]["userToken"]
    del fitData["userCredentials"]
    picStatus = {
        "flag": appendPics, "picnames": findFit["picnames"]
    }
    fitData["picnames"] = utils.collectPics(pics, picStatus)
    fitData = {
        **fitData,
        **utils.getFitStats(fitData)
    }
    
    try:
        Database.Fits.find_one_and_replace({"fitID": fitID}, fitData)
        fitData.pop("_id", None)
        return {
            "message": "Successful update",
            "data": fitData
        }
    except:
        raise HTTPException(
            status_code=500, detail="Could not update the fit" 
        )


@router.get("/by/{userID}", response_model=None)
async def getUserFits(userID: str) -> HTTPException | dict:
    if userID.startswith("@"):
        authorToken = utils.getTwinID(userID)
    else:
        authorToken = userID

    if Database.Users.find_one({"userToken": authorToken}) is None:
        raise HTTPException(
            status_code=404, detail="No such user"
        )
    
    return {
        "message": "Successful retrieving",
        "data": utils.findByRelation(
            Database.Fits, {"authorToken": authorToken}, {"_id": 0}
        )
    }


@router.get("/all/", response_model=None)
async def getAllFits(start: int, limit: int, sorting: str, direction: Literal["ASC", "DSC"]) -> dict:
    queryFits = Database.Fits.find(
        {}, {"_id": 0}
    ).sort(sorting, ASCENDING if direction == "ASC" else DESCENDING).skip(start).limit(limit)

    return {
        "message": "Successful retrieving",
        "data": utils.collectionToList(queryFits)
    }


@router.get("/total/", response_model=None)
async def getTotalFits() -> dict:
    return {
        "message": "Successful retrieving",
        "data": Database.Fits.count_documents({})
    }