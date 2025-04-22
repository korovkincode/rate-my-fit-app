from .abstract import AbstractModel
from .user import UserCredentialsModel
from typing import Optional, List
from pydantic import model_validator
import json


class FitModel(AbstractModel):
    userCredentials: UserCredentialsModel
    fitID: Optional[str] = None
    title: str
    date: str
    description: Optional[str] = None


    @model_validator(mode="before")
    @classmethod
    def validateToJSON(cls, value):
        if isinstance(value, str):
            return cls(**json.loads(value))
        return value