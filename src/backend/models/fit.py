from typing import List, Optional

from .abstract import AbstractModel
from .user import UserCredentialsModel


class FitModel(AbstractModel):
    userCredentials: UserCredentialsModel
    fitID: Optional[str] = None
    title: str
    date: str
    description: Optional[str] = None
    itemsID: Optional[List[str]] = None
    totalPrice: int
    totalReviews: int
    avgGrade: float
