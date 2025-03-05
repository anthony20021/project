
const email = document.getElementById('email');
const nom = document.getElementById('nom');
const prenom = document.getElementById('prenom');
const mdp = document.getElementById('mdp');
const confirm_mdp = document.getElementById('confirm_mdp');
const register = document.getElementById('register');


register.addEventListener('click',async () => {
    try{
        if(mdp.value !== confirm_mdp.value){
            alert('Les mots de passe ne correspondent pas.');
            return;
        }
    
    
        const data = {
            email: email.value,
            first_name: nom.value,
            last_name: prenom.value,
            password: mdp.value,
        };
    
        
        const result = await fetch('http://localhost:8000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if(result.status === 200){
            alert('Inscription reussie');
            window.location.href = 'http://localhost:8000/login';
        }
        else{
            alert('Inscription echouee');
        }
    }
    catch(error){
        console.error(error);
    }
});