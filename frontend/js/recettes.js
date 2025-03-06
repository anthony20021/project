import { post } from "./network.js";

export function init() {
    console.log("recettes.js chargé et exécuté");

    const createButton = document.getElementById('create');
    const createRecetteDiv = document.getElementById('createRecette');
    const submitButton = document.getElementById('login');

    if (!createButton || !createRecetteDiv || !submitButton) {
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
        } else {
            createButton.textContent = 'Créer une recette';
            createRecetteDiv.style.display = "none";
        }
    }

    updateButtonText();

    createButton.addEventListener('click', () => {
        createRecette = !createRecette;
        updateButtonText();
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
