from fastapi import HTTPException, Request, status, Depends
import jwt
from typing import Optional
import os

def check_token(request: Request):
    print("Checking token...")
    token = None
    auth_header = request.headers.get("Authorization")
    SECRET_KEY = os.getenv("SECRET_KEY", "secret_key")
    
    # Vérification de la présence du token dans l'en-tête
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
    
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Pas authentifié")
    
    try:
        # Décoder le token JWT avec la clé secrète
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload  # retourne les données du token si nécessaire
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")