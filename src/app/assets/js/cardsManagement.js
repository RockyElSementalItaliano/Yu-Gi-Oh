document.addEventListener('DOMContentLoaded', () => {
    loadOptions('/game/races', 'race_id');
    loadOptions('/game/powers', 'power_id');
    loadOptions('/game/spells', 'spell_id');
    loadOptions('/game/typewarriors', 'type_warrior_id');

    loadCards();

    const showCreateFormBtn = document.getElementById('show-create-form');
    const createFormContainer = document.getElementById('create-card-form-container');
    const cancelCreateBtn = document.getElementById('cancel-create');
    const createCardForm = document.getElementById('create-card-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    const imageUploadContainer = document.getElementById('image-upload-container');

    showCreateFormBtn.addEventListener('click', () => {
        createFormContainer.style.display = 'block';
        showCreateFormBtn.style.display = 'none';
        formMessage.textContent = '';
        createCardForm.reset();
        document.getElementById('card-id').value = '';
        submitBtn.textContent = 'Crear Carta';
        imageUploadContainer.style.display = 'block'; // Mostrar selector de archivo en creación
    });

    cancelCreateBtn.addEventListener('click', () => {
        createFormContainer.style.display = 'none';
        showCreateFormBtn.style.display = 'block';
        formMessage.textContent = '';
        createCardForm.reset();
        document.getElementById('card-id').value = '';
    });

    createCardForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formMessage.textContent = '';

        const cardId = document.getElementById('card-id').value;
        const formData = new FormData(createCardForm);

        try {
            let response;
            if (cardId) {
                // Edición
                response = await fetch(`/game/cards/${cardId}`, {
                    method: 'PUT',
                    body: formData
                });
            } else {
                // Creación
                response = await fetch('/game/cards', {
                    method: 'POST',
                    body: formData
                });
            }

            const result = await response.json();

            if (response.ok) {
                formMessage.style.color = 'green';
                formMessage.textContent = cardId ? 'Carta actualizada exitosamente.' : 'Carta creada exitosamente.';
                createCardForm.reset();
                document.getElementById('card-id').value = '';
                loadCards();
                createFormContainer.style.display = 'none';
                showCreateFormBtn.style.display = 'block';
            } else {
                formMessage.style.color = 'red';
                formMessage.textContent = 'Error: ' + (result.message || 'No se pudo guardar la carta.');
            }
        } catch (error) {
            formMessage.style.color = 'red';
            formMessage.textContent = 'Error al conectar con el servidor.';
            console.error('Error al guardar carta:', error);
        }
    });

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
                    <button class="edit-btn" data-id="${card.id}">Editar</button>
                    <button class="delete-btn" data-id="${card.id}">Eliminar</button>
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

            document.getElementById('card-id').value = card.id;
            document.getElementById('name').value = card.name;
            document.getElementById('race_id').value = card.race_id;
            document.getElementById('power_id').value = card.power_id;
            document.getElementById('spell_id').value = card.spell_id;
            document.getElementById('type_warrior_id').value = card.type_warrior_id;
            document.getElementById('description').value = card.description;

            // Mostrar formulario y cambiar texto del botón
            const createFormContainer = document.getElementById('create-card-form-container');
            const showCreateFormBtn = document.getElementById('show-create-form');
            const submitBtn = document.getElementById('submit-btn');

            createFormContainer.style.display = 'block';
            showCreateFormBtn.style.display = 'none';
            submitBtn.textContent = 'Guardar Cambios';

            // Ocultar selector de archivo en edición
            const imageUploadContainer = document.getElementById('image-upload-container');
            if (imageUploadContainer) {
                imageUploadContainer.style.display = 'none';
            }
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
