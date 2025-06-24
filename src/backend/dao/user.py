from dao.base import BaseDAO
from config.database import Database


class UserDAO(BaseDAO):
    def __init__(self):
        super().__init__(Database.Users)
