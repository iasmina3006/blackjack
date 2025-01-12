document.addEventListener("DOMContentLoaded", () => {
    // Referenzen für HTML-Elemente
    const startGameButton = document.getElementById("start-game");
    const playerCardsContainer = document.getElementById("player-cards");
    const dealerCardsContainer = document.getElementById("dealer-cards");

    let deck = []; // Kartendeck
    let playerHand = [];
    let dealerHand = [];

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
            return null;
        }
        const randomIndex = Math.floor(Math.random() * deck.length);
        return deck.splice(randomIndex, 1)[0];
    }

    // Funktion: Karte anzeigen
    function displayCard(card, container) {
        console.log("Display Card:", card, "Container:", container); // Debugging
        const cardDiv = document.createElement("div");
        cardDiv.className = "card text-center p-3";
        cardDiv.innerHTML = `<span class="fs-1">${card}</span>`;
        container.appendChild(cardDiv);
    }

    // Funktion: Punkte berechnen
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

    // Funktion: Spiel starten
    function startGame() {
        console.log("Spiel gestartet...");
        // Neues Deck erstellen und Bereiche leeren
        deck = createDeck();
        playerCardsContainer.innerHTML = "";
        dealerCardsContainer.innerHTML = "";

        console.log("Deck erstellt:", deck);

        // Spieler erhält 2 Karten
        playerHand = [drawRandomCard(deck), drawRandomCard(deck)];
        playerHand.forEach(card => displayCard(card, playerCardsContainer));
        const playerPoints = calculatePoints(playerHand);
        document.getElementById("player-points").textContent = playerPoints;

        // Dealer erhält 2 Karten (eine verdeckt)
        dealerHand = [drawRandomCard(deck), drawRandomCard(deck)];
        displayCard(dealerHand[0], dealerCardsContainer); // Sichtbare Karte
        const dealerPoints = calculatePoints([dealerHand[0]]);
        document.getElementById("dealer-points").textContent = dealerPoints;

        console.log("Spieler Karten:", playerHand, "Punkte:", playerPoints);
        console.log("Dealer Karten:", dealerHand, "Sichtbare Punkte:", dealerPoints);
    }

    // Event-Listener für Start-Button
    startGameButton.addEventListener("click", startGame);
});
