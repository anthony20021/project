from fastapi import FastAPI
from app.routers import user
from fastapi.middleware.cors import CORSMiddleware
from app.routers import recette

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Accepter toutes les origines
    allow_credentials=True,
    allow_methods=["*"],  # Accepter toutes les méthodes HTTP (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Accepter tous les en-têtes
)
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

app.include_router(user.router, prefix="/api", tags=["users"])
app.include_router(recette.router, prefix="/api", tags=["recettes"])