from fastapi import APIRouter, Depends

from dao.aggregator import DAO
from models.item import ItemModel
from services.item import ItemService


router = APIRouter()


def get_service() -> ItemService:
    return ItemService(DAO())


@router.post("/add", response_model=None)
async def add_item(
    item_data: ItemModel, service: ItemService = Depends(get_service)
) -> dict:
    item_data = item_data.model_dump()
    result = service.add(item_data)

    return {"message": "Successful adding", "data": result}


@router.get("/{item_id}", response_model=None)
async def read_item(item_id: str, service: ItemService = Depends(get_service)) -> dict:
    return {"message": "Successful retrieving", "data": service.get(item_id)}


@router.put("/{item_id}", response_model=None)
async def update_item(
    item_id: str, item_data: ItemModel, service: ItemService = Depends(get_service)
) -> dict:
    item_data = item_data.model_dump()
    result = service.update(item_id, item_data)

    return {"message": "Successful update", "data": result}


@router.get("/by/{brand_name}", response_model=None)
async def get_brand_items(
    brand_name: str,
    skip: int = None,
    limit: int = None,
    service: ItemService = Depends(get_service),
) -> list[dict]:
    return {
        "message": "Successful retrieving",
        "data": service.get_by_brand(brand_name, skip, limit),
    }


@router.get("/all/brands", response_model=None)
async def get_all_brands(service: ItemService = Depends(get_service)) -> dict:
    return {"message": "Successful retrieving", "data": service.get_brands()}


@router.get("/search", response_model=None)
async def search_item(
    item_name: str, limit: int = 15, service: ItemService = Depends(get_service)
) -> dict:
    return {
        "message": "Successful retrieving",
        "data": service.search(item_name, limit),
    }
