document.addEventListener("DOMContentLoaded", () => {
    const startGameButton = document.getElementById("start-game");
    const cardContainer = document.getElementById("card-container");
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
    function displayCard(card,container) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card text-center p-3";
        cardDiv.innerHTML = `<span class="fs-1">${card}</span>`;
        cardContainer.appendChild(cardDiv);//Karte wird zum Container hinzugefügt
     }

     // Funktion: Spiel starten
     function startGame() {
        deck = createDeck(); // Neues Deck erstellen
        dealerCardsContainer.innerHTML = ""; // Dealer-Bereich leeren
        playerCardsContainer.innerHTML = ""; // Spieler-Bereich leeren
        console.log("Neues Deck erstellt:", deck);

         // Spieler erhält 2 Karten
         const playerHand = [drawRandomCard(deck), drawRandomCard(deck)];
         playerHand.forEach(card => displayCard(card, playerCardsContainer));
         const playerPoints = calculatePoints(playerHand);
         console.log(`Spieler Karten: ${playerHand}, Punkte: ${playerPoints}`);
         document.getElementById("player-points").textContent = playerPoints;
         const playerCardsContainer = document.getElementById("player-cards");

         // Dealer erhält 2 Karten (eine verdeckt)
         const dealerHand = [drawRandomCard(deck), drawRandomCard(deck)];
         displayCard(dealerHand[0], dealerCardsContainer); // Sichtbare Karte
         displayHiddenCard(dealerCardsContainer); // Verdeckte Karte
         const dealerPoints = calculatePoints([dealerHand[0]]); // Nur sichtbare Karte berechnen
         console.log(`Dealer Karten: ${dealerHand}, Sichtbare Punkte: ${dealerPoints}`);
         document.getElementById("dealer-points").textContent = dealerPoints;
         const dealerCardsContainer = document.getElementById("dealer-cards");

         // "Hit"-Button aktivieren
         hitButton.disabled = false;

     }

     // Funktion: Karte ziehen
     function drawCard() {
        const card = drawRandomCard(deck);
        if (card) {
            playerHand.push(card);
            displayCard(card, playerCardsContainer);

            const playerPoints = calculatePoints(playerHand);
            document.getElementById("player-points").textContent = playerPoints;

            console.log(`Gezogene Karte: ${card}`);
            console.log(`Spieler Punkte: ${playerPoints}`);
            console.log(`Verbleibende Karten im Deck: ${deck.length}`); // Deck-Länge prüfen

            if (playerPoints > 21) {
                alert("Bust! Du hast mehr als 21 Punkte.");
                hitButton.disabled = true; // Hit deaktivieren
        } else {
            alert("Keine Karten mehr im Deck!");
            hitButton.disabled = true;
        }
        }
     }

     // Event-Listener für Start-Button
     startGameButton.addEventListener("click", () => {
        startGame();
        drawCard(); // Erste Karte sofort nach dem Start ziehen
    });

     function calculatePoints(hand) {
        let points = 0;
        let aces = 0;
    
        hand.forEach(card => {
            const value = card.split(" ")[0]; // Erster Teil der Karte, z. B. "A", "2", "K"
            if (!isNaN(value)) {
                // Zahlenkarten (2–10)
                points += parseInt(value);
            } else if (["J", "Q", "K"].includes(value)) {
                // Bildkarten (J, Q, K)
                points += 10;
            } else if (value === "A") {
                // Ass
                aces += 1;
            }
        });
    
        // Aces behandeln: 1 oder 11 Punkte
        while (aces > 0) {
            if (points + 11 <= 21) {
                points += 11; // Ass zählt als 11
            } else {
                points += 1; // Ass zählt als 1
            }
            aces -= 1;
        }
    
        return points;
    }
    
});
