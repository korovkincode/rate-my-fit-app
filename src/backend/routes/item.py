import uuid

from fastapi import APIRouter, HTTPException

import utils
from config.database import Database
from models.item import ItemModel


router = APIRouter()


@router.post("/add", response_model=None)
async def add_item(item_data: ItemModel) -> HTTPException | dict:
    item_data = item_data.model_dump()
    item_data = {"itemID": uuid.uuid4().hex, **item_data}

    try:
        Database.Items.insert_one(item_data)
        item_data.pop("_id")
        return {
            "message": "Successful adding",
            "data": item_data
        }
    except:
        raise HTTPException(status_code=500, detail="Could not add an item")


@router.get("/{item_id}", response_model=None)
async def read_item(item_id: str) -> HTTPException | dict:
    item_data = Database.Items.find_one({"itemID": item_id}, {"_id": 0})
    if item_data is None:
        raise HTTPException(status_code=404, detail="No such item")

    return {
        "message": "Successful retrieving",
        "data": item_data
    }


@router.put("/{item_id}", response_model=None)
async def update_item(item_id: str, item_data: ItemModel) -> HTTPException | dict:
    item_data = item_data.model_dump()
    if item_id != item_data["itemID"]:
        raise HTTPException(status_code=403, detail="Item IDs do not match")
    if Database.Items.find_one({"itemID": item_id}) is None:
        raise HTTPException(status_code=404, detail="No such item")

    try:
        Database.Items.find_one_and_replace({"itemID": item_id}, item_data)
        item_data.pop("_id", None)
        return {
            "message": "Successful update",
            "data": item_data
        }
    except:
        raise HTTPException(status_code=500, detail="Could not update the item")


@router.get("/by/{brand_name}", response_model=None)
async def get_brand_items(
    brand_name: str, start: int = None, limit: int = None
) -> HTTPException | dict:
    brand_items_data = utils.find_by_relation(
        Database.Items, {"brand": brand_name}, {"_id": 0}, start, limit
    )

    return {
        "message": "Successful retrieving",
        "data": brand_items_data
    }


@router.get("/all/brands", response_model=None)
async def get_all_brands() -> dict:
    all_brands = list(Database.Items.distinct("brand"))

    return {
        "message": "Successful retrieving",
        "data": all_brands
    }


@router.get("/search/name", response_model=None)
async def search_item(item_name: str, limit: int = 15) -> dict:
    pipeline = [
        {
            "$search": {
                "index": "default",
                "text": {"query": item_name, "path": ["name"]}
            }
        },
        {"$limit": limit},
        {"$project": {"_id": 0}}
    ]
    query_items = Database.Items.aggregate(pipeline)

    return {
        "message": "Successful retrieving",
        "data": list(query_items)
    }
