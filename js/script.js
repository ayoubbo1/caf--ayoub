/* ==========================================================
   PARTIE 1 : LOGIQUE GENERALE (Location, Visitors, etc.)
   ========================================================== */
document.addEventListener("DOMContentLoaded", function () {
    // --- Localisation ---
    fetch('https://ipwho.is/')
        .then(response => response.json())
        .then(data => {
            const locationDiv = document.getElementById('user-location');
            if(locationDiv) locationDiv.textContent = `📍 ${data.city}, ${data.country}`;
        })
        .catch(() => {
            const loc = document.getElementById('user-location');
            if(loc) loc.textContent = '📍 Localisation indisponible';
        });

    // --- Compteur de visiteurs ---
    let visitors = localStorage.getItem('visitors') || 0;
    visitors++;
    localStorage.setItem('visitors', visitors);

    document.getElementById('visitors').textContent =
        `👥 Visiteurs en ligne : ${visitors}`;

    window.addEventListener('beforeunload', () => {
        visitors--;
        localStorage.setItem('visitors', visitors);
    });

    // --- Navigation Buttons ---
    const menuBtn = document.querySelector(".menuButton");
    if (menuBtn) menuBtn.addEventListener("click", () => window.location.href = "pages/menu.html");

    const contactBtn = document.querySelector(".contactButton");
    if (contactBtn) contactBtn.addEventListener("click", () => window.location.href = "pages/contact.html");

    // Lancer le chargement de l'IA une fois le DOM prêt
    initAI();
});

/* ==========================================================
   PARTIE 2 : ATELIER IA (TensorFlow.js & MobileNet)
   ========================================================== */
let model;

// 1. Charger le modèle MobileNet [cite: 6, 11, 18]
async function initAI() {
    const predictionText = document.getElementById('predictionText');
    try {
        predictionText.textContent = "Chargement de l'IA... ⏳";
        model = await mobilenet.load(); // Chargement du modèle pré-entraîné [cite: 6]
        predictionText.textContent = "IA prête ! Choisissez une photo de boisson.";
        console.log("Modèle MobileNet chargé avec succès.");
    } catch (e) {
        predictionText.textContent = "Erreur de chargement de l'IA.";
        console.error(e);
    }
}

// 2. Gérer l'upload et l'affichage de l'image [cite: 14, 15]
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');

if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
                imagePreview.style.display = 'block';
                
                // On attend que l'image soit chargée pour éviter l'erreur 0x0 
                imagePreview.onload = () => {
                    classifyDrink();
                };
            };
            reader.readAsDataURL(file);
        }
    });
}

// 3. Reconnaissance et Suggestion [cite: 19, 20, 22, 23, 24]
async function classifyDrink() {
    if (!model) return;

    const predictionText = document.getElementById('predictionText');
    const suggestionText = document.getElementById('suggestionText');
    
    predictionText.textContent = "Analyse en cours... 🔍";

    // Utilisation de MobileNet pour classer l'image [cite: 19]
    const predictions = await model.classify(imagePreview);
    const topResult = predictions[0].className.toLowerCase(); // Résultat le plus probable [cite: 22]

    predictionText.innerHTML = `L'IA a détecté : <strong>${topResult}</strong>`;

    // Logique métier : Chaud vs Froid & Suggestion [cite: 23, 24]
    const drinksDatabase = {
    "chaudes": {
        "labels": ["coffee", "espresso", "cappuccino", "hot chocolate", "mug", "cup", "teapot"],
        "message": "☕ Boisson chaude détectée.",
        "suggestions": ["un croissant", "un muffin", "un cookie"]
    },
    "froides": {
        "labels": ["ice", "glass", "beer", "cocktail", "smoothie", "soda", "bottle"],
        "message": "🍹 Boisson fraîche détectée.",
        "suggestions": ["une glace", "une salade de fruits", "des macarons"]
    }
};
    // Variable bach n-stockiw ach lqa l'model
let categoryFound = null;

// Boucle 3la l'objet JSON bach n-tistiw kol "category" (chaudes/froides)
for (const category in drinksDatabase) {
    // Vérification wash chi keyword men l'model mktoub f' l'liste dialna 
    const hasMatch = drinksDatabase[category].labels.some(label => topResult.includes(label));
    
    if (hasMatch) {
        categoryFound = drinksDatabase[category];
        break; // Lqina l'category, n-khrejo men l'boucle
    }
}

// Affichage dial l'natija o l'suggestion [cite: 20, 24]
if (categoryFound) {
    // Kankhtaro suggestion au hasard men l'liste
    const randomSugg = categoryFound.suggestions[Math.floor(Math.random() * categoryFound.suggestions.length)];
    
    suggestionText.innerHTML = `${categoryFound.message}  !`;
} else {
    suggestionText.textContent = "boisson inconnue !!";
}
}