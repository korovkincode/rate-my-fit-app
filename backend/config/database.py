from dotenv import load_dotenv
import os
from pymongo import MongoClient
import json


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
    def updateItems(cls):
        with open(os.path.join("collectors", "all-items.json"), encoding="utf-8") as allItemsFile:
            allItemsData = json.load(allItemsFile)
        
        cls.Items.delete_many({})
        cls.Items.insert_many(allItemsData)