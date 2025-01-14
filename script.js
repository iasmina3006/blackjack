document.addEventListener("DOMContentLoaded", () => {
    const startGameButton = document.getElementById("start-game");
    const hitButton = document.getElementById("hit-button");
    const standButton = document.getElementById("stand-button");
    const playerCardsContainer = document.getElementById("player-cards");
    const dealerCardsContainer = document.getElementById("dealer-cards");

    let deck = [];
    let playerHand = [];
    let dealerHand = [];

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
        if (deck.length === 0) {
            console.log("Keine Karten mehr im Deck!");
            return null;
        }
        const randomIndex = Math.floor(Math.random() * deck.length);
        return deck.splice(randomIndex, 1)[0];
    }

    function displayCard(card, container) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card text-center p-3";
        cardDiv.innerHTML = `<span class="fs-1">${card}</span>`;
        container.appendChild(cardDiv);
    }

    function displayHiddenCard(container) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card text-center p-3 bg-secondary text-light";
        cardDiv.innerHTML = `<span class="fs-1">?</span>`;
        container.appendChild(cardDiv);
    }

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

        while (aces > 0) {
            if (points + 11 <= 21) {
                points += 11;
            } else {
                points += 1;
            }
            aces -= 1;
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

        dealerHand = [drawRandomCard(deck), drawRandomCard(deck)];
        displayCard(dealerHand[0], dealerCardsContainer);
        displayHiddenCard(dealerCardsContainer);
        document.getElementById("dealer-points").textContent = calculatePoints([dealerHand[0]]);

        hitButton.disabled = false;
        standButton.disabled = false;
    }

    function playDealer() {
        console.log("Dealer beginnt zu ziehen...");
        while (calculatePoints(dealerHand) < 17 || 
               (calculatePoints(dealerHand) === 17 && dealerHand.some(card => card.includes("A")))) {
            const card = drawRandomCard(deck);
            dealerHand.push(card);
            displayCard(card, dealerCardsContainer);
            console.log("Dealer zieht:", card);
        }

        // Verdeckte Karte aufdecken
        revealDealerHiddenCard();

        checkGameEnd();
    }

    function revealDealerHiddenCard() {
        dealerCardsContainer.innerHTML = ""; // Kartenbereich leeren
        dealerHand.forEach(card => displayCard(card, dealerCardsContainer));
        document.getElementById("dealer-points").textContent = calculatePoints(dealerHand);
    }

    function checkGameEnd() {
        const playerPoints = calculatePoints(playerHand);
        const dealerPoints = calculatePoints(dealerHand);

        if (dealerPoints > 21) {
            alert("Dealer hat über 21 Punkte! Du gewinnst!");
        } else if (playerPoints > dealerPoints) {
            alert("Du gewinnst! Deine Punkte sind näher an 21.");
        } else if (playerPoints < dealerPoints) {
            alert("Dealer gewinnt!");
        } else {
            alert("Unentschieden!");
        }

        hitButton.disabled = true;
        standButton.disabled = true;
        console.log("Spiel beendet.");
    }

    function drawCard() {
        const card = drawRandomCard(deck);
        if (card) {
            playerHand.push(card);
            displayCard(card, playerCardsContainer);

            const playerPoints = calculatePoints(playerHand);
            document.getElementById("player-points").textContent = playerPoints;

            if (playerPoints > 21) {
                alert("Bust! Du hast mehr als 21 Punkte.");
                hitButton.disabled = true;
                standButton.disabled = true;
                playDealer();
            }
        }
    }

    startGameButton.addEventListener("click", startGame);
    hitButton.addEventListener("click", drawCard);
    standButton.addEventListener("click", () => {
        hitButton.disabled = true;
        standButton.disabled = true;
        playDealer();
    });
});
