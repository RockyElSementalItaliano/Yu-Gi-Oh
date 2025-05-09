const showFormButton = document.getElementById('show-form-button');
  const createCardFormContainer = document.getElementById('create-card-form-container');
  const closeFormButton = document.getElementById('close-form-button');

  showFormButton.addEventListener('click', () => {
    createCardFormContainer.style.display = 'block';
    showFormButton.style.display = 'none';
  });

  closeFormButton.addEventListener('click', () => {
    createCardFormContainer.style.display = 'none';
    showFormButton.style.display = 'block';
  });
// Función para cargar opciones desde la API
async function loadOptions(endpoint, selectId) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Error al cargar datos desde ' + endpoint);
    const data = await response.json();
    console.log(`Datos recibidos de ${endpoint}:`, data);
    const select = document.getElementById(selectId);
    if (!select) {
      console.error(`No se encontró el select con id ${selectId}`);
      return;
    }
    // Limpiar opciones previas excepto la primera
    select.options.length = 1;
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.name || item.type || item.spell || item.race || item.power || item.description || item.title || item.label || item.value || item; // fallback
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error cargando opciones:', error);
  }
}

// Cargar todas las opciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  loadOptions('/game/races', 'race_id');
  loadOptions('/game/powers', 'power_id');
  loadOptions('/game/spells', 'spell_id');
  loadOptions('/game/typewarriors', 'type_warrior_id');
});

// Manejar el envío del formulario
document.getElementById('create-card-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  try {
    const response = await fetch('/game/cards', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    const messageDiv = document.getElementById('form-message');

    if (response.ok) {
      messageDiv.style.color = 'green';
      messageDiv.textContent = 'Carta creada exitosamente.';
      form.reset();
    } else {
      messageDiv.style.color = 'red';
      messageDiv.textContent = 'Error: ' + (result.message || 'No se pudo crear la carta.');
    }
  } catch (error) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Error al conectar con el servidor.';
    console.error('Error al crear carta:', error);
  }
});
