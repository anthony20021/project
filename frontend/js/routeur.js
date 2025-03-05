document.addEventListener("DOMContentLoaded", () => {
    // Définir les routes et leurs fichiers HTML associés
    const routes = {
        home: 'template/home.html',
        recettes: 'template/recette.html',
        login: 'template/login.html',
        register : 'template/register.html'
    };

    // Fonction pour charger le contenu d'une page
    function loadPage(page) {
        // Vérifier si la route existe
        if (routes[page]) {
            fetch(routes[page]) // Récupérer le fichier HTML correspondant
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Erreur de chargement de la page.");
                    }
                    return response.text(); // Récupérer le texte HTML
                })
                .then(content => {
                    // Injecter le contenu dans l'élément #content
                    document.getElementById('content').innerHTML = content;

                    // Ajouter la nouvelle route dans l'historique
                    window.history.pushState({}, page, `#${page}`);
                })
                .catch(error => {
                    console.error("Erreur lors du chargement de la page:", error);
                });
        } else {
        }
    }

    // Ajouter les événements de clic sur les liens
    const links = document.querySelectorAll('a[data-link]');
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Empêcher le comportement par défaut
            loadPage(link.getAttribute('data-link')); // Charger la page liée
        });
    });

    // Vérifier la route actuelle et charger la page correspondante
    const currentRoute = window.location.hash.replace('#', '') || 'home'; // Par défaut, route 'home'
    loadPage(currentRoute);

    // Gérer les changements de l'historique (boutons retour/avance)
    window.addEventListener('popstate', () => {
        const route = window.location.hash.replace('#', '') || 'home';
        loadPage(route);
    });
});
