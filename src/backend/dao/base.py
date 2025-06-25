from typing import Literal

from pymongo.collection import Collection
from pymongo.cursor import Cursor
from pymongo import ASCENDING, DESCENDING


class BaseDAO:
    DEFAULT_PROJECTION = {"_id": 0}

    def __init__(self, collection: Collection):
        self.collection = collection

    def create_one(self, document: dict):
        self.collection.insert_one(document)

    def create_many(self, documents: list[dict]):
        self.collection.insert_many(documents)

    def find_one(self, params: dict, projection: dict = DEFAULT_PROJECTION) -> dict:
        return self.collection.find_one(params, projection)

    def find_many(self, params: dict, projection: dict = DEFAULT_PROJECTION) -> Cursor:
        return self.collection.find(params, projection)

    def update_one(self, params: dict, document: dict = DEFAULT_PROJECTION):
        self.collection.find_one_and_replace(params, document)

    def delete_one(self, params: dict):
        self.collection.delete_one(params)

    def count(self, params: dict) -> int:
        return self.collection.count_documents(params)

    def all(
        self, start: int, limit: int, sorting: str, direction_str: Literal["ASC", "DSC"]
    ) -> Cursor:
        direction = ASCENDING if direction_str == "ASC" else DESCENDING
        query_results = (
            self.collection.find({}, self.DEFAULT_PROJECTION)
            .sort(sorting, direction)
            .skip(start)
            .limit(limit)
        )

        return query_results
