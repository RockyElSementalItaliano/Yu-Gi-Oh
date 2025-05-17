document.addEventListener('DOMContentLoaded', async () => {
    const rankingTableBody = document.querySelector('#ranking-table tbody');
    const totalWinsElem = document.getElementById('total-wins');
    const totalDrawsElem = document.getElementById('total-draws');
    const totalLossesElem = document.getElementById('total-losses');

    try {
        const response = await fetch('/game/ranking'); // Cambiada la ruta para que coincida con el backend
        if (!response.ok) {
            throw new Error('Error al obtener el ranking');
        }
        const rankingData = await response.json();

        // Limpiar tabla
        rankingTableBody.innerHTML = '';

        let totalWins = 0;
        let totalDraws = 0;
        let totalLosses = 0;

        rankingData.forEach((entry, index) => {
            totalWins += entry.wins;
            totalDraws += entry.draws;
            totalLosses += entry.losses;

            const row = document.createElement('tr');

            // Enumeración
            const rankCell = document.createElement('td');
            rankCell.textContent = index + 1;
            row.appendChild(rankCell);

            // Nombre del entrenador (trainer_name)
            const nameCell = document.createElement('td');
            nameCell.textContent = entry.trainer_name || 'Desconocido';
            row.appendChild(nameCell);

            // Victorias
            const winsCell = document.createElement('td');
            winsCell.textContent = entry.wins;
            row.appendChild(winsCell);

            // Empates
            const drawsCell = document.createElement('td');
            drawsCell.textContent = entry.draws;
            row.appendChild(drawsCell);

            // Derrotas
            const lossesCell = document.createElement('td');
            lossesCell.textContent = entry.losses;
            row.appendChild(lossesCell);

            rankingTableBody.appendChild(row);
        });

        // Mostrar totales
        totalWinsElem.textContent = totalWins;
        totalDrawsElem.textContent = totalDraws;
        totalLossesElem.textContent = totalLosses;

    } catch (error) {
        console.error('Error cargando el ranking:', error);
    }
});
