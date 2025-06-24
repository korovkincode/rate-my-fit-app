from typing import Optional

from models.abstract import AbstractModel
from models.user import UserCredentialsModel


class ReviewModel(AbstractModel):
    userCredentials: UserCredentialsModel
    reviewID: Optional[str] = None
    fitID: str
    grade: int
    date: str
    comment: Optional[str] = None
