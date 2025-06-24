from typing import List

from pymongo.collection import Collection
from pymongo.cursor import Cursor


class BaseDAO:
    def __init__(self, collection: Collection):
        self.collection = collection

    def create_one(self, document: dict):
        self.collection.insert_one(document)

    def create(self, documents: List[dict]):
        self.collection.insert_many(documents)

    def read_one(self, params: dict, projection: dict) -> dict:
        return self.collection.find_one(params, projection)

    def read(self, params: dict, projection: dict) -> Cursor:
        return self.collection.find(params, projection)

    def update_one(self, params: dict, document: dict):
        self.collection.find_one_and_replace(params, document)

    def delete_one(self, params: dict):
        self.collection.delete_one(params)

    def count(self, params: dict) -> int:
        self.collection.count_documents(params)
