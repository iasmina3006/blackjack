document.addEventListener("DOMContentLoaded", () => {
    const startGameButton = document.getElementById("start-game");
    const cardContainer = document.getElementById("card-container");
     //Werte und Farben der Karten
     const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
     const suits = ["Herz", "Karo", "Pik", "Kreuz"];

     //zum Erstellen eines vollständigen Kartendecks
     function createDeck() {
        const deck = [];
        suits.forEach((suit) => {
            values.forEach((value) => {
                deck.push(`${value} ${suit}`);
            });
        });
        return deck;
    }
    // Deck erstellen und ausgeben 
    let deck = createDeck();
    console.log("Deck erstellt:", deck);

    function startGame() {
        cardContainer.innerHTML = "";
    
    //Ziehen einer zufälligen Karte
    function drawRandomCard(deck) {
        if (deck.length === 0) {
            console.log("Keine Karten mehr im Deck!");
            return null;
        }
        const randomIndex = Math.floor(Math.random() * deck.length);
        const drawnCard = deck.splice(randomIndex, 1)[0];
        return drawnCard;
    }

    //Karte ziehen
    let card = drawRandomCard(deck);
    console.log("Gezogene Karte:", card);
    console.log("Verbleibende Karten im Deck:", deck.length);

        //Beispielkarten
        const cards = ["A", "K"];
        cards.forEach((card) => {
            const cardDiv = document.createElement("div");
            cardDiv.className = "col-6 col-md-3";
            cardDiv.innerHTML = `
                <div class="card text-center p-3">
                    <span class="fs-1">${card}</span>
                </div>
            `;
            cardContainer.appendChild(cardDiv);
        });
        console.log("Spiel gestartet: Karten wurden hinzugefügt.");
    }
        startGameButton.addEventListener("click", startGame);
    
});