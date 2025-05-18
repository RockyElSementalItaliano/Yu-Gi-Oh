import { getTrainers } from './warriorService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const selectedTrainers = JSON.parse(localStorage.getItem('selectedTrainers'));
    if (!selectedTrainers) return;

    const trainers = await getTrainers();

    function displayTrainerInfo(playerPrefix, trainerId) {
        const trainer = trainers.find(t => t.id == trainerId);
        if (!trainer) return;

        const nameElement = document.getElementById(`${playerPrefix}-trainer-name`);
        const imageElement = document.getElementById(`${playerPrefix}-trainer-image`);

        if (nameElement) {
            nameElement.textContent = trainer.name;
        }
        if (imageElement) {
            // Usar la ruta de imagen almacenada en el objeto trainer
            if (trainer.image) {
                imageElement.style.backgroundImage = `url(${trainer.image})`;
            } else {
                // Fallback a nombre basado en el nombre del entrenador
                const imageFileName = encodeURIComponent(trainer.name) + '.jpg';
                imageElement.style.backgroundImage = `url(/img/${imageFileName})`;
            }
        }
    }

    if (selectedTrainers.player1) {
        displayTrainerInfo('player1', selectedTrainers.player1);
    }
    if (selectedTrainers.player2) {
        displayTrainerInfo('player2', selectedTrainers.player2);
    }
});
