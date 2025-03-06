import network from '../js/network.js';

export default function initRegister() {
    const email = document.getElementById('email');
    const nom = document.getElementById('nom');
    const prenom = document.getElementById('prenom');
    const mdp = document.getElementById('mdp');
    const confirm_mdp = document.getElementById('confirm_mdp');
    const register = document.getElementById('register');

    register.addEventListener('click', async () => {
        try {
            if (mdp.value !== confirm_mdp.value) {
                Swal.fire({ title: "Erreur", text: "Les mots de passe ne correspondent pas.", icon: "error" });
                return;
            }

            const data = {
                email: email.value,
                first_name: nom.value,
                last_name: prenom.value,
                password: mdp.value,
            };

            const result = await network.post('users', data);
            console.log(result)
            if (result.status === 200) {
                Swal.fire({ title: "Succès", text: "Vous êtes inscrit", icon: "success" });
            } else {
                Swal.fire({ title: "Erreur", text: "Inscription échouée", icon: "error" });
            }
        } catch (error) {
            console.error(error);
        }
    });
}
