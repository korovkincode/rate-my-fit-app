from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from config.database import Database
from routes.user import router as UserRouter
from routes.fit import router as FitRouter


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

origins = [
    "http://localhost",
    "http://localhost:3000"
]

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
app.include_router(FitRouter, tags=["Fit"], prefix="/fit")


'''
ToDos:
Refactor routers (implement general abstract class)
'''