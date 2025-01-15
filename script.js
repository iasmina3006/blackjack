document.addEventListener("DOMContentLoaded", () => {
    const startGameButton = document.getElementById("start-game");
    const hitButton = document.getElementById("hit-button");
    const playerCardsContainer = document.getElementById("player-cards");
    const dealerCardsContainer = document.getElementById("dealer-cards");

    let deck = [];
    let playerHand = [];
    let dealerHand = [];
    let dealerHiddenCard = null; // Verdeckte Karte des Dealers

    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const suits = ["Herz", "Karo", "Pik", "Kreuz"];

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

        hand.forEach(card => {
            const value = card.split(" ")[0];
            if (!isNaN(value)) {
                points += parseInt(value);//Zahlenkarten
            } else if (["J", "Q", "K"].includes(value)) {
                points += 10;//Bildkarten
            } else if (value === "A") {
                aces += 1;//Zählt Asse separat
            }
        });

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
        deck = createDeck();
        playerCardsContainer.innerHTML = "";
        dealerCardsContainer.innerHTML = "";

        playerHand = [drawRandomCard(deck), drawRandomCard(deck)];
        playerHand.forEach(card => displayCard(card, playerCardsContainer));
        document.getElementById("player-points").textContent = calculatePoints(playerHand);

        dealerHand = [drawRandomCard(deck)];
        dealerHiddenCard = drawRandomCard(deck); // Eine Karte verdeckt
        displayCard(dealerHand[0], dealerCardsContainer);
        displayHiddenCard(dealerCardsContainer);
        document.getElementById("dealer-points").textContent = calculatePoints(dealerHand);

        hitButton.disabled = false;
        standButton.disabled = false;
    }

    function revealDealerHiddenCard() {
        dealerHand.push(dealerHiddenCard); // Verdeckte Karte zum Dealer-Hand hinzufügen
        dealerCardsContainer.innerHTML = "";
        dealerHand.forEach(card => displayCard(card, dealerCardsContainer));
        document.getElementById("dealer-points").textContent = calculatePoints(dealerHand);
    }

    function playDealer() {
        revealDealerHiddenCard(); // Verdeckte Karte aufdecken

        while (calculatePoints(dealerHand) < 17) {
            const card = drawRandomCard(deck);
            dealerHand.push(card);
            displayCard(card, dealerCardsContainer);
        }

        checkGameResult();
    }

    function checkGameResult() {
        const playerPoints = calculatePoints(playerHand);
        const dealerPoints = calculatePoints(dealerHand);

        if (playerPoints > 21) {
            alert("Bust! Du hast verloren.");
        } else if (dealerPoints > 21) {
            alert("Dealer hat über 21 Punkte! Du gewinnst!");
        } else if (playerPoints > dealerPoints) {
            alert("Du gewinnst!");
        } else if (playerPoints < dealerPoints) {
            alert("Dealer gewinnt!");
        } else {
            alert("Unentschieden!");
        }

        hitButton.disabled = true;
        standButton.disabled = true;
    }

    function drawCard() {
        const card = drawRandomCard(deck);
        playerHand.push(card);
        displayCard(card, playerCardsContainer);

        const playerPoints = calculatePoints(playerHand);
        document.getElementById("player-points").textContent = playerPoints;

        if (playerPoints > 21) {
            alert("Bust! Du hast verloren.");
            hitButton.disabled = true;
            playDealer();
        }
    }

    // Button für "Stand" hinzufügen
    const standButton = document.createElement("button");
    standButton.id = "stand-button";
    standButton.className = "btn btn-primary btn-lg mt-3";
    standButton.textContent = "Stand";
    standButton.disabled = true; // Stand ist am Anfang deaktiviert
    standButton.addEventListener("click", () => {
        hitButton.disabled = true;
        standButton.disabled = true;
        playDealer();
    });
    startGameButton.insertAdjacentElement("afterend", standButton);

    startGameButton.addEventListener("click", () => {
        startGame();
        standButton.disabled = false; // Stand wird aktiviert, wenn das Spiel startet
    });
    hitButton.addEventListener("click", drawCard);
});
