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

    def find_many(
        self,
        params: dict = {},
        skip: int = None,
        limit: int = None,
        sorting: str = None,
        direction_str: Literal["ASC", "DSC"] = None,
    ) -> Cursor:
        direction = {"ASC": ASCENDING, "DSC": DESCENDING}.get(direction_str)
        query = self.collection.find(params, self.DEFAULT_PROJECTION)
        if skip is not None:
            query.skip(skip)
        if limit is not None:
            query.limit(limit)
        if sorting is not None:
            query.sort(sorting, direction)

        return query

    def update_one(self, params: dict, document: dict = DEFAULT_PROJECTION):
        self.collection.find_one_and_replace(params, document)

    def delete_one(self, params: dict):
        self.collection.delete_one(params)

    def count(self, params: dict) -> int:
        return self.collection.count_documents(params)

    def distinct(self, field: str) -> Cursor:
        return self.collection.distinct(field)
