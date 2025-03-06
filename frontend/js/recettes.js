import { get, post } from "./network.js";

export function init() {
    console.log("recettes.js chargé et exécuté");

    // Références aux éléments DOM
    const createButton = document.getElementById('create');
    const createRecetteDiv = document.getElementById('createRecette');
    const submitButton = document.getElementById('login');
    const recettesDiv = document.getElementById('recettes');
    const recetteDetailsDiv = document.getElementById('recetteDetails');

    // Variables d'état
    let allRecettes = [];
    let createRecette = false;
    const token = sessionStorage.getItem('token');
    const user_id = sessionStorage.getItem('user_id');

    // Initialisation de l'UI
    if (createButton) {
        createButton.style.display = token ? 'block' : 'none';
    }

    createButton.textContent = "Créer une recette";

    // Configuration des événements
    setupEventListeners();

    // Chargement initial des recettes
    loadRecettes();

    // Fonctions internes
    function setupEventListeners() {
        if (createButton) {
            createButton.addEventListener('click', toggleCreateView);
        }
        if (submitButton) {
            submitButton.addEventListener('click', handleSubmit);
        }

        // Écouteurs pour les filtres
        document.getElementById('typeRecherche')?.addEventListener('change', filterRecettes);
        document.getElementById('time')?.addEventListener('input', filterRecettes);
    }

    async function loadRecettes() {
        try {
            const result = await get('recettes');
            if (result.status === 200) {
                allRecettes = result.data;
                filterRecettes();
            }
        } catch (error) {
            handleError("Erreur lors du chargement des recettes", error);
        }
    }

    function filterRecettes() {
        const type = document.getElementById('typeRecherche').value;
        const time = parseInt(document.getElementById('time').value);

        let filtered = allRecettes;

        if (type) {
            filtered = filtered.filter(r => r.type === type);
        }

        if (!isNaN(time)) {
            filtered = filtered.filter(r => r.temps_preparation >= time);
        }

        displayRecettes(filtered);
    }

    function displayRecettes(recettes) {
        recettesDiv.innerHTML = recettes.length > 0
            ? recettes.map(recette => /*html*/`
                <div class="recette">
                    <h3>${recette.titre}</h3>
                    <p>${recette.description}</p>
                    <p><strong>Type:</strong> ${recette.type}</p>
                    <p><strong>Temps:</strong> ${recette.temps_preparation} min</p>
                    <button class="view-details button" data-id="${recette.id}">Voir détails</button>
                </div>
            `).join('')
            : '<p>Aucune recette trouvée</p>';

        // Ajout des gestionnaires d'événements pour les détails
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', async () => {
                const recetteId = button.dataset.id;
                showRecetteDetails(await fetchRecetteDetails(recetteId));
            });
        });
    }

    async function fetchRecetteDetails(id) {
        try {
            const result = await get(`recette/${id}`);
            return result.status === 200 ? result.data : null;
        } catch (error) {
            handleError("Erreur lors de la récupération des détails", error);
            return null;
        }
    }

    function showRecetteDetails(recette) {
        if (!recette) return;

        recetteDetailsDiv.innerHTML = /*html*/`
            <div class="recette-detail">
                <div class="center">
                <button id="backButton">Retour</button>
                    <h2>${recette.titre}</h2>
                    <p>${recette.description}</p>
                    <div class="meta">
                        <span>Type: ${recette.type}</span>
                        <span>Temps: ${recette.temps_preparation} min</span>
                    </div>
                    <h3>Instructions:</h3>
                    <div class="instructions">${recette.instructions}</div>
                    <h3>Ingrédients:</h3>
                    <ul class="ingredients">
                        ${recette.recettes_ingredients?.map(i => `
                            <li>${i.ingredient.name} - ${i.quantity}</li>
                        `).join('') || '<li>Aucun ingrédient</li>'}
                    </ul>
                    ${user_id == recette.user_id ? getIngredientForm() : ''}
                </div>
            </div>
        `;

        recetteDetailsDiv.style.display = 'block';
        recettesDiv.style.display = 'none';

        // Gestion du retour
        document.getElementById('backButton').addEventListener('click', () => {
            recetteDetailsDiv.style.display = 'none';
            recettesDiv.style.display = 'block';
        });

        // Gestion de l'ajout d'ingrédient
        if (user_id == recette.user_id) {
            initIngredientForm(recette.id);
        }
    }

    function getIngredientForm() {
        return /*html*/`
            <div class="add-ingredient" >
                <h4>Ajouter un ingrédient</h4>
                <div class="form-container">
                    <select id="ingredientSelect" class="form-select"></select>
                    <input type="number" id="ingredientQuantity" class="form-input" placeholder="Quantité">
                    <select id="ingredientUnit" class="form-select">
                        ${['g', 'kg', 'ml', 'L', 'cuillère à café', 'cuillère à soupe', 'pièce']
                .map(u => `<option value="${u}">${u}</option>`).join('')}
                    </select>
                    <button id="addIngredient">Ajouter</button>
                </div>
            </div>
        `;
    }

    async function initIngredientForm(recetteId) {
        const ingredients = await fetchIngredients();
        const select = document.getElementById('ingredientSelect');

        select.innerHTML = ingredients.map(i => `
            <option value="${i.id}">${i.name}</option>
        `).join('');

        document.getElementById('addIngredient').addEventListener('click', async () => {
            const ingredient_id = select.value;
            const quantity = document.getElementById('ingredientQuantity').value;
            const unit = document.getElementById('ingredientUnit').value;

            if (await addIngredientToRecette(recetteId, ingredient_id, `${quantity} ${unit}`)) {
                showRecetteDetails(await fetchRecetteDetails(recetteId));
            }
        });
    }

    async function fetchIngredients() {
        try {
            const result = await get('ingredients');
            return result.status === 200 ? result.data : [];
        } catch (error) {
            handleError("Erreur des ingrédients", error);
            return [];
        }
    }

    async function addIngredientToRecette(recetteId, ingredientId, quantity) {
        try {
            const result = await post('recettes/ingredients', {
                recette_id: recetteId,
                ingredient_id: ingredientId,
                quantity: quantity
            });
            return result.status === 200;
        } catch (error) {
            handleError("Erreur d'ajout d'ingrédient", error);
            return false;
        }
    }

    function toggleCreateView() {
        createRecette = !createRecette;
        updateCreateView();
        if (!createRecette) loadRecettes();
    }

    function updateCreateView() {
        createButton.textContent = createRecette ? 'Retour' : 'Créer une recette';
        createRecetteDiv.style.display = createRecette ? 'block' : 'none';
        recettesDiv.style.display = createRecette ? 'none' : 'block';
    }

    async function handleSubmit() {
        const recetteData = {
            titre: document.getElementById('titre').value,
            description: document.getElementById('desc').value,
            instructions: document.getElementById('Instruction').value,
            type: document.getElementById('type').value,
            temps_preparation: document.getElementById('temps').value
        };

        try {
            const result = await post('recettes', recetteData);
            if (result.status === 200) {
                showSuccess('Recette créée avec succès!');
                resetForm();
                toggleCreateView();
            }
        } catch (error) {
            handleError("Erreur de création", error);
        }
    }

    function resetForm() {
        document.getElementById('titre').value = '';
        document.getElementById('desc').value = '';
        document.getElementById('Instruction').value = '';
        document.getElementById('temps').value = '';
    }

    function showSuccess(message) {
        Swal.fire({ icon: 'success', title: 'Succès!', text: message });
    }

    function handleError(context, error) {
        console.error(`${context}:`, error);
        Swal.fire({ icon: 'error', title: 'Erreur', text: context });
    }
}