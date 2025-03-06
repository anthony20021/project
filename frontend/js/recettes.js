import { get, post } from "./network.js";

export function init() {
    console.log("recettes.js chargé et exécuté");

    const createButton = document.getElementById('create');
    const createRecetteDiv = document.getElementById('createRecette');
    const submitButton = document.getElementById('login');
    const recettesDiv = document.getElementById('recettes'); // div où afficher les recettes
    const recetteDetailsDiv = document.getElementById('recetteDetails'); // div pour afficher les détails d'une recette

    if (!createButton || !createRecetteDiv || !submitButton || !recettesDiv || !recetteDetailsDiv) {
        console.warn("Les éléments du formulaire de création de recette ne sont pas encore disponibles.");
        return;
    }

    let createRecette = false;
    const token = sessionStorage.getItem('token');

    createButton.style.display = token ? 'block' : 'none';

    function updateButtonText() {
        if (createRecette) {
            createButton.textContent = 'Retour';
            createRecetteDiv.style.display = "block";
            recettesDiv.style.display = "none"; 
        } else {
            createButton.textContent = 'Créer une recette';
            createRecetteDiv.style.display = "none";
            recettesDiv.style.display = "block"; 
        }
    }

    updateButtonText();

    // Récupérer les recettes depuis l'API
    async function getRecettes() {
        try {
            const result = await get('recettes');
            if (result.status !== 200) {
                throw new Error("Erreur lors de la récupération des recettes");
            }
            const recettes = result.data;
            displayRecettes(recettes);
        } catch (error) {
            console.error("Erreur:", error);
            Swal.fire({
                title: "Erreur",
                text: "Une erreur inconnue est survenue lors de la récupération des recettes",
                icon: "error"
            });
        }
    }

    // Affichage de la liste des recettes
    function displayRecettes(recettes) {
        recettesDiv.innerHTML = ''; // Vider la div
        if (recettes.length === 0) {
            recettesDiv.innerHTML = "<p>Aucune recette disponible.</p>";
            return;
        }

        recettes.forEach(recette => {
            const recetteDiv = document.createElement('div');
            recetteDiv.classList.add('recette');

            recetteDiv.innerHTML = `
                <h3>${recette.titre}</h3>
                <p>${recette.description}</p>
                <p><strong>Type:</strong> ${recette.type}</p>
                <p><strong>Temps de préparation:</strong> ${recette.temps_preparation} minutes</p>
                <button class="view-details button" data-id="${recette.id}" style="background-color: #317d0f;">Voir les détails</button>
            `;

            // Ajout de l'événement pour afficher les détails
            const viewDetailsButton = recetteDiv.querySelector('.view-details');
            viewDetailsButton.addEventListener('click', () => {
                getRecetteDetails(recette.id);
            });

            recettesDiv.appendChild(recetteDiv);
        });
    }

    // Récupérer et afficher les détails d'une recette, avec la possibilité d'ajouter un ingrédient
    async function getRecetteDetails(recetteId) {
        try {
            const result = await get(`recette/${recetteId}`);
            if (result.status !== 200) {
                throw new Error("Erreur lors de la récupération des détails de la recette");
            }
            const recette = result.data;
    
            // Construction du contenu des détails de la recette
            let detailsHTML = `
                <h3>${recette.titre}</h3>
                <p>${recette.description}</p>
                <p><strong>Type:</strong> ${recette.type}</p>
                <p><strong>Temps de préparation:</strong> ${recette.temps_preparation} minutes</p>
                <p><strong>Instructions:</strong> ${recette.instructions}</p>
                <h4>Ingrédients:</h4>
                <ul>
            `;
            if (recette.recettes_ingredients && recette.recettes_ingredients.length > 0) {
                recette.recettes_ingredients.forEach(item => {
                    detailsHTML += `<li>${item.ingredient.name} (Quantité: ${item.quantity})</li>`;
                });
            } else {
                detailsHTML += `<li>Aucun ingrédient associé.</li>`;
            }
            detailsHTML += `</ul>`;
    
            if (user_id === recette.user_id) {
                // Ajouter le formulaire d'ajout d'ingrédient
                detailsHTML += `
                <div id="addIngredientForm" class="form-container">
                    <h4>Ajouter un ingrédient</h4>
                    <select id="ingredientSelect" class="form-select"></select>
                    <input type="number" id="ingredientQuantity" class="form-input" placeholder="Quantité" />
                    <select id="ingredientUnit" class="form-select">
                        <option value="Cuillère à soupe">Cuillère à soupe</option>
                        <option value="Cuillère à café">Cuillère à café</option>
                        <option value="ml">ml</option>
                        <option value="l">l</option>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="pièce">pièce</option>
                        <!-- Ajoute d'autres unités ici si besoin -->
                    </select>
                    <button id="addIngredientButton" class="form-button">Ajouter l'ingrédient</button>
                </div>
                `;
            }
            detailsHTML += `<button id="backButton">Retour</button>`;
    
            recetteDetailsDiv.innerHTML = detailsHTML;
            recetteDetailsDiv.style.display = 'block';
            recettesDiv.style.display = 'none';
    
            // Bouton Retour
            document.getElementById('backButton').addEventListener('click', () => {
                recetteDetailsDiv.style.display = 'none';
                recettesDiv.style.display = 'block';
            });
    
            // Si l'utilisateur peut ajouter un ingrédient, charger la liste des ingrédients et ajouter l'événement
            if (user_id === recette.user_id) {
                const ingredientSelect = document.getElementById('ingredientSelect');
                ingredientSelect.innerHTML = ""; // Vider le select
                const ingredientsResult = await get('ingredients');
                if (ingredientsResult.status !== 200) {
                    throw new Error("Erreur lors de la récupération des ingrédients");
                }
                ingredientsResult.data.forEach(ingredient => {
                    const option = document.createElement('option');
                    option.value = ingredient.id;
                    option.textContent = ingredient.name;
                    ingredientSelect.appendChild(option);
                });
    
                // Ajouter un événement pour le bouton Ajouter l'ingrédient
                document.getElementById('addIngredientButton').addEventListener('click', async () => {
                    const selectedIngredientId = document.getElementById('ingredientSelect').value;
                    const quantity = document.getElementById('ingredientQuantity').value;
                    const unit = document.getElementById('ingredientUnit').value;
    
                    if (!selectedIngredientId || !quantity || !unit) {
                        Swal.fire({
                            title: "Erreur",
                            text: "Veuillez sélectionner un ingrédient, entrer une quantité et choisir une unité",
                            icon: "error"
                        });
                        return;
                    }
    
                    // Concaténation de la quantité et de l'unité
                    const formattedQuantity = `${quantity} ${unit}`;
    
                    try {
                        const postData = {
                            recette_id: recette.id,
                            ingredient_id: parseInt(selectedIngredientId),
                            quantity: formattedQuantity
                        };
                        const addResult = await post('recettes/ingredients', postData);
                        if (addResult.status !== 200) {
                            throw new Error("Erreur lors de l'ajout de l'ingrédient");
                        }
                        Swal.fire({
                            title: "Succès",
                            text: "Ingrédient ajouté à la recette",
                            icon: "success"
                        });
                        // Recharge les détails pour mettre à jour la liste des ingrédients
                        getRecetteDetails(recetteId);
                    } catch (error) {
                        console.error("Erreur:", error);
                        Swal.fire({
                            title: "Erreur",
                            text: "Une erreur est survenue lors de l'ajout de l'ingrédient",
                            icon: "error"
                        });
                    }
                });
            }
        } catch (error) {
            console.error("Erreur:", error);
            Swal.fire({
                title: "Erreur",
                text: "Une erreur inconnue est survenue lors de la récupération des détails de la recette",
                icon: "error"
            });
        }
    }

    // Initialisation des recettes au chargement de la page
    getRecettes();

    createButton.addEventListener('click', () => {
        createRecette = !createRecette;
        updateButtonText();
        if (!createRecette) {
            getRecettes(); // Recharge les recettes après avoir cliqué sur retour
        }
    });

    submitButton.addEventListener('click', async () => {
        const titre = document.getElementById('titre').value.trim();
        const description = document.getElementById('desc').value.trim();
        const instructions = document.getElementById('Instruction').value.trim();
        const type = document.getElementById('type').value;
        const tempsPreparation = document.getElementById('temps').value.trim();

        if (!titre || !description || !instructions || !type || !tempsPreparation) {
            Swal.fire({
                title: "Erreur",
                text: "Merci de remplir tous les champs",
                icon: "error"
            });
            return;
        }

        const recetteData = {
            titre,
            description,
            instructions,
            type,
            temps_preparation: parseInt(tempsPreparation, 10)
        };

        try {
            const result = await post('recettes', recetteData);

            if (result.status !== 200) {
                throw new Error("Erreur lors de la création de la recette");
            }

            Swal.fire({
                title: "Super !",
                text: "Votre recette a été ajoutée",
                icon: "success"
            });

            // Réinitialisation du formulaire
            document.getElementById('titre').value = "";
            document.getElementById('desc').value = "";
            document.getElementById('Instruction').value = "";
            document.getElementById('temps').value = "";

            // Recharge la liste des recettes après la création
            createRecette = false;
            updateButtonText();
            getRecettes();
        } catch (error) {
            console.error("Erreur:", error);
            Swal.fire({
                title: "Erreur",
                text: "Une erreur inconnue est survenue",
                icon: "error"
            });
        }
    });
}
