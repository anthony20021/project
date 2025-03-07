Projet de Gestion de Recettes

Ce projet est une application web de gestion de recettes, composée d'un backend en FastAPI, d'une base de données PostgreSQL et d'un frontend en Nginx. Ce README vous guidera à travers les étapes nécessaires pour configurer et lancer le projet localement.
Pré-requis

Avant de commencer, assurez-vous d'avoir installé les outils suivants sur votre machine :

    Docker

    Docker Compose

Configuration
1. Cloner le dépôt

Commencez par cloner le dépôt sur votre machine locale :
bash
Copy

git clone https://github.com/votre-utilisateur/votre-repo.git
cd votre-repo

2. Configurer le fichier .env

Dans le dossier /backend/app, vous trouverez un fichier .env-exemple. Copiez ce fichier et renommez-le en .env :
bash
Copy

cp backend/app/.env-exemple backend/app/.env

Ouvrez le fichier .env et modifiez les variables d'environnement selon vos besoins. Par exemple :
env
Copy

DATABASE_URL=postgresql://user:password@postgres:5432/mydatabase
SECRET_KEY=votre_secret_key
DEBUG=True

3. Lancer le projet avec Docker Compose

Une fois le fichier .env configuré, vous pouvez lancer le projet en utilisant Docker Compose. Exécutez la commande suivante à la racine du projet :
bash
Copy

docker-compose up --build

Cette commande va :

    Construire les images Docker pour le backend, le frontend et la base de données.

    Démarrer les conteneurs pour chaque service.

4. Accéder à l'application

Une fois les conteneurs démarrés, vous pouvez accéder aux différents services :

    Frontend : Ouvrez votre navigateur et accédez à http://localhost.

    Backend (API) : L'API sera disponible à l'adresse http://localhost:8000.

    Base de données : La base de données PostgreSQL est accessible via le port 5434 sur votre machine locale.

Structure du projet

    backend/ : Contient le code source du backend en FastAPI.

    frontend/ : Contient les fichiers statiques du frontend et la configuration Nginx.

    postgres-data/ : Dossier utilisé pour stocker les données de la base de données PostgreSQL.

    docker-compose.yml : Fichier de configuration pour Docker Compose.

Volumes Docker

    pg_data : Volume utilisé pour persister les données de la base de données PostgreSQL.

    ./backend:/app : Monte le code du backend dans le conteneur pour éviter de redémarrer le conteneur à chaque modification.

    ./frontend:/usr/share/nginx/html : Monte les fichiers du frontend dans le conteneur Nginx.

Arrêter le projet

Pour arrêter les conteneurs, utilisez la commande suivante :
bash
Copy

docker-compose down

Si vous souhaitez supprimer les volumes (y compris les données de la base de données), ajoutez l'option -v :
bash
Copy

docker-compose down -v

Contributions

Les contributions sont les bienvenues ! Si vous souhaitez contribuer au projet, veuillez suivre les étapes suivantes :

    Forkez le dépôt.

    Créez une branche pour votre fonctionnalité (git checkout -b feature/nouvelle-fonctionnalite).

    Committez vos changements (git commit -m 'Ajouter une nouvelle fonctionnalité').

    Poussez vers la branche (git push origin feature/nouvelle-fonctionnalite).

    Ouvrez une Pull Request.

Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
Auteurs

    GELE Baptiste
    ANZALA Johann
    GONZALEZ Anthony

Remarques

    Assurez-vous que les ports 80, 8000 et 5434 sont disponibles sur votre machine avant de lancer le projet.

    Si vous modifiez le fichier docker-compose.yml, n'oubliez pas de reconstruire les images avec docker-compose up --build.
