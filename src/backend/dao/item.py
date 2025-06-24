from dao.base import BaseDAO
from config.database import Database


class ItemDAO(BaseDAO):
    def __init__(self):
        super().__init__(Database.Items)

    #Should be moved to Item service later
    def check(self, items_id: list[str]):
        for item_id in items_id:
            if self.find_one({"itemID": item_id}) is None:
                return False
        return True
