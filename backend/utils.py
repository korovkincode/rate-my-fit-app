from typing import List
from fastapi import UploadFile, HTTPException
import uuid
import os
from config.database import Database


def getFileExtension(filename: str) -> str:
    return filename[filename.rindex("."):]


def getFileBasename(filename: str) -> str:
    return filename[:filename.rindex(".")]


def collectPics(pics: list[UploadFile], picStatus: dict) -> List[str]:
    if not picStatus["flag"] and picStatus.get("picnames", None):
        for picname in picStatus["picnames"]:
            os.remove(os.path.join("static", picname))

    picnames = [] if not picStatus["flag"] else picStatus["picnames"]
    for pic in pics:
        picID = uuid.uuid4().hex
        picname = picID + getFileExtension(pic.filename)
        with open(os.path.join("static", picname), "wb") as f:
            f.write(pic.file.read())
        picnames.append(picname)
    return picnames


def getTwinID(userID: str) -> HTTPException | str:
    if userID.startswith("@"):
        twinID = "userToken"
        userData = Database.Users.find_one({"username": userID[1:]})
    else:
        twinID = "username"
        userData = Database.Users.find_one({"userToken": userID})

    if userData is None:
        raise HTTPException(
            status_code=404, detail="No such user"
        )

    return userData[twinID]


def collectionToList(collection) -> list:
    return [item for item in collection]


def findByRelation(collection, filter: dict, hide: dict, start: int = None, limit: int = None) -> list:
    resultStart = 0
    if start is not None:
        resultStart = start

    queryParams = {}
    if limit is not None:
        queryParams["limit"] = resultStart + limit

    resultsCursor = collection.find(filter, hide, **queryParams)
    return collectionToList(resultsCursor)[resultStart:]


def checkItems(itemsID: List[str]) -> bool:
    if len(itemsID) > len(set(itemsID)):
        return False
    
    for itemID in itemsID:
        if Database.Items.find_one({"itemID": itemID}) is None:
            return False
        
    return True


def findPfp(userToken: str) -> HTTPException | str:
    pfpFiles = os.listdir("pfp")
    for filename in pfpFiles:
        if userToken == getFileBasename(filename):
            return filename
        
    raise HTTPException(
        status_code=404, detail="No pfp for this user"
    )


def getUserStats(userID: str) -> dict:
    if userID.startswith("@"):
        userToken = getTwinID(userID)
    else:
        userToken = userID
    
    userFits = collectionToList(Database.Fits.find({"authorToken": userToken}))
    userReviews = collectionToList(Database.Reviews.find({"authorToken": userToken}))

    return {
        "fits": len(userFits),
        "reviews": len(userReviews)
    }