from fastapi import APIRouter, HTTPException
from models.item import ItemModel
from config.database import Database
import uuid
import utils


router = APIRouter()


@router.post("/add", response_model=None)
async def addItem(itemData: ItemModel) -> HTTPException | dict:
    itemData = itemData.model_dump()
    itemData = {
        "itemID": uuid.uuid4().hex,
        **itemData
    }

    try:
        Database.Items.insert_one(itemData)
        itemData.pop("_id")
        return {
            "message": "Successful adding",
            "data": itemData
        }
    except:
        raise HTTPException(
            status_code=500, detail="Could not add an item"
        )
    

@router.get("/{itemID}", response_model=None)
async def readItem(itemID: str) -> HTTPException | dict:
    itemData = Database.Items.find_one(
        {"itemID": itemID}, {"_id": 0}
    )
    if itemData is None:
        raise HTTPException(
            status_code=404, detail="No such item"
        )
    
    return {
        "message": "Successful retrieving",
        "data": itemData
    }


@router.put("/{itemID}", response_model=None)
async def updateItem(itemID: str, itemData: ItemModel) -> HTTPException | dict:
    itemData = itemData.model_dump()
    if itemID != itemData["itemID"]:
        raise HTTPException(
            status_code=403, detail="Item IDs do not match"
        )
    if Database.Items.find_one({"itemID": itemID}) is None:
        raise HTTPException(
            status_code=404, detail="No such item"
        )
    
    try:
        Database.Items.find_one_and_replace(
            {"itemID": itemID}, itemData
        )
        itemData.pop("_id", None)
        return {
            "message": "Successful update",
            "data": itemData
        }
    except:
        raise HTTPException(
            status_code=500, detail="Could not update the item"
        )
    

@router.get("/by/{brandName}", response_model=None)
async def getBrandItems(brandName: str, start: int = None, limit: int = None) -> HTTPException | dict:
    brandItemsData = utils.findByRelation(
        Database.Items, {"brand": brandName}, {"_id": 0},
        start, limit
    )

    return {
        "message": "Successful retrieving",
        "data": brandItemsData
    }


@router.get("/all/brands", response_model=None)
async def getAllBrands() -> dict:
    allBrands = utils.collectionToList(Database.Items.distinct("brand"))

    return {
        "message": "Successful retrieving",
        "data": allBrands
    }