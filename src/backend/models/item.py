from typing import Optional

from .abstract import AbstractModel


class ItemModel(AbstractModel):
    itemID: Optional[str] = None
    brand: str
    name: str
    img: str
    price: int
    category: Optional[str] = None
