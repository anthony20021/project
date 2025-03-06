import { get } from "./network.js";

export function init() {

    const recipesContainer = document.querySelector('.recipes-grid');
    loadPopularRecipes();

    async function loadPopularRecipes() {
        try {
            const response = await get('recettes');

            if (response.status === 200 && response.data.length > 0) {
                const recipes = response.data.slice(0, 3); // Prendre les 3 premières recettes
                const recipesHTML = recipes.map(recipe => `
                    <div class="recette">
                        <h3>${recipe.titre}</h3>
                        <p><strong>Type:</strong> ${recipe.type}</p>
                        <p><strong>Temps:</strong> ${recipe.temps_preparation} min</p>
                        <div class="button-group">
                            <button class="button view-details" data-id="${recipe.id}">Voir la recette</button>
                        </div>
                    </div>
                `).join('');

                recipesContainer.innerHTML = recipesHTML;

                // Ajouter les gestionnaires d'événements
                document.querySelectorAll('.view-details').forEach(button => {
                    button.addEventListener('click', () => {
                        const recipeId = button.dataset.id;
                        // Ici vous pouvez ajouter la logique pour afficher les détails
                        console.log('Voir recette:', recipeId);
                    });
                });
            }
        } catch (error) {
            console.error('Erreur de chargement des recettes:', error);
            recipesContainer.innerHTML = '<p>Aucune recette disponible pour le moment</p>';
        }
    }
}