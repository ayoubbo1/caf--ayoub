// Attendre que la page soit chargée
document.addEventListener("DOMContentLoaded", function () {

    fetch('https://ipwho.is/')
        .then(response => response.json())
        .then(data => {
            const city = data.city;
            const country = data.country;

            const locationDiv = document.getElementById('user-location');
            locationDiv.textContent = `📍 ${city}, ${country}`;
        })
        .catch(() => {
            document.getElementById('user-location').textContent =
                '📍 Localisation indisponible';
        });




    let visitors = localStorage.getItem('visitors') || 0;
    visitors++;
    localStorage.setItem('visitors', visitors);

    document.getElementById('visitors').textContent =
        `👥 Visiteurs en ligne : ${visitors}`;

    window.addEventListener('beforeunload', () => {
        visitors--;
        localStorage.setItem('visitors', visitors);
    });



    /* ===== Formulaire de contact ===== */
    const form = document.querySelector(".contact-form");
    const messageBox = document.querySelector(".form-message");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            // Reset
            messageBox.textContent = "";
            messageBox.className = "form-message";

            // Validation
            if (name === "" || email === "" || message === "") {
                messageBox.textContent = "⚠️ Veuillez remplir tous les champs.";
                messageBox.classList.add("error");
                return;
            }

            if (!validateEmail(email)) {
                messageBox.textContent = "⚠️ Adresse email invalide.";
                messageBox.classList.add("error");
                return;
            }

            // Success
            messageBox.textContent = "✅ Message envoyé avec succès. Merci ☕";
            messageBox.classList.add("success");

            form.reset();
        });
    }

    /* ===== Bouton Voir le menu (page Accueil) ===== */
    const menuButton = document.querySelector(".hero .menuButton");

    if (menuButton) {
        menuButton.addEventListener("click", function () {
            window.location.href = "pages/menu.html";
        });
    }

    const contactButton = document.querySelector(".hero .contactButton");

    if (contactButton) {
        contactButton.addEventListener("click", function () {
            window.location.href = "pages/contact.html";
        });
    }
});

// Email validation
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
