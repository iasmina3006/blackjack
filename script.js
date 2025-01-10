document.addEventListener("DOMContentLoaded", () => {
    const startGameButton = document.getElementById("start-game");
    const cardContainer = document.getElementById("card-container");

    function startGame() {
        cardContainer.innerHTML = "";
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
        startGameButton.addEventListener("click", startGame);

});