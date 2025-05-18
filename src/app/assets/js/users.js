const apiUrl = '/game/users'; // Ajustar según ruta backend

// Elementos DOM
const usersTableBody = document.querySelector('#users-table tbody');
const editForm = document.getElementById('edit-form');
const editUserId = document.getElementById('edit-user-id');
const editUsername = document.getElementById('edit-username');
const editRole = document.getElementById('edit-role');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Función para cargar usuarios
async function loadUsers() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(apiUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Error al cargar usuarios');
    const users = await response.json();
    renderUsers(users);
  } catch (error) {
    alert(error.message);
  }
}

// Función para renderizar usuarios en la tabla
function renderUsers(users) {
  usersTableBody.innerHTML = '';
  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.role}</td>
      <td>
        <button class="edit-btn" data-id="${user.id}">Editar</button>
        <button class="delete-btn" data-id="${user.id}">Eliminar</button>
      </td>
    `;
    usersTableBody.appendChild(tr);
  });
  addEventListeners();
}

// Agregar eventos a botones editar y eliminar
function addEventListeners() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const userId = btn.getAttribute('data-id');
      openEditForm(userId);
    });
  });
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const userId = btn.getAttribute('data-id');
      if (confirm('¿Estás seguro de eliminar este usuario?')) {
        deleteUser(userId);
      }
    });
  });
}

// Abrir formulario de edición con datos del usuario
async function openEditForm(userId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Error al obtener usuario');
    const user = await response.json();
    editUserId.value = user.id;
    editUsername.value = user.username;
    editRole.value = user.role;
    editForm.style.display = 'block';
  } catch (error) {
    alert(error.message);
  }
}

// Guardar cambios de usuario
async function saveChanges() {
  const id = editUserId.value;
  const role = editRole.value;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });
    if (!response.ok) throw new Error('Error al actualizar usuario');
    alert('Usuario actualizado correctamente');
    editForm.style.display = 'none';
    loadUsers();
  } catch (error) {
    alert(error.message);
  }
}

// Eliminar usuario
async function deleteUser(userId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Error al eliminar usuario');
    alert('Usuario eliminado correctamente');
    loadUsers();
  } catch (error) {
    alert(error.message);
  }
}

// Cancelar edición
cancelBtn.addEventListener('click', () => {
  editForm.style.display = 'none';
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  saveBtn.addEventListener('click', saveChanges);
});
