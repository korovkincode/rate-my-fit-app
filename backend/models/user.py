from pydantic import BaseModel
from typing import Optional


class BaseModelUpdated(BaseModel):
    #Removes all fields with null values
    def model_dump(self, *args, **kwargs):
        modelData = super().model_dump(*args, **kwargs)
        for field in [*modelData].copy():
            if modelData[field] is None:
                del modelData[field]
        return modelData


class UserAuthModel(BaseModelUpdated):
    username: str
    password: str


class UserCredentialsModel(BaseModelUpdated):
    userToken: str
    secretToken: str


class UserModel(BaseModelUpdated):
    userCredentials: Optional[UserCredentialsModel] = None
    username: str
    password: str
    bio: Optional[str] = None