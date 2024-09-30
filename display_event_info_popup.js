
if (!window.location.href.match(/#.*$/)) {
(function() {
    'use strict';

    console.log('Tampermonkey script loaded');

    // Charger Stripe.js
    const stripeScript = document.createElement('script');
    stripeScript.src = 'https://js.stripe.com/v3/';
    document.head.appendChild(stripeScript);

    stripeScript.onload = function() {
        // Initialiser Stripe avec votre clé publique
        const stripe = Stripe('pk_test_51PyUunHDH9ZNJAkXNmFitNxhzx85K0XH2fKFbbWn0hXX0EFFBrR3AkIw4EXmOLaY38JsImykcGarqfOBXVP1sEwy00ym7fyj6T');

        function showPopup(eventInfo) {
            console.log('Creating popup with event info:', eventInfo);

            // Créer un fond noirci
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Augmenter l'opacité ici
            overlay.style.zIndex = '999';

            document.body.appendChild(overlay);

            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '10%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -10%)';
            popup.style.padding = '20px';
            popup.style.backgroundColor = '#F0EBFD'; // Violet pâle
            popup.style.borderRadius = '10px'; // Bords arrondis
            popup.style.zIndex = '1000';
            popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

            popup.innerHTML = `
                <h2 style="color: black;">
                    <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" focusable="false" class="svg-inline--fa fa-shield-check fa-fw" viewBox="0 0 512 512" style="width: 24px; height: 24px; margin-right: 8px;">
                        <path fill="currentColor" d="M269.4 2.9C265.2 1 260.7 0 256 0s-9.2 1-13.4 2.9L54.3 82.8c-22 9.3-38.4 31-38.3 57.2c.5 99.2 41.3 280.7 213.6 363.2c16.7 8 36.1 8 52.8 0C454.7 420.7 495.5 239.2 496 140c.1-26.2-16.3-47.9-38.3-57.2L269.4 2.9zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path>
                    </svg>
                    Annulation flexible
                </h2>
                <p>Reprogramme facilement ou fais-toi rembourser si tu annules jusqu'à 48h avant le début de ton expérience. Le tout, sans discuter!</p>
                <label class="switch">
                    <input type="checkbox" id="toggleDetails">
                    <span class="slider round"></span> Ajouter pour ${eventInfo.finalPrice || 'Non trouvé'} €
                </label>
                <div id="coverageDetails">
                    <p><strong>Ce qui est couvert :</strong></p>
                    <ul style="list-style-type: none;">
                        <li><span style="color: green;">✅</span> Maladie, accident corporel grave ou décès</li>
                        <li><span style="color: green;">✅</span> Grève</li>
                        <li><span style="color: green;">✅</span> Naissance ou complication de grossesse</li>
                        <li><span style="color: green;">✅</span> Contrainte professionnelle ou examen</li>
                        <li><span style="color: green;">✅</span> Tout autre événement aléatoire vous empêchant de vous rendre à l’évènement</li>
                    </ul>
                </div>
                <div id="eventDetails" style="display: none;">
                    <p><strong>Nom :</strong> ${eventInfo.name || 'Non trouvé'}</p>
                    <p><strong>Date :</strong> ${eventInfo.date || 'Non trouvé'}</p>
                    <p><strong>Lieu :</strong> ${eventInfo.place || 'Non trouvé'}</p>
                    <p><strong>Nombre de billets :</strong> ${eventInfo.numberOfTickets || 'Non trouvé'}</p>
                    <p><strong>Prix final :</strong> ${eventInfo.finalPrice || 'Non trouvé'} €</p>
                    <p><strong>Email :</strong> <input type="text" id="emailInput" value="${eventInfo.email || ''}"></p>
                    <p><strong>Prénom :</strong> <input type="text" id="firstNameInput" value="${eventInfo.firstName || ''}"></p>
                    <p><strong>Nom de famille :</strong> <input type="text" id="lastNameInput" value="${eventInfo.lastName || ''}"></p>
                </div>
            `;

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'none';
            buttonContainer.style.justifyContent = 'space-between';
            buttonContainer.style.alignItems = 'center';
            buttonContainer.style.marginTop = '20px';

            // Ajouter le bouton "Fermer" au conteneur
            const closeButton = document.createElement('button');
            closeButton.id = 'closePopup';
            closeButton.style.display = 'block';
            closeButton.style.padding = '15px 30px';
            closeButton.style.backgroundColor = 'transparent';
            closeButton.style.color = '#000';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '25px';
            closeButton.style.fontSize = '18px';
            closeButton.style.fontWeight = 'bold';
            closeButton.style.cursor = 'pointer';
            closeButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            closeButton.style.transition = 'transform 0.3s';
            closeButton.textContent = 'Fermer';
            buttonContainer.appendChild(closeButton);

            // Ajouter le bouton "Payer" au conteneur
            const payButton = document.createElement('button');
            payButton.id = 'payNow';
            payButton.style.display = 'block';
            payButton.style.padding = '15px 30px';
            payButton.style.backgroundColor = '#28a745';
            payButton.style.color = 'white';
            payButton.style.border = 'none';
            payButton.style.borderRadius = '25px';
            payButton.style.fontSize = '18px';
            payButton.style.fontWeight = 'bold';
            payButton.style.cursor = 'pointer';
            payButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            payButton.style.transition = 'background-color 0.3s, transform 0.3s';
            payButton.textContent = 'Payer';
            buttonContainer.appendChild(payButton);

            // Ajouter le conteneur des boutons à la popup
            popup.appendChild(buttonContainer);

            document.body.appendChild(popup);


            document.getElementById('toggleDetails').addEventListener('change', (event) => {
                const coverageDetails = document.getElementById('coverageDetails');
                const eventDetails = document.getElementById('eventDetails');
                if (event.target.checked) {
                    coverageDetails.style.display = 'none';
                    eventDetails.style.display = 'block';
                    buttonContainer.style.display = 'flex'; // Afficher les boutons
                } else {
                    coverageDetails.style.display = 'block';
                    eventDetails.style.display = 'none';
                    buttonContainer.style.display = 'none'; // Masquer les boutons
                }
            });

            document.getElementById('closePopup').addEventListener('click', () => {
                popup.remove();
                overlay.remove();
            });

            document.getElementById('payNow').addEventListener('click', async () => {
                const updatedEmail = document.getElementById('emailInput').value;
                const updatedFirstName = document.getElementById('firstNameInput').value;
                const updatedLastName = document.getElementById('lastNameInput').value;
                eventInfo.email = updatedEmail;
                eventInfo.firstName = updatedFirstName;
                eventInfo.lastName = updatedLastName;
                localStorage.setItem('eventInfo', JSON.stringify(eventInfo));
                const response = await fetch('https://pg-ai.bubbleapps.io/version-test/api/1.1/wf/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prix: eventInfo.finalPrice,
                        name: eventInfo.name,
                        email: eventInfo.email,
                        date: eventInfo.date,
                        lieu: eventInfo.place,
                        nbrplace: eventInfo.numberOfTickets,
                        firstname: eventInfo.firstName,
                        lastname: eventInfo.lastName,
                        link: window.location.href
                    })
                });

                const data = await response.json();
                console.log(data);
                console.log(data.response.link + "test/" + data.response.id);
                window.location.href = data.response.link + "test/" + data.response.id;
            });

            document.getElementById('payNow').addEventListener('mouseover', () => {
                document.getElementById('payNow').style.backgroundColor = '#218838';
                document.getElementById('payNow').style.transform = 'scale(1.05)';
            });

            document.getElementById('payNow').addEventListener('mouseout', () => {
                document.getElementById('payNow').style.backgroundColor = '#28a745';
                document.getElementById('payNow').style.transform = 'scale(1)';
            });
        }



        function loadEventInfo() {
            const eventInfo = JSON.parse(localStorage.getItem('eventInfo'));
            if (eventInfo) {
                showPopup(eventInfo);
            } else {
                console.log('Aucune information d\'événement trouvée dans le local storage');
            }
        }

        function addButton() {
            const button = document.createElement('button');
            button.innerText = 'Afficher les informations de l\'événement';
            button.style.position = 'fixed';
            button.style.bottom = '10px';
            button.style.right = '10px';
            button.style.padding = '10px 20px';
            button.style.backgroundColor = '#007bff';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.zIndex = '1000';

            button.addEventListener('click', loadEventInfo);

            document.body.appendChild(button);
        }

        window.addEventListener('load', () => {
            console.log('Page loaded');
            addButton();
        });
    };


})()};