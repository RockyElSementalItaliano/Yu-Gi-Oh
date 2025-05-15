import { WarriorService } from './warriorService.js';

document.addEventListener('DOMContentLoaded', () => {
    const warriorService = new WarriorService();
    const warriorsContainer = document.getElementById('warriors-container');

    const player1CardsContainer = document.getElementById('player1-cards');
    const player2CardsContainer = document.getElementById('player2-cards');
    const startPlayer1Btn = document.getElementById('start-player1');
    const startPlayer2Btn = document.getElementById('start-player2');
    const resetSelectionBtn = document.getElementById('reset-selection');
    const battleLink = document.querySelector('a[href="game.html"]');

    const player1TrainerSelect = document.getElementById('player1-trainers');
    const player2TrainerSelect = document.getElementById('player2-trainers');

    if (battleLink) {
        battleLink.addEventListener('click', (e) => {
            const player1TrainerName = player1TrainerSelect.options[player1TrainerSelect.selectedIndex]?.text || 'Jugador 1';
            const player2TrainerName = player2TrainerSelect.options[player2TrainerSelect.selectedIndex]?.text || 'Jugador 2';

            if (selectedCards[1].length !== 5 || selectedCards[2].length !== 5) {
                e.preventDefault();
                alert(`Ambos jugadores deben seleccionar 5 cartas para comenzar la batalla.`);
                return;
            }
            if (!player1TrainerSelect.value || !player2TrainerSelect.value) {
                e.preventDefault();
                alert(`Ambos jugadores deben seleccionar un entrenador para comenzar la batalla.`);
                return;
            }
            localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
            localStorage.setItem('selectedTrainers', JSON.stringify({
                player1: player1TrainerSelect.value,
                player2: player2TrainerSelect.value
            }));
        });
    }

    let selectedPlayer = 1; // Jugador que está seleccionando (1 o 2)
    let selectedCards = {
        1: [],
        2: []
    };

    // Función para crear el botón de una carta warrior
    function createWarriorButton(warrior) {
        const button = document.createElement('button');
        button.classList.add('card-button');
        button.dataset.id = warrior.id;
        button.innerHTML = `
            <img src="../img/${warrior.image_url}" alt="${warrior.name}" class="card-image" />
            <h3 class="card-name">${warrior.name}</h3>
            <p class="card-description">${warrior.description}</p>
        `;
        return button;
    }

    // Función para crear el HTML de una carta warrior para la casilla seleccionada
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

    // Función para actualizar la visualización de cartas seleccionadas en las casillas de jugadores
    function updateSelectedCardsDisplay() {
        // Limpiar contenedores
        player1CardsContainer.querySelectorAll('.card-space').forEach((space, index) => {
            space.innerHTML = '';
            if (selectedCards[1][index]) {
                const warrior = selectedCards[1][index];
                const card = createWarriorCard(warrior);
                card.classList.add('selected-card');
                space.appendChild(card);
            }
        });
        player2CardsContainer.querySelectorAll('.card-space').forEach((space, index) => {
            space.innerHTML = '';
            if (selectedCards[2][index]) {
                const warrior = selectedCards[2][index];
                const card = createWarriorCard(warrior);
                card.classList.add('selected-card');
                space.appendChild(card);
            }
        });
    }

    // Función para manejar la selección de una carta
    function handleCardClick(event) {
        const button = event.currentTarget;
        const warriorId = parseInt(button.dataset.id);
        const warrior = allWarriors.find(w => w.id === warriorId);
        if (!warrior) return;

        // Verificar si la carta ya está seleccionada por cualquier jugador
        const isSelectedByAnyPlayer = Object.values(selectedCards).some(playerCards =>
            playerCards.some(w => w.id === warriorId)
        );
        if (isSelectedByAnyPlayer) {
            // No permitir seleccionar la carta si ya está seleccionada por otro jugador
            return;
        }

        const playerCards = selectedCards[selectedPlayer];

        // Seleccionar carta si no se ha alcanzado el límite de 5
        if (playerCards.length < 5) {
            playerCards.push(warrior);
            // Remover el botón de la carta seleccionada del contenedor principal
            button.remove();
        } else {
            alert(`Ya has seleccionado 5 cartas para el Jugador ${selectedPlayer}`);
        }

        updateSelectedCardsDisplay();
        updateButtonsState();
    }

    // Función para actualizar el estado de los botones
    function updateButtonsState() {
        startPlayer1Btn.disabled = selectedCards[1].length !== 5;
        startPlayer2Btn.disabled = selectedCards[2].length !== 5;
    }

    // Función para resetear la selección
    function resetSelection() {
        selectedCards = {1: [], 2: []};
        selectedPlayer = 1;
        updateSelectedCardsDisplay();
        updateButtonsState();
        // Limpiar y recargar las cartas en el contenedor principal
        warriorsContainer.innerHTML = '';
        allWarriors.forEach(warrior => {
            const button = createWarriorButton(warrior);
            button.addEventListener('click', handleCardClick);
            warriorsContainer.appendChild(button);
        });
        startPlayer2Btn.disabled = true;
        startPlayer1Btn.disabled = false;
    }

    // Variable para almacenar todas las cartas cargadas
    let allWarriors = [];

    // Cargar y mostrar las cartas warriors como botones
    async function loadWarriors() {
        try {
            allWarriors = await warriorService.getAllWarriors();
            warriorsContainer.innerHTML = ''; // Limpiar contenedor
            allWarriors.forEach(warrior => {
                const button = createWarriorButton(warrior);
                button.addEventListener('click', handleCardClick);
                warriorsContainer.appendChild(button);
            });
            resetSelection();
        } catch (error) {
            warriorsContainer.innerHTML = '<p>Error al cargar las cartas warriors.</p>';
            console.error('Error al cargar warriors:', error);
        }
    }

    // Eventos para botones
    startPlayer1Btn.addEventListener('click', () => {
        if (selectedCards[1].length === 5) {
            selectedPlayer = 2;
            startPlayer1Btn.disabled = true;
            startPlayer2Btn.disabled = false;
        }
    });

    startPlayer2Btn.addEventListener('click', () => {
        if (selectedCards[2].length === 5) {
            startPlayer2Btn.disabled = true;
        }
    });

    resetSelectionBtn.addEventListener('click', () => {
        resetSelection();
    });

    loadWarriors();
});
