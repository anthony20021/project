from fastapi import FastAPI
from app.routers import user
from fastapi.middleware.cors import CORSMiddleware
from app.routers import recette
from app.routers import commentaire
from app.routers import recette_ingredient
from app.routers import favorie
from app.routers import ingredient

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

app.include_router(user.router, prefix="/api", tags=["users"])
app.include_router(recette.router, prefix="/api", tags=["recettes"])
app.include_router(commentaire.router, prefix="/api", tags=["commentaires"])
app.include_router(recette_ingredient.router, prefix="/api", tags=["recettes_ingredients"])
app.include_router(favorie.router, prefix="/api", tags=["favories"])
app.include_router(ingredient.router, prefix="/api", tags=["ingredients"])
