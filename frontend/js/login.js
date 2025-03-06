import network from '../js/network.js';

const loginElement = document.getElementById('login');
const emailElement = document.getElementById('email');
const mdpElement = document.getElementById('mdp'); 

loginElement.addEventListener('click', async () => {
    try {
        const data = {
            email: emailElement.value,
            password: mdpElement.value,
        };
        const result = await network.post('login', data);
        console.log(result);
        if (result.status === 200) {
            localStorage.setItem('token', result.data.token);
        } else {
            Swal.fire({ title: "Erreur", text: "Connexion échouée", icon: "error" });
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
});