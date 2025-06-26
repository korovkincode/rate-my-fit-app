from fastapi import APIRouter, Body, Depends, File, Header, UploadFile

from dao.aggregator import DAO
from models.user import UserAuthModel, UserCredentialsModel, UserModel
from services.user import UserService


router = APIRouter()


def get_service() -> UserService:
    return UserService(DAO())


@router.post("/auth", response_model=None)
async def auth_user(
    user_auth: UserAuthModel, service: UserService = Depends(get_service)
) -> dict:
    user_auth = user_auth.model_dump()

    return {"message": "Successful auth", "data": service.auth(user_auth)}


@router.post("/add", response_model=None)
async def add_user(
    user_data: UserModel, service: UserService = Depends(get_service)
) -> dict:
    user_data = user_data.model_dump()
    result = service.add(user_data)

    return {"message": "Successful signup", "data": result}


@router.get("/{user_id}", response_model=None)
async def get_user(
    user_id: str,
    secret_token: str | None = Header(default=None),
    service: UserService = Depends(get_service),
) -> dict:
    return {
        "message": "Successful retrieving",
        "data": service.get(user_id, secret_token),
    }


@router.put("/{user_token}", response_model=None)
async def update_user(
    # Secret token is passed through userCredentials field
    user_token: str,
    user_data: UserModel,
    service: UserService = Depends(get_service),
) -> dict:
    user_data = user_data.model_dump()
    result = service.update(user_token, user_data)

    return {"message": "Successful update", "data": result}


@router.post("/{user_token}/pfp", response_model=None)
async def set_user_pfp(
    user_token: str,
    user_credentials: UserCredentialsModel = Body(...),
    pfp: UploadFile = File(...),
    service: UserService = Depends(get_service),
) -> dict:
    user_credentials = user_credentials.model_dump()
    result = service.set_pfp(user_token, user_credentials, pfp)

    return {"message": "Successful pfp setting", "data": result}


@router.get("/{user_id}/pfp", response_model=None)
async def get_user_pfp(
    user_id: str, service: UserService = Depends(get_service)
) -> dict:
    return {"message": "Successful retrieving", "data": service.get_pfp(user_id)}
