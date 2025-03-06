import { get, post } from "./network.js"
export function init() {
    console.log("recettes.js chargé et exécuté");

    const createButton = document.getElementById('create');
    const createRecetteDiv = document.getElementById('createRecette');
    const submitButton = document.getElementById('login');
    const recettesDiv = document.getElementById('recettes'); // div où afficher les recettes

    if (!createButton || !createRecetteDiv || !submitButton || !recettesDiv) {
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
            // Affichage des recettes
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

    // Affichage des recettes
    function displayRecettes(recettes) {
        recettesDiv.innerHTML = ''; // Vide la div avant d'ajouter les nouvelles recettes
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
                <p><strong>Instructions:</strong> ${recette.instructions}</p>
            `;

            recettesDiv.appendChild(recetteDiv);
        });
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
            createRecette = false; // Retour à l'affichage des recettes
            updateButtonText(); // Met à jour l'état du bouton
            getRecettes(); // Recharge les recettes
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
