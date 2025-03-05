from fastapi import FastAPI
from app.routers import user

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

app.include_router(user.router, prefix="/api", tags=["users"])