from typing import Literal

from fastapi import APIRouter, Body, Depends, File, UploadFile

from dao.aggregator import DAO
from models.fit import FitModel
from services.fit import FitService


router = APIRouter()


def get_service() -> FitService:
    return FitService(DAO())


@router.post("/add", response_model=None)
async def add_fit(
    fit_data: FitModel = Body(...),
    pics: list[UploadFile] = File(...),
    service: FitService = Depends(get_service),
) -> dict:
    fit_data = fit_data.model_dump()
    result = service.add(fit_data, pics)

    return {"message": "Successful adding", "data": result}


@router.get("/{fit_id}", response_model=None)
async def get_fit(
    fit_id: str, full: bool = False, service: FitService = Depends(get_service)
) -> dict:
    return {"message": "Successful retrieving", "data": service.get(fit_id, full)}


@router.put("/{fit_id}", response_model=None)
async def update_fit(
    fit_id: str,
    append_pics: bool = False,
    fit_data: FitModel = Body(...),
    pics: list[UploadFile] = File(...),
    service: FitService = Depends(get_service),
) -> dict:
    fit_data = fit_data.model_dump()
    result = service.update(fit_id, append_pics, fit_data, pics)

    return {"message": "Successful update", "data": result}


@router.get("/by/{user_id}", response_model=None)
async def get_user_fits(
    user_id: str, full: bool = False, service: FitService = Depends(get_service)
) -> dict:
    return {
        "message": "Successful retrieving",
        "data": service.get_by_user(user_id, full),
    }


@router.get("/all/", response_model=None)
async def get_all_fits(
    skip: int,
    limit: int,
    sorting: str,
    direction: Literal["ASC", "DSC"],
    full: bool = False,
    service: FitService = Depends(get_service),
) -> dict:
    return {
        "message": "Successful retrieving",
        "data": service.get_all(skip, limit, sorting, direction, full),
    }


@router.get("/total/", response_model=None)
async def get_total_fits(service: FitService = Depends(get_service)) -> dict:
    return {"message": "Successful retrieving", "data": service.get_total()}
