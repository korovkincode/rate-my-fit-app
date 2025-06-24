from dao.base import BaseDAO
from config.database import Database


class ItemDAO(BaseDAO):
    def __init__(self):
        self.super().__init__(Database.Items)