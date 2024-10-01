if (!window.location.href.match(/#.*$/)) {
(function() {
    'use strict';

    console.log('Tampermonkey script loaded');

    // Charger Stripe.js
    const stripeScript = document.createElement('script');
    stripeScript.src = 'https://js.stripe.com/v3/';
    document.head.appendChild(stripeScript);

    stripeScript.onload = function() {

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
popup.style.top = '15%';
popup.style.left = '50%';
popup.style.transform = 'translate(-50%, -10%)';
popup.style.padding = '20px';
popup.style.backgroundColor = '#F0EBFD'; // Violet pâle
popup.style.borderRadius = '15px'; // Bords arrondis
popup.style.zIndex = '10000';
popup.style.width= '550px';
popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

popup.innerHTML = `
    <head>
          <link rel="stylesheet" href="https://igorpotard.github.io/style.css">
    </head>
    <h2 class="popup-header">
        <span>
            <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" focusable="false" class="svg-inline--fa fa-shield-check fa-fw" viewBox="0 0 512 512">
                <path fill="currentColor" d="M269.4 2.9C265.2 1 260.7 0 256 0s-9.2 1-13.4 2.9L54.3 82.8c-22 9.3-38.4 31-38.3 57.2c.5 99.2 41.3 280.7 213.6 363.2c16.7 8 36.1 8 52.8 0C454.7 420.7 495.5 239.2 496 140c.1-26.2-16.3-47.9-38.3-57.2L269.4 2.9zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path>
            </svg>
            Assurance annulation
        </span>
        <button id="closePopup" class="close-button">×</button>
    </h2>
    <p>Réservez l’esprit tranquille : annulez à tout moment et bénéficiez d’un remboursement total jusqu’au jour de votre réservation</p>
    <div id="coverageDetails">
        <h4>Ce qui est couvert</h4>
        <ul class="june-care-benefits">
            <li>
                <svg class="benefit-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" fill="#000000">
                    <path style="fill:#0079CA;" d="M16,0C7.164,0,0,7.164,0,16s7.164,16,16,16s16-7.164,16-16S24.836,0,16,0z M13.52,23.383 L6.158,16.02l2.828-2.828l4.533,4.535l9.617-9.617l2.828,2.828L13.52,23.383z"></path>
                </svg>
                <span>Maladie, accident corporel grave ou décès</span>
            </li>
            <li>
                <svg class="benefit-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" fill="#000000">
                    <path style="fill:#0079CA;" d="M16,0C7.164,0,0,7.164,0,16s7.164,16,16,16s16-7.164,16-16S24.836,0,16,0z M13.52,23.383 L6.158,16.02l2.828-2.828l4.533,4.535l9.617-9.617l2.828,2.828L13.52,23.383z"></path>
                </svg>
                <span>Grève</span>
            </li>
            <li>
                <svg class="benefit-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" fill="#000000">
                    <path style="fill:#0079CA;" d="M16,0C7.164,0,0,7.164,0,16s7.164,16,16,16s16-7.164,16-16S24.836,0,16,0z M13.52,23.383 L6.158,16.02l2.828-2.828l4.533,4.535l9.617-9.617l2.828,2.828L13.52,23.383z"></path>
                </svg>
                <span>Naissance ou complication de grossesse</span>
            </li>
            <li>
                <svg class="benefit-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" fill="#000000">
                    <path style="fill:#0079CA;" d="M16,0C7.164,0,0,7.164,0,16s7.164,16,16,16s16-7.164,16-16S24.836,0,16,0z M13.52,23.383 L6.158,16.02l2.828-2.828l4.533,4.535l9.617-9.617l2.828,2.828L13.52,23.383z"></path>
                </svg>
                <span>Contrainte professionnelle ou Examen</span>
            </li>
            <li>
                <svg class="benefit-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" fill="#000000">
                    <path style="fill:#0079CA;" d="M16,0C7.164,0,0,7.164,0,16s7.164,16,16,16s16-7.164,16-16S24.836,0,16,0z M13.52,23.383 L6.158,16.02l2.828-2.828l4.533,4.535l9.617-9.617l2.828,2.828L13.52,23.383z"></path>
                </svg>
                <span>Tout autre événement aléatoire vous empêchant de vous rendre à l’évènement</span>
            </li>
        </ul>
    </div>
    <div id="eventDetails" style="display: none;">
        <p class="june-care-input-container"><strong>Nom :</strong> <input type="text" id="nameInput" value="${eventInfo.name || 'Non trouvé'}" class="june-care-input june-care-readonly" readonly></p>
        <p class="june-care-input-container"><strong>Date :</strong> <input type="text" id="dateInput" value="${eventInfo.date || 'Non trouvé'}" class="june-care-input june-care-readonly" readonly></p>
        <p class="june-care-input-container"><strong>Lieu :</strong> <input type="text" id="placeInput" value="${eventInfo.place || 'Non trouvé'}" class="june-care-input june-care-readonly" readonly></p>
        <p class="june-care-input-container"><strong>Nombre de billets :</strong> <input type="text" id="ticketsInput" value="${eventInfo.numberOfTickets || 'Non trouvé'}" class="june-care-input june-care-readonly" readonly></p>
        <p class="june-care-input-container"><strong>Prix final :</strong> <input type="text" id="priceInput" value="${eventInfo.finalPrice * 8 / 100 || 'Non trouvé'} €" class="june-care-input june-care-readonly" readonly></p>
        <p class="june-care-input-container"><strong>Email :</strong> <input type="text" id="emailInput" value="${eventInfo.email || ''}" class="june-care-input"></p>
        <p class="june-care-input-container"><strong>Prénom :</strong> <input type="text" id="firstNameInput" value="${eventInfo.firstName || ''}" class="june-care-input"></p>
        <p class="june-care-input-container"><strong>Nom de famille :</strong> <input type="text" id="lastNameInput" value="${eventInfo.lastName || ''}" class="june-care-input"></p>
        <p>
            <input type="checkbox" id="assurance" name="assurance">
            En sélectionnant cette assurance, je confirme être résident de l’Union Européenne et déclare avoir pris connaissance, puis accepter les
            <a href="https://igorpotard.github.io/conditions-generales.pdf" style="color: blue; text-decoration: underline;" target="_blank">conditions générales</a>
            et le
            <a href="https://igorpotard.github.io/document-informations.pdf" style="color: blue; text-decoration: underline;" target="_blank">document d'information</a>.
        </p>
    </div>
`;








const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'none';
buttonContainer.style.justifyContent = 'space-between';
buttonContainer.style.alignItems = 'center';
buttonContainer.style.marginTop = '20px';



            const payButton = document.createElement('button');
            payButton.id = 'payNow';
            payButton.style.display = 'block';
            payButton.style.padding = '15px 30px';
            payButton.style.backgroundColor = '#0079CA';
            payButton.style.color = 'white';
            payButton.style.border = 'none';
            payButton.style.borderRadius = '25px';
            payButton.style.fontSize = '18px';
            payButton.style.fontWeight = 'bold';
            payButton.style.margin = 'auto';
            payButton.style.cursor = 'pointer';
            payButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            payButton.style.transition = 'background-color 0.3s, transform 0.3s';
            payButton.textContent = 'Continuer';
            buttonContainer.appendChild(payButton);

popup.appendChild(buttonContainer);




const buttonContainer2 = document.createElement('div');
buttonContainer2.style.display = 'block';
buttonContainer2.style.justifyContent = 'space-between';
buttonContainer2.style.alignItems = 'center';
buttonContainer2.style.marginTop = '20px';



const payButton2 = document.createElement('button');
payButton2.id = 'payNow2';
payButton2.style.display = 'block';
payButton2.style.padding = '15px 30px';
payButton2.style.backgroundColor = '#0079CA';
payButton2.style.color = 'white';
payButton2.style.border = 'none';
payButton2.style.borderRadius = '25px';
payButton2.style.fontSize = '18px';
payButton2.style.fontWeight = 'bold';
payButton2.style.margin = 'auto';
payButton2.style.cursor = 'pointer';
payButton2.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
payButton2.style.transition = 'background-color 0.3s, transform 0.3s';
payButton2.textContent = 'M\'assurer pour ' + (eventInfo.finalPrice * 8 / 100 || 'Non trouvé') + '€';
buttonContainer2.appendChild(payButton2);

popup.appendChild(buttonContainer2);

document.body.appendChild(popup);

document.getElementById('closePopup').addEventListener('click', () => {
    document.body.removeChild(popup);
});


            document.getElementById('payNow2').addEventListener('click', (event) => {
                const coverageDetails = document.getElementById('coverageDetails');
                const eventDetails = document.getElementById('eventDetails');
                coverageDetails.style.display = 'none';
                eventDetails.style.display = 'block';
                buttonContainer.style.display = 'flex';
                buttonContainer2.style.display = 'none';
            });

            document.getElementById('closePopup').addEventListener('click', () => {
                popup.remove();
                overlay.remove();
            });

            function validateForm() {
                const checkbox = document.getElementById('assurance').checked;
                const email = document.getElementById('emailInput').value.trim();
                const firstName = document.getElementById('firstNameInput').value.trim();
                const lastName = document.getElementById('lastNameInput').value.trim();

                return checkbox && email && firstName && lastName;
            }

            payButton.addEventListener('click', async (event) => {
                if (!validateForm()) {
                    alert('Veuillez remplir tous les champs et accepter les conditions générales et le document d\'information.');
                    return;
                }

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
                document.getElementById('payNow').style.backgroundColor = '#0079CA';
                document.getElementById('payNow').style.transform = 'scale(1.05)';
            });

            document.getElementById('payNow').addEventListener('mouseout', () => {
                document.getElementById('payNow').style.backgroundColor = '#0079CA';
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
