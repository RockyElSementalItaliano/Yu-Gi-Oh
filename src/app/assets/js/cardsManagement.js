document.addEventListener('DOMContentLoaded', () => {
    // Cargar opciones para formulario de creación
    loadOptions('/game/races', 'race_id');
    loadOptions('/game/powers', 'power_id');
    loadOptions('/game/spells', 'spell_id');
    loadOptions('/game/typewarriors', 'type_warrior_id');

    // Cargar opciones para formulario de edición
    loadOptions('/game/races', 'edit-race_id');
    loadOptions('/game/powers', 'edit-power_id');
    loadOptions('/game/spells', 'edit-spell_id');
    loadOptions('/game/typewarriors', 'edit-type_warrior_id');

    loadCards();

    const createCardForm = document.getElementById('create-card-form');
    const editCardForm = document.getElementById('edit-card-form');
    const formMessage = document.getElementById('form-message');
    const editFormMessage = document.getElementById('edit-form-message');

    if (createCardForm) {
        createCardForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formMessage.textContent = '';

            const formData = new FormData(createCardForm);

            try {
                const response = await fetch('/game/cards', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    formMessage.style.color = 'green';
                    formMessage.textContent = 'Carta creada exitosamente.';
                    createCardForm.reset();
                    loadCards();
                    const modalElement = document.getElementById('createCardModal');
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) modal.hide();
                } else {
                    formMessage.style.color = 'red';
                    formMessage.textContent = 'Error: ' + (result.message || 'No se pudo crear la carta.');
                }
            } catch (error) {
                formMessage.style.color = 'red';
                formMessage.textContent = 'Error al conectar con el servidor.';
                console.error('Error al crear carta:', error);
            }
        });
    }

    if (editCardForm) {
        editCardForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            editFormMessage.textContent = '';

            const cardId = document.getElementById('edit-card-id').value;
            const formData = new FormData(editCardForm);

            try {
                const response = await fetch(`/game/cards/${cardId}`, {
                    method: 'PUT',
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    editFormMessage.style.color = 'green';
                    editFormMessage.textContent = 'Carta actualizada exitosamente.';
                    editCardForm.reset();
                    loadCards();
                    const modalElement = document.getElementById('editCardModal');
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) modal.hide();
                } else {
                    editFormMessage.style.color = 'red';
                    editFormMessage.textContent = 'Error: ' + (result.message || 'No se pudo actualizar la carta.');
                }
            } catch (error) {
                editFormMessage.style.color = 'red';
                editFormMessage.textContent = 'Error al conectar con el servidor.';
                console.error('Error al actualizar carta:', error);
            }
        });
    }

    async function loadOptions(endpoint, selectId) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('Error al cargar datos desde ' + endpoint);
            const data = await response.json();
            const select = document.getElementById(selectId);
            if (!select) return;
            select.options.length = 1;
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.name || item.type || item.spell || item.race || item.power || item.description || item.title || item.label || item.value || item;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Error cargando opciones:', error);
        }
    }

    async function loadCards() {
        try {
            const response = await fetch('/game/cards');
            if (!response.ok) throw new Error('Error al cargar cartas');
            const cards = await response.json();
            renderCards(cards);
        } catch (error) {
            console.error('Error al cargar cartas:', error);
        }
    }

    function renderCards(cards) {
        const tbody = document.querySelector('#cards-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        cards.forEach(card => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${card.id}</td>
                <td><img src="/assets/img/${card.image_url}" alt="${card.name}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;" /></td>
                <td>${card.name}</td>
                <td>${card.race_name || ''}</td>
                <td>${card.power_type || ''} ${card.power_value || ''}</td>
                <td>${card.spell_type || ''} ${card.spell_value || ''}</td>
                <td>${card.type_warrior_name || ''}</td>
                <td>${card.description}</td>
                <td>
                    <button class="edit-btn btn btn-sm btn-warning" data-id="${card.id}">Editar</button>
                    <button class="delete-btn btn btn-sm btn-danger" data-id="${card.id}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        addCardEventListeners();
    }

    function addCardEventListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openEditForm(id);
            });
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('¿Estás seguro de eliminar esta carta?')) {
                    deleteCard(id);
                }
            });
        });
    }

    async function openEditForm(id) {
        try {
            const response = await fetch(`/game/cards/${id}`);
            if (!response.ok) throw new Error('Error al obtener carta');
            const card = await response.json();

            document.getElementById('edit-card-id').value = card.id;
            document.getElementById('edit-name').value = card.name;
            document.getElementById('edit-race_id').value = card.race_id;
            document.getElementById('edit-power_id').value = card.power_id;
            document.getElementById('edit-spell_id').value = card.spell_id;
            document.getElementById('edit-type_warrior_id').value = card.type_warrior_id;
            document.getElementById('edit-description').value = card.description;

            // Abrir modal de edición
            const modalElement = document.getElementById('editCardModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        } catch (error) {
            alert(error.message);
        }
    }

    async function deleteCard(id) {
        try {
            const response = await fetch(`/game/cards/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar carta');
            alert('Carta eliminada correctamente');
            loadCards();
        } catch (error) {
            alert(error.message);
        }
    }
});
