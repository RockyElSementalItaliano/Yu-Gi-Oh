import { getTrainers } from './warriorService.js';

async function fetchAttributes() {
    const [powersRes, spellsRes, typesRes] = await Promise.all([
        fetch('http://localhost:3000/game/powers'),
        fetch('http://localhost:3000/game/spells'),
        fetch('http://localhost:3000/game/typewarriors')
    ]);
    const [powers, spells, types] = await Promise.all([
        powersRes.json(),
        spellsRes.json(),
        typesRes.json()
    ]);
    return { powers, spells, types };
}

document.addEventListener('DOMContentLoaded', async () => {
    const player1CardsContainer = document.querySelector('#player1-cards.cards-container');
    const player2CardsContainer = document.querySelector('#player2-cards.cards-container');
    const gameAreaBtn = document.getElementById('game-area');
    const finalizeBtn = document.getElementById('finalize-button');

    const { powers, spells, types } = await fetchAttributes();

    function getAttributeNameById(attributes, id) {
        const attr = attributes.find(a => a.id === id);
        return attr ? attr.name : '';
    }

    function createWarriorCard(warrior, powerName, spellName, typeName) {
        const powerIcon = '⚡'; // icono genérico para power
        const spellIcon = '✨'; // icono genérico para spell
        const typeIcon = '🛡️'; // icono genérico para type warrior

        const card = document.createElement('div');
        card.classList.add('card-button');
        card.dataset.id = warrior.id;
        card.innerHTML = `
            <img src="../img/${warrior.image_url}" alt="${warrior.name}" class="card-image" />
            <h3 class="card-name">${warrior.name}</h3>
            <p class="card-attributes">
                ${powerIcon} ${powerName} &nbsp;&nbsp;
                ${spellIcon} ${spellName} &nbsp;&nbsp;
                ${typeIcon} ${typeName}
            </p>
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
        player1CardsContainer.innerHTML = '';
        player2CardsContainer.innerHTML = '';

        // Renderizar cartas Jugador 1
        selectedCards[1].forEach((warrior) => {
            const powerName = getAttributeNameById(powers, warrior.power_id);
            const spellName = getAttributeNameById(spells, warrior.spell_id);
            const typeName = getAttributeNameById(types, warrior.type_warrior_id);

            const card = createWarriorCard(warrior, powerName, spellName, typeName);
            player1CardsContainer.appendChild(card);
        });

        // Renderizar cartas Jugador 2
        selectedCards[2].forEach((warrior) => {
            const powerName = getAttributeNameById(powers, warrior.power_id);
            const spellName = getAttributeNameById(spells, warrior.spell_id);
            const typeName = getAttributeNameById(types, warrior.type_warrior_id);

            const card = createWarriorCard(warrior, powerName, spellName, typeName);
            player2CardsContainer.appendChild(card);
        });

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

        const selectedTrainersJSON = localStorage.getItem('selectedTrainers');
        let player1TrainerName = 'Jugador 1';
        let player2TrainerName = 'Jugador 2';
        let player1TrainerId = null;
        let player2TrainerId = null;

        if (selectedTrainersJSON) {
            const selectedTrainers = JSON.parse(selectedTrainersJSON);
            try {
                const trainers = await getTrainers();
                const trainer1 = trainers.find(t => t.id == selectedTrainers.player1);
                const trainer2 = trainers.find(t => t.id == selectedTrainers.player2);
                if (trainer1) {
                    player1TrainerName = trainer1.name;
                    player1TrainerId = trainer1.id;
                }
                if (trainer2) {
                    player2TrainerName = trainer2.name;
                    player2TrainerId = trainer2.id;
                }
            } catch (error) {
                console.error('Error al obtener entrenadores:', error);
            }
        }

        try {
            const response = await fetch('/game/fight/winner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player1Warriors, player2Warriors, player1TrainerId, player2TrainerId })
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
        gameAreaBtn.disabled = true;
        calculateWinner();
    });

    loadSelectedCards();
});
