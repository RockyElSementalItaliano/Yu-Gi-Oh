import { getTrainers } from './warriorService.js';

document.addEventListener('DOMContentLoaded', () => {
    const player1CardsContainer = document.getElementById('player1-cards');
    const player2CardsContainer = document.getElementById('player2-cards');
    const gameAreaBtn = document.getElementById('game-area');
    const finalizeBtn = document.getElementById('finalize-button');

    function createWarriorCard(warrior) {
        const card = document.createElement('div');
        card.classList.add('card-button');
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
            console.log('Jugador 1 - index:', index);
            const card = createWarriorCard(warrior);
            const containerDiv = document.createElement('div');
            containerDiv.classList.add('card-container');
            containerDiv.appendChild(card);
            const spaces = player1CardsContainer.querySelectorAll('.card-space');
            console.log('Jugador 1 - espacios:', spaces.length);
            const space = spaces[index];
            if (space) {
                space.appendChild(containerDiv);
                console.log('Carta añadida a espacio:', space);
            } else {
                console.warn('No se encontró espacio para la carta en índice:', index);
            }
        });

        // Renderizar cartas Jugador 2
        selectedCards[2].forEach((warrior, index) => {
            console.log('Jugador 2 - index:', index);
            const card = createWarriorCard(warrior);
            const containerDiv = document.createElement('div');
            containerDiv.classList.add('card-container');
            containerDiv.appendChild(card);
            const spaces = player2CardsContainer.querySelectorAll('.card-space');
            console.log('Jugador 2 - espacios:', spaces.length);
            const space = spaces[index];
            if (space) {
                space.appendChild(containerDiv);
                console.log('Carta añadida a espacio:', space);
            } else {
                console.warn('No se encontró espacio para la carta en índice:', index);
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

        // Obtener entrenadores seleccionados
        const selectedTrainersJSON = localStorage.getItem('selectedTrainers');
        let player1TrainerName = 'Jugador 1';
        let player2TrainerName = 'Jugador 2';

        if (selectedTrainersJSON) {
            const selectedTrainers = JSON.parse(selectedTrainersJSON);
            try {
                const trainers = await getTrainers();
                const trainer1 = trainers.find(t => t.id == selectedTrainers.player1);
                const trainer2 = trainers.find(t => t.id == selectedTrainers.player2);
                if (trainer1) player1TrainerName = trainer1.name;
                if (trainer2) player2TrainerName = trainer2.name;
            } catch (error) {
                console.error('Error al obtener entrenadores:', error);
            }
        }

        try {
            const response = await fetch('/game/fight/winner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player1Warriors, player2Warriors })
            });
            const data = await response.json();
            if (response.ok) {
                let message = `${player1TrainerName} total: ${data.player1Total}\n${player2TrainerName} total: ${data.player2Total}\n`;
                if (data.winner === 'player1') message += `¡Ganador: ${player1TrainerName}!`;
                else if (data.winner === 'player2') message += `¡Ganador: ${player2TrainerName}!`;
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
