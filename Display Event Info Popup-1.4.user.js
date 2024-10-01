// ==UserScript==
// @name         Display Event Info Popup
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Affiche les informations de l'événement stockées dans le local storage dans une pop-up modifiable après avoir cliqué sur un bouton
// @author       Votre Nom
// @match        https://feverup.com/purchase/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Ajouter le script distant
    const script = document.createElement('script');
    script.src = 'https://igorpotard.github.io/display_event_info_popup.js?v=' + new Date().getTime(); //JPP c'est juste pour force l'actualisation
    script.type = 'module';
    document.head.appendChild(script);
})();