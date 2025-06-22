from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pymongo.operations import SearchIndexModel

from config.database import Database
from routes.fit import router as FitRouter
from routes.item import router as ItemRouter
from routes.review import router as ReviewRouter
from routes.user import router as UserRouter


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/pfp", StaticFiles(directory="pfp"), name="pfp")

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "https://rate-my-fit-app.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

UPDATE_ITEMS = False
REPLACE_ITEMS = False

CREATE_INDICES = False
INDEX_MODEL = SearchIndexModel(
    definition={
        "mappings": {"dynamic": True}
    }
)
TARGET_COLLECTIONS = ["Users", "Fits", "Items"]


@app.on_event("startup")
async def start_db():
    Database.connect()

    if UPDATE_ITEMS:
        Database.update_items(replace=REPLACE_ITEMS)
    if CREATE_INDICES:
        Database.create_indices(INDEX_MODEL, TARGET_COLLECTIONS)


@app.get("/", tags=["Root"])
async def root() -> dict:
    return {"message": "API for RateMyFit App using FastAPI + MongoDB"}


app.include_router(UserRouter, tags=["User"], prefix="/user")
app.include_router(FitRouter, tags=["Fit"], prefix="/fit")
app.include_router(ReviewRouter, tags=["Review"], prefix="/review")
app.include_router(ItemRouter, tags=["Item"], prefix="/item")
