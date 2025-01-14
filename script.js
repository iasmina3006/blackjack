document.addEventListener("DOMContentLoaded", () => {
    const startGameButton = document.getElementById("start-game");
    const hitButton = document.getElementById("hit-button");
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

        hitButton.disabled = false;
    }

    function revealDealerHiddenCard() {
        dealerCardsContainer.innerHTML = "";
        dealerHand.forEach(card => displayCard(card, dealerCardsContainer));
        document.getElementById("dealer-points").textContent = calculatePoints(dealerHand);
    }

    function playDealer() {
        while (calculatePoints(dealerHand) < 17) {
            const card = drawRandomCard(deck);
            dealerHand.push(card);
        }

        revealDealerHiddenCard();
        checkGameResult();
    }

    function checkGameResult() {
        const playerPoints = calculatePoints(playerHand);
        const dealerPoints = calculatePoints(dealerHand);

        if (dealerPoints > 21 || playerPoints > dealerPoints) {
            alert("Du gewinnst!");
        } else if (playerPoints === dealerPoints) {
            alert("Unentschieden!");
        } else {
            alert("Dealer gewinnt!");
        }

        hitButton.disabled = true;
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

    startGameButton.addEventListener("click", startGame);
    hitButton.addEventListener("click", drawCard);
});
