from dao.user import UserDAO
from dao.fit import FitDAO
from dao.item import ItemDAO
from dao.review import ReviewDAO


class DAO:
    def __init__(self):
        self.users = UserDAO()
        self.fits = FitDAO()
        self.items = ItemDAO()
        self.reviews = ReviewDAO()
