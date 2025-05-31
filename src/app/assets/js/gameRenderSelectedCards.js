import { WarriorService } from './warriorService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const warriorService = new WarriorService();

    const player1CardsContainer = document.querySelector('#player1-cards.cards-container');
    const player2CardsContainer = document.querySelector('#player2-cards.cards-container');
    const startBattleButton = document.getElementById('game-area');
    const finalizeButton = document.getElementById('finalize-button');

    // Función para crear el HTML de una carta warrior para mostrar en game.html
    function createWarriorCard(warrior) {
        const card = document.createElement('div');
        card.classList.add('card-button');
        card.dataset.id = warrior.id;
        const img = document.createElement('img');
        img.src = `../img/${warrior.image_url}`;
        img.alt = warrior.name;
        img.classList.add('ygo-card-image');
        card.appendChild(img);
        const name = document.createElement('h4');
        name.textContent = warrior.name;
        card.appendChild(name);
        return card;
    }

    // Función para renderizar las cartas seleccionadas de un jugador
    function renderSelectedCards(container, warriors) {
        container.innerHTML = '';
        warriors.forEach(warrior => {
            const card = createWarriorCard(warrior);
            container.appendChild(card);
        });
    }

    // Función para limpiar la selección guardada en localStorage
    function clearSavedSelection() {
        localStorage.removeItem('selectedCards');
        localStorage.removeItem('selectedTrainers');
    }

    // Cargar las cartas seleccionadas desde localStorage y mostrarlas
    async function loadSelectedCards() {
        const selectedCardsJSON = localStorage.getItem('selectedCards');
        if (!selectedCardsJSON) {
            alert('No se encontraron cartas seleccionadas. Por favor, selecciona las cartas primero.');
            return;
        }
        const selectedCards = JSON.parse(selectedCardsJSON);

        // Cargar todos los warriors para obtener detalles completos
        const allWarriors = await warriorService.getAllWarriors();

        // Mapear los ids de cartas seleccionadas a objetos completos
        const player1Warriors = selectedCards[1].map(card => allWarriors.find(w => w.id === card.id)).filter(Boolean);
        const player2Warriors = selectedCards[2].map(card => allWarriors.find(w => w.id === card.id)).filter(Boolean);

        renderSelectedCards(player1CardsContainer, player1Warriors);
        renderSelectedCards(player2CardsContainer, player2Warriors);

        // Habilitar botones si hay cartas
        if (player1Warriors.length === 5 && player2Warriors.length === 5) {
            startBattleButton.disabled = false;
            finalizeButton.disabled = false;
        }
    }

    // Añadir botón para reiniciar partida y limpiar selección guardada
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reiniciar Partida';
    resetButton.classList.add('btn-primary', 'mt-3');
    resetButton.addEventListener('click', () => {
        clearSavedSelection();
        window.location.href = 'select-warriors.html';
    });
    document.querySelector('.container').appendChild(resetButton);

    loadSelectedCards();
});
