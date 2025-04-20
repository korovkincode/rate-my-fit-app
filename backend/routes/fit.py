from fastapi import APIRouter, HTTPException, Response, Body, UploadFile, File
from models.fit import FitModel
from config.database import Database
import uuid
import os
import utils

router = APIRouter()


@router.post("/add", response_model=None)
async def addFit(fitData: FitModel = Body(...), pics: list[UploadFile] = File(...)) -> HTTPException | Response:
    fitData = fitData.model_dump()
    if Database.Users.find_one(fitData["userCredentials"]) is None:
        raise HTTPException(
            status_code=403, detail="No such user"
        )
    
    fitID = uuid.uuid4().hex
    fitData["fitID"] = fitID
    fitData["authorToken"] = fitData["userCredentials"]["userToken"]
    del fitData["userCredentials"]
    fitData["picnames"] = utils.collectPics(pics)
    
    try:
        Database.Fits.insert_one(fitData)
        fitData.pop("_id", None)
        return {
            "message": "Successful adding",
            "data": fitData
        }
    except:
        raise HTTPException(
            status_code=500, detail="Could not add fit" 
        )


@router.get("/{fitID}", response_model=None)
async def readFit(fitID: str) -> HTTPException | Response:
    fitData = Database.Fits.find_one({"fitID": fitID}, {"_id": 0})
    if fitData is None:
        raise HTTPException(
            status_code=403, detail="No such fit"
        )
    
    return {
        "message": "Successful retrieving",
        "data": fitData
    }
    


@router.put("/{fitID}", response_model=None)
async def updateFit(fitID: str, fitData: FitModel = Body(...), pics: list[UploadFile] = File(...)) -> HTTPException | Response:
    fitData = fitData.model_dump()
    if fitID != fitData["fitID"]:
        raise HTTPException(
            status_code=403, detail="Fit IDs do not match"
        )
    if Database.Users.find_one(fitData["userCredentials"]) is None:
        raise HTTPException(
            status_code=403, detail="No such user"
        )
    findFit = Database.Fits.find_one({"fitID": fitID})
    if findFit["authorToken"] != fitData["userCredentials"]["userToken"]:
        raise HTTPException(
            status_code=403, detail="User tokens do not match"
        )

    fitData["picnames"] = utils.collectPics(pics)
    fitData["authorToken"] = fitData["userCredentials"]["userToken"]
    del fitData["userCredentials"]
    
    try:
        Database.Fits.find_one_and_replace({"fitID": fitID}, fitData)
        fitData.pop("_id", None)
        return {
            "message": "Successful update",
            "data": fitData
        }
    except:
        raise HTTPException(
            status_code=500, detail="Could not add fit" 
        )