document.addEventListener("DOMContentLoaded", () => {
    const startGameButton = document.getElementById("start-game");
    const hitButton = document.getElementById("hit-button");
    const dealerCardsContainer = document.getElementById("dealer-cards");
    const playerCardsContainer = document.getElementById("player-cards");
    let deck = []; // Kartendeck

    // Werte und Farben der Karten
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const suits = ["Herz", "Karo", "Pik", "Kreuz"];

    // Funktion: Erstellen eines vollständigen Kartendecks
    function createDeck() {
        const deck = [];
        suits.forEach((suit) => {
            values.forEach((value) => {
                deck.push(`${value} ${suit}`);
            });
        });
        return deck;
    }

    // Funktion: Ziehen einer zufälligen Karte
    function drawRandomCard(deck) {
        if (deck.length === 0) {
            console.log("Keine Karten mehr im Deck!");
            return null; // Gibt null zurück, wenn keine Karten mehr im Deck sind
        }
        const randomIndex = Math.floor(Math.random() * deck.length);
        const drawnCard = deck.splice(randomIndex, 1)[0]; // Karte ziehen und entfernen
        return drawnCard; // Gezogene Karte zurückgeben
    }

    // Funktion: Karte anzeigen
    function displayCard(card) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card text-center p-3";
        cardDiv.innerHTML = `<span class="fs-1">${card}</span>`;
        cardContainer.appendChild(cardDiv);
    }
     // Funktion: Verdeckte Karte anzeigen
     function displayHiddenCard(container) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card text-center p-3 bg-secondary text-light";
        cardDiv.innerHTML = `<span class="fs-1">?</span>`;
        container.appendChild(cardDiv);
    }
    // Funktion: Spiel starten
    function startGame() {
        deck = createDeck(); // Neues Deck erstellen
        dealerCardsContainer.innerHTML = "";
        playerCardsContainer.innerHTML = "";
        console.log("Neues Deck erstellt:", deck);
    
     // Spieler erhält 2 Karten
     const playerCard1 = drawRandomCard(deck);
     const playerCard2 = drawRandomCard(deck);
     displayCard(playerCard1, playerCardsContainer);
     displayCard(playerCard2, playerCardsContainer);
     console.log(`Spieler Karten: ${playerCard1}, ${playerCard2}`);

     // Dealer erhält 2 Karten (eine verdeckt)
     const dealerCard1 = drawRandomCard(deck);
     const dealerCard2 = drawRandomCard(deck);
     displayCard(dealerCard1, dealerCardsContainer); // Sichtbare Karte
     displayHiddenCard(dealerCardsContainer); // Verdeckte Karte
     console.log(`Dealer Karten: ${dealerCard1}, ${dealerCard2}`);

     // "Hit"-Button aktivieren
     hitButton.disabled = false;
     }

     // Funktion: Karte ziehen
     function drawCard() {
        const card = drawRandomCard(deck);
        if (card) {
            displayCard(card, playerCardsContainer);//Karte zum Spieler hinufügen
            console.log(`Gezogene Karte: ${card}`);
            console.log(`Verbleibende Karten im Deck: ${deck.length}`); // Deck-Länge prüfen
        } else {
            alert("Keine Karten mehr im Deck!");
            hitButton.disabled = true;
        }
    }

    // Event-Listener für Start-Button
    startGameButton.addEventListener("click", () => {
        startGame();
    });
       // Event-Listener für Hit-Button
    hitButton.addEventListener("click", () => {
        drawCard();
    });
});

