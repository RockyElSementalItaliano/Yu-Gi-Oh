document.addEventListener('DOMContentLoaded', () => {
  loadTrainers();

  const toggleCreateFormBtn = document.getElementById('toggle-create-form');
  const createFormFields = document.getElementById('create-form-fields');

  if (toggleCreateFormBtn && createFormFields) {
    toggleCreateFormBtn.addEventListener('click', () => {
      if (createFormFields.style.display === 'none' || createFormFields.style.display === '') {
        createFormFields.style.display = 'flex';
        createFormFields.style.flexDirection = 'column';
        createFormFields.style.gap = '10px';
      } else {
        createFormFields.style.display = 'none';
      }
    });
  } else {
    // No mostrar error para evitar logs en páginas sin esos elementos
  }

  const createBtn = document.getElementById('create-btn');
  if (createBtn) createBtn.addEventListener('click', createTrainer);

  const saveBtn = document.getElementById('save-btn');
  if (saveBtn) saveBtn.addEventListener('click', saveChanges);

  const cancelBtn = document.getElementById('cancel-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', () => {
    const editForm = document.getElementById('edit-form');
    if (editForm) editForm.style.display = 'none';
  });
});

const apiUrl = '/game/trainers'; // Ajustar según ruta backend

async function loadTrainers() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Error al cargar entrenadores');
    const trainers = await response.json();
    renderTrainers(trainers);
  } catch (error) {
    alert(error.message);
  }
}

function renderTrainers(trainers) {
  const tbody = document.querySelector('#trainers-table tbody');
  if (!tbody) return; // Evitar error si no existe el elemento
  tbody.innerHTML = '';
  trainers.forEach(trainer => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${trainer.id}</td>
      <td><img src="${trainer.image}" alt="${trainer.name}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;" /></td>
      <td>${trainer.name}</td>
      <td>
        <button class="edit-btn" data-id="${trainer.id}">Editar</button>
        <button class="delete-btn" data-id="${trainer.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  addEventListeners();
}

function addEventListeners() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openEditForm(id);
    });
  });
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('¿Estás seguro de eliminar este entrenador?')) {
        deleteTrainer(id);
      }
    });
  });
}

async function openEditForm(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`);
    if (!response.ok) throw new Error('Error al obtener entrenador');
    const trainer = await response.json();
    document.getElementById('edit-trainer-id').value = trainer.id;
    document.getElementById('edit-trainer-name').value = trainer.name;
    document.getElementById('edit-form').style.display = 'block';
  } catch (error) {
    alert(error.message);
  }
}

async function saveChanges() {
  const id = document.getElementById('edit-trainer-id').value;
  const name = document.getElementById('edit-trainer-name').value.trim();

  if (!name) {
    alert('El nombre no puede estar vacío.');
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Error al actualizar entrenador');
    alert('Entrenador actualizado correctamente');
    document.getElementById('edit-form').style.display = 'none';
    loadTrainers();
  } catch (error) {
    alert(error.message);
  }
}

async function deleteTrainer(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar entrenador');
    alert('Entrenador eliminado correctamente');
    loadTrainers();
  } catch (error) {
    alert(error.message);
  }
}

async function createTrainer() {
  const name = document.getElementById('create-trainer-name').value.trim();
  const photoInput = document.getElementById('create-trainer-photo');
  const photoFile = photoInput.files[0];

  if (!name) {
    alert('El nombre no puede estar vacío.');
    return;
  }
  if (!photoFile) {
    alert('Debe seleccionar una fotografía.');
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('photo', photoFile);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Error al crear entrenador');
    alert('Entrenador creado correctamente');
    document.getElementById('create-trainer-name').value = '';
    photoInput.value = '';
    loadTrainers();
  } catch (error) {
    alert(error.message);
  }
}

