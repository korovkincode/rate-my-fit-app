import json
import os

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.operations import SearchIndexModel


class Singleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not isinstance(cls._instance, cls):
            cls._instance = object.__new__(cls, *args, **kwargs)
        return cls._instance


class Database:
    __URI: str = ""

    @classmethod
    def connect(cls):
        load_dotenv()
        cls.__URI = os.getenv("DATABASE_URI")
        cls.Client = MongoClient(cls.__URI)
        cls.DB = cls.Client.RateMyFit
        cls.Users = cls.DB.Users
        cls.Fits = cls.DB.Fits
        cls.Reviews = cls.DB.Reviews
        cls.Items = cls.DB.Items

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
