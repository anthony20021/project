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
            const commentaire = await getCommentaire(recetteId);
            console.log(commentaire)
            if (!recette) return;

            recetteDetailsDiv.innerHTML = generateDetailHTML(recette, commentaire);
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

    function generateDetailHTML(recette, commentaire) {
        return /*html*/`
            <div class="recette-detail center" data-recette-id="${recette.id}">
                <button id="backButton" class="button" style="margin-bottom: 20px;">← Retour</button>
                <h2>${recette.titre}</h2>
                <div class="meta">
                    <span style="display: flex; align-items: center;">Note : ${generateNote(commentaire.data.data)}</span>
                    <span>Type: ${recette.type}</span>
                    <span>Temps: ${recette.temps_preparation} min</span>
                </div>
                <h3>Description</h3>
                <p>${recette.description}</p>
                <h3>Instructions</h3>
                <pre class="instructions">${recette.instructions}</pre>
                <h3>Ingrédients</h3>
                <ul class="ingredients">
                    ${generateIngredientsList(recette.recettes_ingredients, recette.user_id)}
                </ul>
                ${generateDetailActions(recette)}
                <h1>Commentaire<h1>
                ${generateCommentaire(commentaire)}
                <h1>Nouveau commentaire</h1>
                <div class="form-container" style="width: 100%; margin : 40px;">
                    <h3>message</h3>
                    <textarea class="form-textarea" rows="10" id="commentaire"> </textarea>
                    <h3>Note<h3>
                    <input class="form-input" type="number" id="note-input" style="width: 50px; padding-right : 0px" />/5
                    <button class="button" name="valider" id="bouton-commentaire">valider</button>
                </div>
            </div>
        `;
    }
    

    function createCommentaire(note, commentaire, recette_id){
        if(note > 5 || note < 1){
            Swal.fire({
                icon: 'error',
                title: 'Note invalide',
                text: 'La note doit etre comprise entre 1 et 5'
            })
        }
        else{
            post('commentaires', {note: note, content: commentaire, recipes_id: recette_id})
            // raffraichir
            showRecetteDetails(recette_id)
        }
        console.log(note, commentaire, recette_id)
    }

    async function getCommentaire(recette_id){
        try {
            const commentaire = get(`commentaires/${recette_id}`);
            return commentaire
        } catch (error) {
            console.error(error)
        }
    }

    function generateCommentaire(commentaire) {
        try {
            return commentaire.data.data?.length > 0
                ? commentaire.data.data.map(i => (
                    /*html*/`
                    <div class="commentaire">
                        contenu : ${i.content} 
                        note : ${i.note} 
                    </div>`
                )).join('')
                : /*html*/`<p>Aucun commentaire</p>`;
        } catch (error) {
            console.error('Error fetching comments:', error);
            return '<div>Error fetching comments</div>';
        }
    }

    function generateNote(commentaires){
        try {
            if(commentaires.length > 0){
                let note = 0;
                const nbCommentaire = commentaires.length;
                commentaires.forEach(commentaire => {
                    note += parseInt(commentaire.note)
                });
                note = note/nbCommentaire
                return /*html*/`
                    <p> ${note.toFixed(1)}</p>
                `;

            }
            else{
                return /*html*/`
                    <p>Pas de note</p>
                `
            }
        }
        catch (error){
            console.error(error)
            return "<p>Erreur</p>"
        }
    }

    function generateIngredientsList(ingredients, recette_user_id) {
        return ingredients?.length > 0
            ? ingredients.map(i => {
                const deleteButton = (user_id == recette_user_id) 
                    ? /*html*/`<button class="remove-ingredient button" data-id="${i.ingredient_id}" style="background-color : red; width: auto;">X</button>` 
                    : '';
    
                return /*html*/`
                    <li>${i.ingredient.name} - ${i.quantity} ${deleteButton}</li>
                `;
            }).join('')
            : '<li>Aucun ingrédient</li>';
    }
    

    function generateDetailActions(recette) {
        return `
            ${user_id == recette.user_id ? generateIngredientForm() : ''}
        `;
    }

    function generateIngredientForm() {
        return /*html*/`
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
        document.getElementById('bouton-commentaire').addEventListener('click', async () => {
            const note = document.getElementById('note-input').value;
            const commentaire = document.getElementById('commentaire').value;
            createCommentaire(parseInt(note),commentaire, recette.id)
        })

        document.querySelectorAll('.remove-ingredient').forEach(btn => {
            btn.addEventListener('click', handleIngredientDelete);
        });

        document.querySelector('.favorite-btn')?.addEventListener('click', handleFavorite);
    }

    async function handleIngredientDelete(event) {
        const button = event.target;
        const ingredientId = button.dataset.id;
        const recetteId = button.closest('.recette-detail').dataset.recetteId;

        console.log("Recette ID:", recetteId);
        console.log("Ingrédient ID:", ingredientId);
    
        if (!recetteId || !ingredientId) {
            handleError("Erreur", "ID de recette ou d'ingrédient manquant.");
            return;
        }
    
        try {
            await del(`recettes/ingredients`, { recette_id: recetteId, ingredient_id: ingredientId });
            showRecetteDetails(recetteId); 
        } catch (error) {
            handleError("Erreur de suppression d'ingrédient", error);
        }
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