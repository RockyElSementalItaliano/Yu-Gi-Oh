import { getTrainers } from '../js/warriorService.js';

async function populateTrainerSelects() {
    const trainers = await getTrainers();
    const player1Select = document.getElementById('player1-trainers');
    const player2Select = document.getElementById('player2-trainers');

    // Limpiar selects antes de poblar
    player1Select.innerHTML = '';
    player2Select.innerHTML = '';

    // Opción por defecto
    const defaultOption1 = document.createElement('option');
    defaultOption1.value = '';
    defaultOption1.textContent = 'Seleccione un Duelista';
    defaultOption1.selected = true;
    defaultOption1.disabled = true;
    player1Select.appendChild(defaultOption1);

    const defaultOption2 = document.createElement('option');
    defaultOption2.value = '';
    defaultOption2.textContent = 'Seleccione un Duelista';
    defaultOption2.selected = true;
    defaultOption2.disabled = true;
    player2Select.appendChild(defaultOption2);

    trainers.forEach(trainer => {
        const option1 = document.createElement('option');
        option1.value = trainer.id;
        option1.textContent = trainer.name;
        player1Select.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = trainer.id;
        option2.textContent = trainer.name;
        player2Select.appendChild(option2);
    });
}

function formatTrainerNameToImageFile(name) {
    return `${encodeURIComponent(name)}.jpg`;
}

function updateTrainerImage(selectElement, imageElementId) {
    const selectedOptions = Array.from(selectElement.selectedOptions);
    const imageElement = document.getElementById(imageElementId);
    if (selectedOptions.length === 1 && selectedOptions[0].value !== '') {
        const selectedTrainerId = selectedOptions[0].value;
        getTrainers().then(trainers => {
            const trainer = trainers.find(t => t.id == selectedTrainerId);
            if (trainer && trainer.name) {
                const imageFileName = formatTrainerNameToImageFile(trainer.name);
                imageElement.style.backgroundImage = `url(/img/${imageFileName})`;
            } else {
                imageElement.style.backgroundImage = '';
            }
        });
    } else {
        imageElement.style.backgroundImage = '';
    }
}

function disableSelectedTrainerInOtherSelect(changedSelect, otherSelect) {
    const selectedValue = changedSelect.value;
    Array.from(otherSelect.options).forEach(option => {
        if (option.value === selectedValue && selectedValue !== '') {
            option.disabled = true;
        } else {
            option.disabled = false;
        }
    });
}

const player1Select = document.getElementById('player1-trainers');
const player2Select = document.getElementById('player2-trainers');

player1Select.addEventListener('change', function () {
    updateTrainerImage(this, 'player1-trainer-image');
    disableSelectedTrainerInOtherSelect(this, player2Select);
});

player2Select.addEventListener('change', function () {
    updateTrainerImage(this, 'player2-trainer-image');
    disableSelectedTrainerInOtherSelect(this, player1Select);
});

populateTrainerSelects();
