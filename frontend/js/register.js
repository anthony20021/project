import { post } from "./network.js";

export function init() {
    console.log("register.js chargé avec succès");

    // Récupération des éléments du formulaire
    const email = document.getElementById('email');
    const nom = document.getElementById('nom');
    const prenom = document.getElementById('prenom');
    const mdp = document.getElementById('mdp');
    const confirm_mdp = document.getElementById('confirm_mdp');
    const register = document.getElementById('register');

    // Vérifie si les éléments existent avant d'ajouter l'événement
    if (!email || !nom || !prenom || !mdp || !confirm_mdp || !register) {
        console.warn("Certains éléments du formulaire d'inscription sont introuvables.");
        return;
    }

    register.addEventListener('click', async () => {
        try {
            // Vérification des champs vides
            if (!email.value.trim() || !nom.value.trim() || !prenom.value.trim() || !mdp.value.trim() || !confirm_mdp.value.trim()) {
                Swal.fire({ title: "Erreur", text: "Tous les champs doivent être remplis.", icon: "error" });
                return;
            }

            // Vérification de la correspondance des mots de passe
            if (mdp.value !== confirm_mdp.value) {
                Swal.fire({ title: "Erreur", text: "Les mots de passe ne correspondent pas.", icon: "error" });
                return;
            }

            const data = {
                email: email.value.trim(),
                first_name: nom.value.trim(),
                last_name: prenom.value.trim(),
                password: mdp.value,
            };

            const result = await post('users', data);

            if (result.status === 200) {
                Swal.fire({ title: "Succès", text: "Vous êtes inscrit", icon: "success" });
                
                // Réinitialisation du formulaire après succès
                email.value = "";
                nom.value = "";
                prenom.value = "";
                mdp.value = "";
                confirm_mdp.value = "";
            } else {
                Swal.fire({ title: "Erreur", text: "Inscription échouée", icon: "error" });
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            Swal.fire({ title: "Erreur", text: "Une erreur inconnue est survenue.", icon: "error" });
        }
    });
}
