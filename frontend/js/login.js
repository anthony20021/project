import { post } from "./network.js";

export function init() {
    console.log("Login.js chargé et exécuté");

    const loginElement = document.getElementById('login');
    const emailElement = document.getElementById('email');
    const mdpElement = document.getElementById('mdp');

    if (!loginElement || !emailElement || !mdpElement) {
        console.warn("Les éléments du formulaire de login ne sont pas encore disponibles.");
        return;
    }

    loginElement.addEventListener('click', async () => {
        try {
            const data = {
                email: emailElement.value,
                password: mdpElement.value,
            };
            const result = await post('login', data);
            console.log(result);
            if (result.status === 200) {
                sessionStorage.setItem('token', result.data.token);
                window.location.href = '#recettes';
                location.reload(true);
            } else {
                Swal.fire({ title: "Erreur", text: "Connexion échouée", icon: "error" });
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Swal.fire({ title: "Erreur", text: "Connexion échouée", icon: "error" });
        }
    });
}
