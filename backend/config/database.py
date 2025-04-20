from dotenv import load_dotenv
import os
from pymongo import MongoClient


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