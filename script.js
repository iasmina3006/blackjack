document.addEventListener("DOMContentLoaded", () => {
    const startGameButton = document.getElementById("start-game");
    const cardContainer = document.getElementById("card-container");
    let deck=[];//Kartendeck

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
    //Ziehen einer zufälligen Karte
    function drawRandomCard(deck) {
        if (deck.length === 0) {
            console.log("Keine Karten mehr im Deck!");
            return null;// gibt null zurück, wenn keine Karten mehr in Deck sind
        }
        const randomIndex = Math.floor(Math.random() * deck.length);
        const drawnCard = deck.splice(randomIndex, 1)[0];//Karte ziehen und aus Deck entfernen
        return drawnCard;// gezogene Karte zurückgeben
    }
    // Funktion: Karte anzeigen
    function displayCard(card) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card text-center p-3";
        cardDiv.innerHTML = `<span class="fs-1">${card}</span>`;
        cardContainer.appendChild(cardDiv);
    }
    //Spiel starten
    function startGame() {
        deck = createDeck(); // Neues Deck erstellen
        cardContainer.innerHTML = ""; // Kartenanzeige zurücksetzen
        console.log("Neues Deck erstellt:", deck);
    //Erste Karte ziehen und anzeigen
    drawCard();
}
 // Funktion: Karte ziehen
 function drawCard() {
    const card = drawRandomCard(deck);
    if (card) {
        displayCard(card);
    } else {
        alert("Keine Karten mehr im Deck!");
    }
}
    //Event-Listener für Start-Button	
        startGameButton.addEventListener("click", startGame);
    
});