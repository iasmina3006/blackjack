document.addEventListener("DOMContentLoaded", () => {
    // HTML-Elemente referenzieren
    const startGameButton = document.getElementById("start-game");
    const hitButton = document.getElementById("hit-button");
    const playerCardsContainer = document.getElementById("player-cards");
    const dealerCardsContainer = document.getElementById("dealer-cards");

    // Chips-System Variablen
    let chips = 1000; // Startguthaben
    let bet = 100; // Standard-Einsatz

    // Spiel-Logik Variablen
    let deck = [];
    let playerHand = [];
    let dealerHand = [];
    let dealerHiddenCard = null; // Verdeckte Karte des Dealers

    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const suits = ["Herz", "Karo", "Pik", "Kreuz"];

    // Chips- und Einsatzanzeige erstellen
    const chipsDisplay = document.createElement("div");
    chipsDisplay.id = "chips-display";
    chipsDisplay.className = "mt-3";
    chipsDisplay.textContent = `Chips: ${chips}`;
    document.body.insertBefore(chipsDisplay, document.body.firstChild);

    const betDisplay = document.createElement("div");
    betDisplay.id = "bet-display";
    betDisplay.className = "mt-3";
    betDisplay.textContent = `Einsatz: ${bet}`;
    document.body.insertBefore(betDisplay, document.body.firstChild);

    // Funktion zur Aktualisierung der Chips-Anzeige
    function updateChipsDisplay() {
        chipsDisplay.textContent = `Chips: ${chips}`;
        betDisplay.textContent = `Einsatz: ${bet}`;
    }

    // Deck erstellen
    function createDeck() {
        const deck = [];
        suits.forEach((suit) => {
            values.forEach((value) => {
                deck.push(`${value} ${suit}`);
            });
        });
        return deck;
    }

    // Eine zufällige Karte ziehen
    function drawRandomCard(deck) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        return deck.splice(randomIndex, 1)[0];
    }

    // Karte im Container anzeigen
    function displayCard(card, container) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card text-center p-3";
        cardDiv.innerHTML = `<span>${card}</span>`;
        container.appendChild(cardDiv);
    }

    // Verdeckte Karte anzeigen
    function displayHiddenCard(container) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card text-center p-3 bg-secondary text-light";
        cardDiv.innerHTML = `<span>?</span>`;
        container.appendChild(cardDiv);
    }

    // Punkte berechnen
    function calculatePoints(hand) {
        let points = 0;
        let aces = 0;

        hand.forEach(card => {
            const value = card.split(" ")[0];
            if (!isNaN(value)) {
                points += parseInt(value);
            } else if (["J", "Q", "K"].includes(value)) {
                points += 10;
            } else if (value === "A") {
                aces += 1;
            }
        });

        for (let i = 0; i < aces; i++) {
            if (points + 11 <= 21) {
                points += 11;
            } else {
                points += 1;
            }
        }

        return points;
    }

    // Spiel starten
    function startGame() {
        if (chips < bet) {
            alert("Nicht genug Chips für diesen Einsatz!");
            return;
        }

        chips -= bet; // Einsatz abziehen
        updateChipsDisplay();

        deck = createDeck();
        playerCardsContainer.innerHTML = "";
        dealerCardsContainer.innerHTML = "";

        playerHand = [drawRandomCard(deck), drawRandomCard(deck)];
        playerHand.forEach(card => displayCard(card, playerCardsContainer));
        document.getElementById("player-points").textContent = calculatePoints(playerHand);

        dealerHand = [drawRandomCard(deck)];
        dealerHiddenCard = drawRandomCard(deck);
        displayCard(dealerHand[0], dealerCardsContainer);
        displayHiddenCard(dealerCardsContainer);
        document.getElementById("dealer-points").textContent = calculatePoints(dealerHand);

        hitButton.disabled = false;
        standButton.disabled = false;
    }

    // Verdeckte Karte des Dealers aufdecken
    function revealDealerHiddenCard() {
        dealerHand.push(dealerHiddenCard);
        dealerHiddenCard = null;
        dealerCardsContainer.innerHTML = "";
        dealerHand.forEach(card => displayCard(card, dealerCardsContainer));
        document.getElementById("dealer-points").textContent = calculatePoints(dealerHand);
    }

    // Dealer spielt
    function playDealer() {
        revealDealerHiddenCard();

        while (calculatePoints(dealerHand) < 17) {
            const card = drawRandomCard(deck);
            dealerHand.push(card);
            displayCard(card, dealerCardsContainer);
        }

        checkGameResult();
    }

    // Ergebnis prüfen
    function checkGameResult() {
        const playerPoints = calculatePoints(playerHand);
        const dealerPoints = calculatePoints(dealerHand);

        if (playerPoints > 21) {
            alert("Bust! Du hast verloren.");
        } else if (dealerPoints > 21) {
            alert("Dealer hat über 21 Punkte! Du gewinnst!");
            chips += bet * 2;
        } else if (playerPoints > dealerPoints) {
            alert("Du gewinnst!");
            chips += bet * 2;
        } else if (playerPoints === dealerPoints) {
            alert("Unentschieden! Einsatz zurück.");
            chips += bet;
        } else {
            alert("Dealer gewinnt!");
        }

        updateChipsDisplay();

        if (chips < 100) {
            alert("Du hast keine Chips mehr! Spiel zurückgesetzt.");
            chips = 1000;
            bet = 100;
            updateChipsDisplay();
        }
    }

    // Spieler zieht eine Karte
    function drawCard() {
        const card = drawRandomCard(deck);
        playerHand.push(card);
        displayCard(card, playerCardsContainer);

        const playerPoints = calculatePoints(playerHand);
        document.getElementById("player-points").textContent = playerPoints;

        if (playerPoints > 21) {
            setTimeout(() => {
                alert("Bust! Du hast verloren.");
                hitButton.disabled = true;
                playDealer();
            }, 500);
        }
    }

    // "Stand"-Button hinzufügen
    const standButton = document.createElement("button");
    standButton.id = "stand-button";
    standButton.className = "btn btn-primary btn-lg mt-3";
    standButton.textContent = "Stand";
    standButton.disabled = true;
    standButton.addEventListener("click", () => {
        hitButton.disabled = true;
        standButton.disabled = true;
        playDealer();
    });
    startGameButton.insertAdjacentElement("afterend", standButton);

    // Event-Listener für Buttons
    startGameButton.addEventListener("click", () => {
        startGame();
        standButton.disabled = false;
    });
    hitButton.addEventListener("click", drawCard);
});
