document.addEventListener("DOMContentLoaded", () => {
    const startGameButton = document.getElementById("start-game");
    const hitButton = document.getElementById("hit-button");
    const playerCardsContainer = document.getElementById("player-cards");
    const dealerCardsContainer = document.getElementById("dealer-cards");

    // Chips-System Variablen
    let chips = 1000; // Startguthaben
    let bet = 100; // Standard-Einsatz

    let deck = [];
    let playerHand = [];
    let dealerHand = [];
    let dealerHiddenCard = null; // Verdeckte Karte des Dealers

    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const suits = ["Herz", "Karo", "Pik", "Kreuz"];

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

    function updateChipsDisplay() {
        chipsDisplay.textContent = `Chips: ${chips}`;
        betDisplay.textContent = `Einsatz: ${bet}`;
    }

    function createDeck() {
        const deck = [];
        suits.forEach((suit) => {
            values.forEach((value) => {
                deck.push(`${value} ${suit}`);
            });
        });
        return deck;
    }

    function drawRandomCard(deck) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        return deck.splice(randomIndex, 1)[0];
    }

    function displayCard(card, container) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card text-center p-3";
        cardDiv.innerHTML = `<span>${card}</span>`;
        container.appendChild(cardDiv);
    }

    function displayHiddenCard(container) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card text-center p-3 bg-secondary text-light";
        cardDiv.innerHTML = `<span>?</span>`;
        container.appendChild(cardDiv);
    }

    function calculatePoints(hand) {
        let points = 0;
        let aces = 0;
    
        // Punkte berechnen
        hand.forEach(card => {
            const value = card.split(" ")[0];
            if (!isNaN(value)) {
                points += parseInt(value); // Zahlenkarten
            } else if (["J", "Q", "K"].includes(value)) {
                points += 10; // Bildkarten
            } else if (value === "A") {
                aces += 1; // Ass
            }
        });
    
        // Dynamische Bewertung von Assen
        for (let i = 0; i < aces; i++) {
            if (points + 11 <= 21) {
                points += 11; // Ass als 11 zählen
            } else {
                points += 1; // Ass als 1 zählen
            }
        }
    
        return points;
    }
    

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
        doubleDownButton.disabled = false; // Double Down aktivieren
    }

    function revealDealerHiddenCard() {
        dealerHand.push(dealerHiddenCard); // Verdeckte Karte zur Hand hinzufügen
        dealerHiddenCard = null; // Verdeckte Karte entfernen
        dealerCardsContainer.innerHTML = ""; // Kartenanzeige leeren
    
        // Alle Karten des Dealers anzeigen
        dealerHand.forEach(card => displayCard(card, dealerCardsContainer));
    
        // Punkte aktualisieren
        const dealerPoints = calculatePoints(dealerHand);
        document.getElementById("dealer-points").textContent = dealerPoints;
    }
    

    function playDealer() {
        revealDealerHiddenCard(); // Verdeckte Karte aufdecken
    
        // Dealer zieht Karten, bis er mindestens 17 Punkte hat
        while (calculatePoints(dealerHand) < 17) {
            const card = drawRandomCard(deck);
            dealerHand.push(card); // Neue Karte zur Hand hinzufügen
            displayCard(card, dealerCardsContainer); // Karte anzeigen
    
            // Punkte des Dealers aktualisieren
            const dealerPoints = calculatePoints(dealerHand);
            document.getElementById("dealer-points").textContent = dealerPoints;
    
            // Schleife beenden, wenn Dealer über 21 Punkte hat
            if (dealerPoints > 21) {
                break;
            }
        }
    
        checkGameResult(); // Ergebnis überprüfen
    }
    

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
            return;
        }

        const keepBet = confirm("Möchtest du den aktuellen Einsatz beibehalten? (OK: Beibehalten, Abbrechen: Zurücksetzen auf 100)");
        if (!keepBet) {
            bet = 100;
        }
        updateChipsDisplay();
    }

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

    const doubleDownButton = document.createElement("button");
    doubleDownButton.id = "double-down-button";
    doubleDownButton.className = "btn btn-success btn-lg mt-3";
    doubleDownButton.textContent = "Double";
    doubleDownButton.disabled = true;
    startGameButton.insertAdjacentElement("afterend", doubleDownButton);

    doubleDownButton.addEventListener("click", () => {
        if (chips < bet * 2) {
            alert("Nicht genug Chips, um den Einsatz zu verdoppeln!");
            return;
        }

        chips -= bet; // Einsatz verdoppeln
        bet *= 2;
        updateChipsDisplay();

        const card = drawRandomCard(deck);
        playerHand.push(card);
        displayCard(card, playerCardsContainer);

        const playerPoints = calculatePoints(playerHand);
        document.getElementById("player-points").textContent = playerPoints;

        if (playerPoints > 21) {
            setTimeout(() => {
                alert("Bust! Du hast verloren.");
                hitButton.disabled = true;
                doubleDownButton.disabled = true;
                standButton.disabled = true;
                playDealer();
            }, 500);
            return;
        }

        hitButton.disabled = true;
        doubleDownButton.disabled = true;
        standButton.disabled = true;
        playDealer();
    });

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

    startGameButton.addEventListener("click", () => {
        startGame();
        standButton.disabled = false;
    });

    hitButton.addEventListener("click", drawCard);
});
