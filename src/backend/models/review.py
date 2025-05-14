from .abstract import AbstractModel
from .user import UserCredentialsModel
from typing import Optional


class ReviewModel(AbstractModel):
    userCredentials: UserCredentialsModel
    reviewID: Optional[str] = None
    fitID: str
    grade: int
    date: str
    comment: Optional[str] = None