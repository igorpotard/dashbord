if (!window.location.href.match(/#.*$/)) {
  (function() {
    'use strict';

    // Inclure le script Stripe
    const stripeScript = document.createElement('script');
    stripeScript.src = 'https://js.stripe.com/v3/';
    document.head.appendChild(stripeScript);

    stripeScript.onload = function() {
      function showPopup(eventInfo) {
        // Overlay qui noircit le fond
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '999';
        document.body.appendChild(overlay);

        // POPUP
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '15%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -10%)';
        popup.style.padding = '20px';
        popup.style.backgroundColor = '#F0EBFD';
        popup.style.borderRadius = '15px';
        popup.style.zIndex = '10000';
        popup.style.width = '550px';
        popup.style.maxHeight = '90%';
        popup.style.overflowY = 'auto';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        document.body.appendChild(popup);

        // Récupération du fichier html
        fetch('https://igorpotard.github.io/popup_protection.html?v='+ new Date().getTime())
          .then(response => response.text())
          .then(data => {
            popup.innerHTML = data;

            // Mise à jour des valeurs des input avec les eventInfo
            document.getElementById('nameInput').value = eventInfo.name || 'Non trouvé';
            document.getElementById('dateInput').value = eventInfo.date || 'Non trouvé';
            document.getElementById('dateInputend').value = eventInfo.date_end || 'Non trouvé';
            document.getElementById('placeInput').value = eventInfo.place || 'Non trouvé';
            document.getElementById('priceInput').value = ((eventInfo.finalPrice * 8 / 100).toFixed(2) || 'Non trouvé') + ' €';
            document.getElementById('emailInput').value = eventInfo.email || '';
            document.getElementById('firstNameInput').value = eventInfo.firstName || '';
            document.getElementById('lastNameInput').value = eventInfo.lastName || '';
            document.getElementById('imatriculation').value = eventInfo.imat || '';

            // Créer et ajouter le bouton payNow après le chargement du contenu
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-between';
            buttonContainer.style.alignItems = 'center';
            buttonContainer.style.marginTop = '20px';

            const payButton = document.createElement('button');
            payButton.id = 'payNow';
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
            payButton.textContent = 'M\'assurer pour ' + ((eventInfo.finalPrice * 8 / 100).toFixed(2) || 'Non trouvé') + '€';

            buttonContainer.appendChild(payButton);
            popup.appendChild(buttonContainer);

            // Variable d'état pour suivre le nombre de clics
            let isFirstClick = true;

            // Attacher les événements après avoir inséré le contenu et créé le bouton
            const closePopupButton = document.getElementById('closePopup');
            if (closePopupButton) {
              closePopupButton.addEventListener('click', () => {
                document.body.removeChild(popup);
                document.body.removeChild(overlay);
              });
            } else {
              console.error('closePopup button not found');
            }

            // Quand le bouton est pressé
            payButton.addEventListener('click', (event) => {
              const coverageDetails = document.getElementById('coverageDetails');
              const eventDetails = document.getElementById('eventDetails');

              // Si premier click masque les avantages et montre les input
              if (isFirstClick) {
                coverageDetails.style.display = 'none';
                eventDetails.style.display = 'block';
                payButton.textContent = 'Continuer';
                isFirstClick = false;
              } else {
                // Si 2ème click fait la vérif des champs et passe au paiement
                if (!validateForm()) {
                  alert('Veuillez remplir tous les champs et accepter les conditions générales et le document d\'information.');
                  return;
                }

                if (!validateImat()) {
                  alert('Veuillez remplir l\'immatriculation pour permettre d\'identifier le vehicule à assurer.');
                  return;
                }

                // Save les nouvelles infos
                const updatedEmail = document.getElementById('emailInput').value;
                const updatedFirstName = document.getElementById('firstNameInput').value;
                const updatedLastName = document.getElementById('lastNameInput').value;
                eventInfo.email = updatedEmail;
                eventInfo.firstName = updatedFirstName;
                eventInfo.lastName = updatedLastName;
                localStorage.setItem('eventInfo', JSON.stringify(eventInfo));

                // Envoie des infos au bubbleapps
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
                  // Vas au bubbleapps
                  window.location.href = data.response.link + "test/" + data.response.id;
                });
              }
            });

            // Charger et afficher le bouton Google Pay
            const googlePayScript = document.createElement('script');
            googlePayScript.src = 'https://pay.google.com/gp/p/js/pay.js';
            document.head.appendChild(googlePayScript);

            googlePayScript.onload = function() {
              const paymentsClient = new google.payments.api.PaymentsClient({environment: 'TEST'});
              const button = paymentsClient.createButton({onClick: onGooglePaymentButtonClicked});
              const container = document.getElementById('buttonContainer');
              if (container) {
                container.appendChild(button);
              } else {
                console.error('Google Pay container not found');
                // Optionnel : créer le conteneur s'il n'existe pas
                const newContainer = document.createElement('div');
                newContainer.id = 'googlePayContainer';
                document.body.appendChild(newContainer);
                newContainer.appendChild(button);
              }
            };

            function onGooglePaymentButtonClicked() {
              const paymentDataRequest = {
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [{
                  type: 'CARD',
                  parameters: {
                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                    allowedCardNetworks: ['MASTERCARD', 'VISA']
                  },
                  tokenizationSpecification: {
                    type: 'PAYMENT_GATEWAY',
                    parameters: {
                      gateway: 'example',
                      gatewayMerchantId: 'exampleGatewayMerchantId'
                    }
                  }
                }],
                merchantInfo: {
                  merchantId: '01234567890123456789',
                  merchantName: 'Example Merchant'
                },
                transactionInfo: {
                  totalPriceStatus: 'FINAL',
                  totalPrice: '1.00',
                  currencyCode: 'USD',
                  countryCode: 'US'
                }
              };

              const paymentsClient = new google.payments.api.PaymentsClient({environment: 'TEST'});
              paymentsClient.loadPaymentData(paymentDataRequest).then(function(paymentData) {
                // Gérer la réponse du paiement ici
                console.log(paymentData);
                document.getElementById('payment-result').innerText = 'Paiement réussi !';
              }).catch(function(err) {
                // Gérer les erreurs ici
                console.error(err);
                document.getElementById('payment-result').innerText = 'Échec du paiement.';
              });
            }
          })
          .catch(error => console.error('Erreur lors de la récupération du fichier:', error));
      }

      function validateForm() {
        const checkbox = document.getElementById('assurance').checked;
        const email = document.getElementById('emailInput').value.trim();
        const firstName = document.getElementById('firstNameInput').value.trim();
        const lastName = document.getElementById('lastNameInput').value.trim();
        return checkbox && email && firstName && lastName;
      }

      function validateImat() {
        const imat = document.getElementById('imatriculation').value.trim();
        return imat;
      }

      // Récup eventInfo = info du user + billet
      function loadEventInfo() {
        const eventInfo = JSON.parse(localStorage.getItem('eventInfo'));
        if (eventInfo) {
          showPopup(eventInfo);
        } else {
          console.log('Aucune information d\'événement trouvée dans le local storage');
        }
      }

      // Button pour show popup
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

      // Ajoute button on load
      window.addEventListener('load', () => {
        console.log('Page loaded');
        addButton();
      });
    };
  })()};
