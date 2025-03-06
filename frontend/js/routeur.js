document.addEventListener("DOMContentLoaded", () => {
    const routes = {
        home: "template/home.html",
        recettes: "template/recette.html",
        login: "template/login.html",
        register: "template/register.html",
        favori: "template/favori.html"
    };

    async function loadPage(page) {
        if (routes[page]) {
            try {
                const response = await fetch(routes[page]);
                const content = await response.text();

                const contentDiv = document.getElementById("content");
                contentDiv.innerHTML = content;
                window.history.pushState({}, page, `#${page}`);

                // Exécuter les scripts inline présents dans la page chargée
                executeScripts(contentDiv);

                // Charger dynamiquement un fichier JS associé à la page en tant que module
                const scriptPath = `/js/${page}.js`;
                await loadScriptAsModule(scriptPath);
            } catch (error) {
                console.error("Erreur lors du chargement de la page:", error);
            }
        }
    }

    async function loadScriptAsModule(scriptPath) {
        try {
            // Import dynamique du module avec bypass cache
            const module = await import(`${scriptPath}?${Date.now()}`);

            // Vérifie si le module exporte une fonction init() et l'exécute
            if (module.init) {
                module.init();
            }
        } catch (error) {
            console.warn(`Aucun module trouvé pour ${scriptPath}, ou erreur d'import :`, error);
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
