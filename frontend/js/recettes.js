import { get, post, del } from "./network.js";

export function init() {
    console.log("recettes.js chargé et exécuté");

    // Éléments DOM
    const createButton = document.getElementById('create');
    const createRecetteDiv = document.getElementById('createRecette');
    const submitButton = document.getElementById('login');
    const recettesDiv = document.getElementById('recettes');
    const recetteDetailsDiv = document.getElementById('recetteDetails');

    // État de l'application
    let allRecettes = [];
    let createRecette = false;
    const token = sessionStorage.getItem('token');
    const user_id = sessionStorage.getItem('user_id');

    // Initialisation
    initializeUI();

    // Configuration des événements
    setupEventListeners();

    // Chargement initial
    loadData();

    // Fonctions principales
    function initializeUI() {
        if (createButton) {
            createButton.style.display = token ? 'block' : 'none';
            createButton.textContent = "Créer une recette";
        }
    }

    function setupEventListeners() {
        createButton?.addEventListener('click', toggleCreateView);
        submitButton?.addEventListener('click', handleSubmit);
        document.getElementById('typeRecherche')?.addEventListener('change', filterRecettes);
        document.getElementById('time')?.addEventListener('input', filterRecettes);
    }

    async function loadData() {
        try {
            // Charger les recettes de base
            const recettes = await fetchRecettes();

            // Charger les favoris seulement si connecté
            let favoris = [];
            if (token) {
                favoris = await fetchFavoris();
            }

            allRecettes = mergeFavorisData(recettes, favoris);
            filterRecettes();
        } catch (error) {
            handleError("Erreur de chargement", error);
        }
    }

    async function fetchRecettes() {
        const result = await get('recettes');
        return result.status === 200 ? result.data : [];
    }

    async function fetchFavoris() {
        const result = await get('favorie');
        return result.status === 200 ? result.data : [];
    }

    function mergeFavorisData(recettes, favoris) {
        // Si pas de token, retourner les recettes sans modification
        if (!token) return recettes;

        return recettes.map(recette => ({
            ...recette,
            is_favorite: favoris.data.some(f => f.recette_id === recette.id),
            favori_id: favoris.data.find(f => f.recette_id === recette.id)?.id
        }));
    }

    function filterRecettes() {
        const typeFilter = document.getElementById('typeRecherche').value;
        const timeFilter = parseInt(document.getElementById('time').value);

        const filtered = allRecettes.filter(recette => {
            const typeMatch = !typeFilter || recette.type === typeFilter;
            const timeMatch = isNaN(timeFilter) || recette.temps_preparation <= timeFilter;
            return typeMatch && timeMatch;
        });

        displayRecettes(filtered);
    }

    function displayRecettes(recettes) {
        recettesDiv.innerHTML = recettes.length > 0
            ? recettes.map(recette => generateRecetteHTML(recette)).join('')
            : '<p>Aucune recette trouvée</p>';

        attachRecetteEvents();
    }

    function generateRecetteHTML(recette) {
        return `
            <div class="recette">
                <h3>${recette.titre}</h3>
                <p>${recette.description}</p>
                <div class="meta">
                    <span>Type: ${recette.type}</span>
                    <span>Temps: ${recette.temps_preparation} min</span>
                </div>
                <div class="actions">
                    <button class="view-details button" data-id="${recette.id}">Détails</button>
                    ${generateFavoriteButton(recette)}
                </div>
            </div>
        `;
    }

    function generateFavoriteButton(recette) {
        return token && user_id ? /*html*/`
            <button class="favorite-btn" 
                    data-id="${recette.id}"
                    data-favori-id="${recette.favori_id || ''}"
                    data-is-favorite="${recette.is_favorite}">
                ${recette.is_favorite ? '❤️ Retirer' : '🤍 Ajouter'}
            </button>
        ` : '';
    }

    function attachRecetteEvents() {
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', () => showRecetteDetails(btn.dataset.id));
        });

        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', handleFavorite);
        });
    }

    async function handleFavorite(event) {
        const button = event.target;
        const { id, favoriId, isFavorite } = button.dataset;

        try {
            if (isFavorite === 'true') {
                await del(`favorie`, { recette_id: id });
            } else {
                const result = await post('favorie', { recette_id: id });
                button.dataset.favoriId = result.data.id;
            }
            button.dataset.isFavorite = isFavorite === 'true' ? 'false' : 'true';
            button.innerHTML = isFavorite === 'true' ? '🤍 Ajouter' : '❤️ Retirer';
        } catch (error) {
            handleError("Erreur de mise à jour", error);
        }
    }

    async function showRecetteDetails(recetteId) {
        try {
            const recette = await fetchRecetteDetails(recetteId);
            if (!recette) return;

            recetteDetailsDiv.innerHTML = generateDetailHTML(recette);
            recetteDetailsDiv.style.display = 'block';
            recettesDiv.style.display = 'none';

            attachDetailEvents(recette);
            if (user_id == recette.user_id) initIngredientForm(recette.id);
        } catch (error) {
            handleError("Erreur de détails", error);
        }
    }

    async function fetchRecetteDetails(id) {
        const result = await get(`recette/${id}`);
        return result.status === 200 ? result.data : null;
    }

    function generateDetailHTML(recette) {
        return /*html*/`
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
                    ${generateIngredientsList(recette.recettes_ingredients)}
                </ul>
                ${generateDetailActions(recette)}
            </div>
        `;
    }

    function generateIngredientsList(ingredients) {
        return ingredients?.length > 0
            ? ingredients.map(i => `<li>${i.ingredient.name} - ${i.quantity}</li>`).join('')
            : '<li>Aucun ingrédient</li>';
    }

    function generateDetailActions(recette) {
        return `
            ${user_id == recette.user_id ? generateIngredientForm() : ''}
        `;
    }

    function generateIngredientForm() {
        return `
            <div class="add-ingredient">
                <h4>Ajouter un ingrédient</h4>
                <div class="form-container">
                    <select id="ingredientSelect" class="form-select"></select>
                    <input type="number" id="ingredientQuantity" class="form-input" placeholder="Quantité">
                    <select id="ingredientUnit" class="form-select">
                        ${['g', 'kg', 'ml', 'L', 'cuillère à café', 'cuillère à soupe', 'pièce']
                .map(u => `<option value="${u}">${u}</option>`).join('')}
                    </select>
                    <button id="addIngredient" class="button">Ajouter</button>
                </div>
            </div>
        `;
    }

    function attachDetailEvents(recette) {
        document.getElementById('backButton').addEventListener('click', () => {
            recetteDetailsDiv.style.display = 'none';
            recettesDiv.style.display = 'block';
        });

        document.querySelector('.favorite-btn')?.addEventListener('click', handleFavorite);
    }

    async function initIngredientForm(recetteId) {
        const ingredients = await fetchIngredients();
        populateIngredientSelect(ingredients);
        setupIngredientSubmit(recetteId);
    }

    async function fetchIngredients() {
        const result = await get('ingredients');
        return result.status === 200 ? result.data : [];
    }

    function populateIngredientSelect(ingredients) {
        const select = document.getElementById('ingredientSelect');
        select.innerHTML = ingredients.map(i =>
            `<option value="${i.id}">${i.name}</option>`
        ).join('');
    }

    function setupIngredientSubmit(recetteId) {
        document.getElementById('addIngredient').addEventListener('click', async () => {
            const ingredientId = document.getElementById('ingredientSelect').value;
            const quantity = document.getElementById('ingredientQuantity').value;
            const unit = document.getElementById('ingredientUnit').value;

            if (await addIngredient(recetteId, ingredientId, quantity, unit)) {
                showRecetteDetails(recetteId);
            }
        });
    }

    async function addIngredient(recetteId, ingredientId, quantity, unit) {
        try {
            const result = await post('recettes/ingredients', {
                recette_id: recetteId,
                ingredient_id: ingredientId,
                quantity: `${quantity} ${unit}`
            });
            return result.status === 200;
        } catch (error) {
            handleError("Erreur d'ajout", error);
            return false;
        }
    }

    function toggleCreateView() {
        createRecette = !createRecette;
        updateCreateView();
        if (!createRecette) loadData();
    }

    function updateCreateView() {
        createButton.textContent = createRecette ? 'Retour' : 'Créer une recette';
        createRecetteDiv.style.display = createRecette ? 'block' : 'none';
        recettesDiv.style.display = createRecette ? 'none' : 'block';
    }

    async function handleSubmit() {
        const recetteData = collectFormData();

        if (!validateForm(recetteData)) {
            showError("Formulaire incomplet");
            return;
        }

        try {
            const result = await post('recettes', recetteData);
            if (result.status === 200) {
                handleSubmitSuccess();
            }
        } catch (error) {
            handleError("Erreur de création", error);
        }
    }

    function collectFormData() {
        return {
            titre: document.getElementById('titre').value.trim(),
            description: document.getElementById('desc').value.trim(),
            instructions: document.getElementById('Instruction').value.trim(),
            type: document.getElementById('type').value,
            temps_preparation: parseInt(document.getElementById('temps').value)
        };
    }

    function validateForm(data) {
        return Object.values(data).every(value =>
            value !== '' && !isNaN(data.temps_preparation)
        );
    }

    function handleSubmitSuccess() {
        showSuccess('Recette créée!');
        resetForm();
        toggleCreateView();
    }

    function resetForm() {
        ['titre', 'desc', 'Instruction', 'temps'].forEach(id => {
            document.getElementById(id).value = '';
        });
    }

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
            title: 'Succès!',
            text: message,
            timer: 2000
        });
    }
}