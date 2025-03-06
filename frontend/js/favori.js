import { get, del } from "./network.js";

export function init() {
    console.log("favoris.js chargé et exécuté");

    // Éléments DOM
    const favoriesDiv = document.getElementById('content');
    const token = sessionStorage.getItem('token');
    const user_id = sessionStorage.getItem('user_id');

    // État de l'application
    let allFavories = [];

    // Chargement initial
    loadData();

    async function loadData() {
        try {
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Accès non autorisé',
                    text: 'Veuillez vous connecter pour accéder à vos favoris'
                });
                return;
            }

            const result = await get('favorie/recettes');
            if (result.status === 200) {
                allFavories = result.data.data;
                displayFavories();
            }
        } catch (error) {
            handleError("Erreur de chargement des favoris", error);
        }
    }

    function displayFavories() {
        if (allFavories.length === 0) {
            favoriesDiv.innerHTML = '<p>Aucun favori pour le moment</p>';
            return;
        }

        favoriesDiv.innerHTML = `
            <div class="center">
                <h1>Mes favoris</h1>
                <div class="favorites-list">
                    ${allFavories.map(favori => generateFavoriteHTML(favori)).join('')}
                </div>
            </div>
        `;

        attachFavoriteEvents();
    }

    function generateFavoriteHTML(favori) {
        return `
            <div class="recette">
                <h3>${favori.titre}</h3>
                <p>${favori.description}</p>
                <div class="meta">
                    <span>Type: ${favori.type}</span>
                    <span>Temps: ${favori.temps_preparation} min</span>
                </div>
                <div class="actions">
                    <button class="view-details button" data-id="${favori.id}">Détails</button>
                    <button class="remove-favorite button" 
                            data-id="${favori.id}" 
                            style="background-color: red;">
                        Retirer des favoris
                    </button>
                </div>
            </div>
        `;
    }

    async function showRecetteDetails(recetteId) {
        try {
            const result = await get(`recette/${recetteId}`);
            if (!result.data) return;

            const recette = result.data;
            favoriesDiv.innerHTML = `
                <div class="recette-detail">
                    <button id="backButton" class="button">Retour aux favoris</button>
                    <h2>${recette.titre}</h2>
                    <div class="meta">
                        <span>Type: ${recette.type}</span>
                        <span>Temps: ${recette.temps_preparation} min</span>
                    </div>
                    <h3>Description</h3>
                    <p>${recette.description}</p>
                    <h3>Instructions</h3>
                    <div class="instructions">${recette.instructions}</div>
                    <h3>Ingrédients</h3>
                    <ul class="ingredients">
                        ${recette.recettes_ingredients?.map(i => `
                            <li>${i.ingredient.name} - ${i.quantity}</li>
                        `).join('') || '<li>Aucun ingrédient</li>'}
                    </ul>
                    <button class="remove-favorite button" 
                            data-id="${recette.id}" 
                            style="background-color: red; margin-top: 20px;">
                        Retirer des favoris
                    </button>
                </div>
            `;

            // Gestion du bouton retour
            document.getElementById('backButton').addEventListener('click', () => {
                displayFavories();
            });

            // Gestion de la suppression depuis les détails
            document.querySelector('.remove-favorite').addEventListener('click', handleRemoveFavorite);

        } catch (error) {
            handleError("Erreur de chargement des détails", error);
        }
    }

    function attachFavoriteEvents() {
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', () => showRecetteDetails(btn.dataset.id));
        });

        document.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', handleRemoveFavorite);
        });
    }

    async function handleRemoveFavorite(event) {
        const button = event.target;
        const recetteId = button.dataset.id;

        try {
            const response = await del(`favorie`, { recette_id: recetteId });

            if (response.status === 200) {
                showSuccess('Recette retirée des favoris !');
                // Recharger les données au lieu de supprimer visuellement
                await loadData();
            }
        } catch (error) {
            handleError("Erreur de suppression", error);
        }
    }

    // Les fonctions ci-dessous peuvent être importées d'un module commun si nécessaire
    function handleError(context, error) {
        console.error(context, error);
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: `${context}: ${error.message || 'Erreur inconnue'}`
        });
    }

    function showSuccess(message) {
        Swal.fire({
            icon: 'success',
            title: 'Succès !',
            text: message,
            timer: 2000
        });
    }

    // Fonction pour afficher les détails (identique à recettes.js)
    async function showRecetteDetails(recetteId) {
        try {
            const result = await get(`recette/${recetteId}`);
            if (!result.data) return;

            const recette = result.data;

            // Crée le contenu des détails
            const detailsHTML = /*html*/ `
                <div class="recette-detail">
                    <button id="backButton" class="button" style="margin-bottom: 20px;">← Retour</button>
                    <h2>${recette.titre}</h2>
                    <div class="meta">
                        <span>Type: ${recette.type}</span>
                        <span>Temps: ${recette.temps_preparation} min</span>
                    </div>
                    <h3>Description</h3>
                    <p>${recette.description}</p>
                    <h3>Instructions</h3>
                    <pre class="instructions">${recette.instructions}</pre>
                    <h3>Ingrédients</h3>
                    <ul class="ingredients">
                        ${recette.recettes_ingredients?.map(i => `
                            <li>${i.ingredient.name} - ${i.quantity}</li>
                        `).join('') || '<li>Aucun ingrédient</li>'}
                    </ul>
                    <button class="remove-favorite button" 
                            data-id="${recette.id}" 
                            style="background-color: #ff4444; margin-top: 20px;">
                        Retirer des favoris
                    </button>
                </div>
            `;

            // Remplace le contenu actuel
            favoriesDiv.innerHTML = detailsHTML;

            // Gestion du bouton retour
            document.getElementById('backButton').addEventListener('click', displayFavories);

            // Gestion de la suppression depuis les détails
            document.querySelector('.remove-favorite').addEventListener('click', handleRemoveFavorite);

        } catch (error) {
            handleError("Erreur de chargement des détails", error);
        }
    }
}