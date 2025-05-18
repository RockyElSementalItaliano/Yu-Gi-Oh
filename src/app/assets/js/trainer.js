document.addEventListener('DOMContentLoaded', () => {
  loadTrainers();

  const createForm = document.getElementById('create-trainer-form');
  if (createForm) {
    createForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await createTrainer();
      const modalElement = document.getElementById('createTrainerModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    });
  }

  const editForm = document.getElementById('edit-trainer-form');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await saveChanges();
    });
  }
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
  if (!tbody) return;
  tbody.innerHTML = '';
  trainers.forEach(trainer => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${trainer.id}</td>
      <td><img src="${trainer.image}" alt="${trainer.name}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;" /></td>
      <td>${trainer.name}</td>
      <td>
        <button class="edit-btn btn btn-sm btn-warning" data-id="${trainer.id}">Editar</button>
        <button class="delete-btn btn btn-sm btn-danger" data-id="${trainer.id}">Eliminar</button>
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
      openEditModal(id);
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

async function openEditModal(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`);
    if (!response.ok) throw new Error('Error al obtener entrenador');
    const trainer = await response.json();
    document.getElementById('edit-trainer-id').value = trainer.id;
    document.getElementById('edit-trainer-name').value = trainer.name;
    const modalElement = document.getElementById('editTrainerModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
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
    const modalElement = document.getElementById('editTrainerModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
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
