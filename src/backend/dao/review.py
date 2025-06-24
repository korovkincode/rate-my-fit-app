from dao.base import BaseDAO
from config.database import Database


class ReviewDAO(BaseDAO):
    def __init__(self):
        super().__init__(Database.Reviews)
