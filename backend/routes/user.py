from fastapi import APIRouter, HTTPException, Response, Header
from models.user import UserAuthModel, UserModel
from config.database import Database
import uuid


router = APIRouter()


@router.post("/auth", response_model=None)
async def authUser(userAuth: UserAuthModel) -> HTTPException | dict:
    userAuth = userAuth.model_dump()
    userData = Database.Users.find_one(userAuth)
    if userData is None:
        raise HTTPException(
            status_code=404, detail="No such user"
        )
    return {
        "message": "Successful auth",
        "data": {
            "userToken": userData["userToken"],
            "secretToken": userData["secretToken"]
        }
    }


@router.post("/add", response_model=None)
async def addUser(userData: UserModel) -> HTTPException | dict: 
    userData = userData.model_dump()
    if Database.Users.find_one({"username": userData["username"]}):
        raise HTTPException(
            status_code=403, detail="Username is already taken"
        )
    
    userCredentials = {
        "userToken": uuid.uuid4().hex,
        "secretToken": uuid.uuid4().hex
    }
    try:
        Database.Users.insert_one({
            "userToken": uuid.uuid4().hex,
            "secretToken": uuid.uuid4().hex,
            **userData
        })
        return {
            "message": "Successful signup",
            "data": userCredentials
        }
    except:
        raise HTTPException(
            status_code=500, detail="Could not signup a user"
        )


@router.get("/{userID}", response_model=None)
async def getUser(userID: str, secretToken: str | None = Header(default=None)) -> HTTPException | dict:
    queryOptions = hiddenData = {}
    if userID.startswith("@"):
        #Retrieving public info
        queryOptions = {
            "username": userID[1:]
        }
        hiddenData = {
            "userToken": 0,
            "secretToken": 0,
            "password": 0
        }
    elif secretToken is None:
        raise HTTPException(
            status_code=403, detail="Secret token was not provided"
        )
    else:
        #Retrieving full info
        queryOptions = {
            "userToken": userID
        }
    hiddenData["_id"] = 0

    userData = Database.Users.find_one(queryOptions, hiddenData)
    if userData is None:
        raise HTTPException(
            status_code=404, detail="No such user"
        )
    if "userToken" in queryOptions and secretToken != userData["secretToken"]:
        raise HTTPException(
            status_code=403, detail="Wrong secret token"
        )

    return {
        "message": "Successful retrieving",
        "data": userData
    }


@router.put("/{userToken}", response_model=None)
async def updateUser(userToken: str, userData: UserModel) -> HTTPException | dict:
    userData = userData.model_dump()
    userCredentials = userData["userCredentials"]
    if userToken != userCredentials["userToken"]:
        raise HTTPException(
            status_code=403, detail="User tokens do not match"
        )
    
    findUser = Database.Users.find_one(userCredentials)
    if findUser is None:
        raise HTTPException(
            status_code=404, detail="No such user"
        )
    if Database.Users.find_one({"userToken": {"$ne": userToken}, "username": userData["username"]}) is not None:
        raise HTTPException(
            status_code=403, detail="Username is already taken"
        )
    
    try:
        del userData["userCredentials"]
        userData = {
            **userCredentials, **userData
        }
        Database.Users.find_one_and_replace(userCredentials, userData)
        return {
            "message": "Successful update",
            "data": userCredentials
        }
    except:
        raise HTTPException(
            status_code=500, detail="Could not update a user"
        )