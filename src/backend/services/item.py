import uuid

from fastapi import HTTPException

from dao.aggregator import DAO


class ItemService:
    def __init__(self, dao: DAO):
        self.dao = dao

    def add(self, item_data: dict) -> dict:
        item_data = {"itemID": uuid.uuid4().hex, **item_data}

        try:
            self.dao.items.create_one(item_data.copy())
            return item_data
        except:
            raise HTTPException(status_code=500, detail="Could not add an item")

    def get(self, item_id: str) -> dict:
        item_data = self.dao.items.find_one({"itemID": item_id})
        if item_data is None:
            raise HTTPException(status_code=404, detail="No such item")

        return item_data

    def update(self, item_id: str, item_data: dict) -> dict:
        if item_id != item_data["itemID"]:
            raise HTTPException(status_code=403, detail="Item IDs do not match")
        if not self.dao.items.count({"itemID": item_id}):
            raise HTTPException(status_code=404, detail="No such item")

        try:
            self.dao.items.update_one({"itemID": item_id}, item_data.copy())
            return item_data
        except:
            raise HTTPException(status_code=500, detail="Could not update the item")

    def get_by_brand(self, brand: str, skip: int, limit: int) -> list[dict]:
        return list(self.dao.items.find_many({"brand": brand}, skip, limit))

    def get_brands(self) -> list[str]:
        return list(self.dao.items.distinct("brand"))

    def search(self, name: str, limit: int) -> list[dict]:
        pipeline = [
            {
                "$search": {
                    "index": "default",
                    "text": {"query": name, "path": ["name"]},
                }
            },
            {"$limit": limit},
            {"$project": self.dao.items.DEFAULT_PROJECTION},
        ]

        return list(self.dao.items.aggregate(pipeline))
