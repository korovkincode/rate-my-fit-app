import json
import os

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.database import Database as MongoDB
from pymongo.collection import Collection
from pymongo.operations import SearchIndexModel


class Database:
    __URI: str = ""

    @classmethod
    def connect(cls):
        load_dotenv()
        cls.__URI = os.getenv("DATABASE_URI")
        cls.Client = MongoClient(cls.__URI)
        cls.DB: MongoDB = cls.Client.RateMyFit
        cls.Users: Collection = cls.DB.Users
        cls.Fits: Collection = cls.DB.Fits
        cls.Reviews: Collection = cls.DB.Reviews
        cls.Items: Collection = cls.DB.Items

    @classmethod
    def update_items(cls, replace: bool = False):
        items_path = os.path.join("collectors", "parsed_data", "all-items.json")
        with open(items_path, encoding="utf-8") as all_items_file:
            all_items_data = json.load(all_items_file)

        if replace:
            cls.Items.delete_many({})
        cls.Items.insert_many(all_items_data)

    @classmethod
    def create_indices(cls, index_model: SearchIndexModel, collections: list[str]):
        for collection in collections:
            cls.DB[collection].create_search_index(model=index_model)
