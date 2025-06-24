from typing import Optional

from models.abstract import AbstractModel


class UserAuthModel(AbstractModel):
    username: str
    password: str


class UserCredentialsModel(AbstractModel):
    userToken: str
    secretToken: str


class UserModel(AbstractModel):
    userCredentials: Optional[UserCredentialsModel] = None
    username: str
    password: str
    bio: Optional[str] = None
