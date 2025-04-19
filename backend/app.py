from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.user import router as UserRouter
from config.database import Database


origins = [
    "http://localhost",
    "http://localhost:3000"
]
app = FastAPI()
app.add_middleware(
    CORSMiddleware, allow_origins=origins,
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)


@app.on_event("startup")
async def startDB():
    Database.connect()


@app.get("/", tags=["Root"])
async def root() -> dict:
    return {"message": "API for RateMyFit App using FastAPI + MongoDB"}


app.include_router(UserRouter, tags=["User"], prefix="/user")