from .abstract import AbstractModel
from typing import Optional


class ItemModel(AbstractModel):
    itemID: Optional[str] = None
    brand: str
    name: str
    img: str
    price: int
    category: Optional[str] = None