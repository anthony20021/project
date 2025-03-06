document.addEventListener("DOMContentLoaded", () => {
    const routes = {
        home: "template/home.html",
        recettes: "template/recette.html",
        login: "template/login.html",
        register: "template/register.html",
    };

    function loadPage(page) {
        if (routes[page]) {
            fetch(routes[page])
                .then(response => response.text())
                .then(content => {
                    const contentDiv = document.getElementById("content");
                    contentDiv.innerHTML = content;
                    window.history.pushState({}, page, `#${page}`);

                    // Exécuter les scripts inline présents dans la page chargée
                    executeScripts(contentDiv);

                    // Essayer de charger dynamiquement un fichier JS associé à la page
                    const scriptPath = `/js/${page}.js`; // Exemple : register -> /js/register.js
                    import(scriptPath)
                        .then(module => {
                            if (module.default) {
                                module.default(); // Exécute la fonction exportée par défaut
                            }
                        })
                        .catch(error => {
                            console.warn(`Aucun fichier JS trouvé pour ${page}, ou erreur d'import :`, error);
                        });
                })
                .catch(error => console.error("Erreur lors du chargement de la page:", error));
        }
    }

    function executeScripts(element) {
        const scripts = element.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            if (oldScript.src) {
                newScript.src = oldScript.src;
                newScript.defer = true;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            document.body.appendChild(newScript);
            oldScript.remove();
        });
    }

    // Ajouter les événements de clic sur les liens
    document.querySelectorAll('a[data-link]').forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            loadPage(link.getAttribute("data-link"));
        });
    });

    // Charger la page correspondant à l'URL actuelle
    const currentRoute = window.location.hash.replace("#", "") || "home";
    loadPage(currentRoute);

    // Gérer les changements d'URL (boutons retour/avance du navigateur)
    window.addEventListener("popstate", () => {
        const route = window.location.hash.replace("#", "") || "home";
        loadPage(route);
    });
});
