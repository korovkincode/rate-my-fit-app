from typing import Optional

from models.abstract import AbstractModel
from models.user import UserCredentialsModel


class FitModel(AbstractModel):
    userCredentials: UserCredentialsModel
    fitID: Optional[str] = None
    title: str
    date: str
    description: Optional[str] = None
    itemsID: Optional[list[str]] = None
    totalPrice: int
    totalReviews: int
    avgGrade: float
