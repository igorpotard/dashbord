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

						document.body.appendChild(popup);
						fetch('https://igorpotard.github.io/popup.html')
								.then(response => response.text())
								.then(data => {
										// Insérez le contenu récupéré dans la popup
										popup.innerHTML = data;
								})
								.catch(error => console.error('Erreur lors de la récupération du fichier:', error));
						popup.appendChild(buttonContainer);

						document.getElementById('closePopup').addEventListener('click', () => {
								document.body.removeChild(popup);
								document.body.removeChild(overlay);
						});

						document.getElementById('payNow').addEventListener('click', (event) => {
								const coverageDetails = document.getElementById('coverageDetails');
								const eventDetails = document.getElementById('eventDetails');
								if (payButton.textContent.includes('M\'assurer')) {
										coverageDetails.style.display = 'none';
										eventDetails.style.display = 'block';
										buttonContainer.style.display = 'flex';
										payButton.textContent = 'Continuer';
								} else {
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
										fetch('https://pg-ai.bubbleapps.io/version-test/api/1.1/wf/checkout', {
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
										})
												.then(response => response.json())
												.then(data => {
														console.log(data);
														window.location.href = data.response.link + "test/" + data.response.id;
												});
								}
						});

						payButton.addEventListener('mouseover', () => {
								payButton.style.backgroundColor = '#0079CA';
								payButton.style.transform = 'scale(1.05)';
						});

						payButton.addEventListener('mouseout', () => {
								payButton.style.backgroundColor = '#0079CA';
								payButton.style.transform = 'scale(1)';
						});

						function validateForm() {
								const checkbox = document.getElementById('assurance').checked;
								const email = document.getElementById('emailInput').value.trim();
								const firstName = document.getElementById('firstNameInput').value.trim();
								const lastName = document.getElementById('lastNameInput').value.trim();

								return checkbox && email && firstName && lastName;
						}

						// Initial setup for the button text
						payButton.textContent = 'M\'assurer pour ' + (eventInfo.finalPrice * 8 / 100 || 'Non trouvé') + '€';
						buttonContainer.style.display = 'block';


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
