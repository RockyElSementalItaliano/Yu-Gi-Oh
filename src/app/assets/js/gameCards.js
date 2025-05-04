document.addEventListener('DOMContentLoaded', () => {
    const player1CardsContainer = document.getElementById('player1-cards');
    const player2CardsContainer = document.getElementById('player2-cards');
    const gameAreaBtn = document.getElementById('game-area');
    const finalizeBtn = document.getElementById('finalize-button');

    function createWarriorCard(warrior) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = warrior.id;
        card.innerHTML = `
            <img src="../img/${warrior.image_url}" alt="${warrior.name}" class="card-image" />
            <h3 class="card-name">${warrior.name}</h3>
            <p class="card-description">${warrior.description}</p>
        `;
        return card;
    }

    function loadSelectedCards() {
        const selectedCardsJSON = localStorage.getItem('selectedCards');
        if (!selectedCardsJSON) {
            player1CardsContainer.innerHTML = '<p>No hay cartas seleccionadas para el Jugador 1.</p>';
            player2CardsContainer.innerHTML = '<p>No hay cartas seleccionadas para el Jugador 2.</p>';
            gameAreaBtn.disabled = true;
            finalizeBtn.disabled = true;
            return;
        }

        const selectedCards = JSON.parse(selectedCardsJSON);

        // Limpiar contenedores
        player1CardsContainer.querySelectorAll('.card-space').forEach(space => space.innerHTML = '');
        player2CardsContainer.querySelectorAll('.card-space').forEach(space => space.innerHTML = '');

        // Renderizar cartas Jugador 1
        selectedCards[1].forEach((warrior, index) => {
            const card = createWarriorCard(warrior);
            const space = player1CardsContainer.querySelectorAll('.card-space')[index];
            if (space) {
                space.appendChild(card);
            }
        });

        // Renderizar cartas Jugador 2
        selectedCards[2].forEach((warrior, index) => {
            const card = createWarriorCard(warrior);
            const space = player2CardsContainer.querySelectorAll('.card-space')[index];
            if (space) {
                space.appendChild(card);
            }
        });

        // Habilitar botón iniciar batalla si hay cartas
        gameAreaBtn.disabled = false;
        finalizeBtn.disabled = false;
    }

    async function calculateWinner() {
        const selectedCardsJSON = localStorage.getItem('selectedCards');
        if (!selectedCardsJSON) {
            alert('No hay cartas seleccionadas para calcular el ganador.');
            return;
        }
        const selectedCards = JSON.parse(selectedCardsJSON);

        const player1Warriors = selectedCards[1].map(w => w.id);
        const player2Warriors = selectedCards[2].map(w => w.id);

        try {
            const response = await fetch('/game/fight/winner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player1Warriors, player2Warriors })
            });
            const data = await response.json();
            if (response.ok) {
                let message = `Jugador 1 total: ${data.player1Total}\nJugador 2 total: ${data.player2Total}\n`;
                if (data.winner === 'player1') message += '¡Ganador: Jugador 1!';
                else if (data.winner === 'player2') message += '¡Ganador: Jugador 2!';
                else message += '¡Empate!';
                alert(message);
            } else {
                alert('Error al calcular el ganador: ' + data.error);
            }
        } catch (error) {
            alert('Error en la comunicación con el servidor: ' + error.message);
        }
    }

    gameAreaBtn.addEventListener('click', () => {
        calculateWinner();
    });

    loadSelectedCards();
});
