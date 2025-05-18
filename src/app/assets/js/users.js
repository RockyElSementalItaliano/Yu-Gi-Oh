const apiUrl = '/game/users'; // Ajustar según ruta backend

// Elementos DOM
const usersTableBody = document.querySelector('#users-table tbody');
const createUserForm = document.getElementById('create-user-form');
const editUserForm = document.getElementById('edit-user-form');
const createFormMessage = document.getElementById('create-form-message');
const editFormMessage = document.getElementById('edit-form-message');

// Cargar usuarios y renderizar tabla
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

// Renderizar usuarios en tabla
function renderUsers(users) {
  usersTableBody.innerHTML = '';
  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.role}</td>
      <td>
        <button class="edit-btn btn btn-sm btn-warning" data-id="${user.id}">Editar</button>
        <button class="delete-btn btn btn-sm btn-danger" data-id="${user.id}">Eliminar</button>
      </td>
    `;
    usersTableBody.appendChild(tr);
  });
  addEventListeners();
}

// Agregar eventos a botones
function addEventListeners() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const userId = btn.getAttribute('data-id');
      openEditModal(userId);
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

// Abrir modal de edición y cargar datos
async function openEditModal(userId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Error al obtener usuario');
    const user = await response.json();

    document.getElementById('edit-user-id').value = user.id;
    document.getElementById('edit-username').value = user.username;
    document.getElementById('edit-role').value = user.role;

    const modalElement = document.getElementById('editUserModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  } catch (error) {
    alert(error.message);
  }
}

// Guardar cambios de usuario editado
async function saveUserChanges(e) {
  e.preventDefault();
  editFormMessage.textContent = '';

  const id = document.getElementById('edit-user-id').value;
  const role = document.getElementById('edit-role').value;

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
    editFormMessage.style.color = 'green';
    editFormMessage.textContent = 'Usuario actualizado correctamente';
    const modalElement = document.getElementById('editUserModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
    loadUsers();
  } catch (error) {
    editFormMessage.style.color = 'red';
    editFormMessage.textContent = error.message;
  }
}

// Crear nuevo usuario
async function createUser(e) {
  e.preventDefault();
  createFormMessage.textContent = '';

  const username = document.getElementById('create-username').value;
  const password = document.getElementById('create-password').value;
  const role = document.getElementById('create-role').value;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username, password, role })
    });
    if (!response.ok) throw new Error('Error al crear usuario');
    createFormMessage.style.color = 'green';
    createFormMessage.textContent = 'Usuario creado correctamente';
    const modalElement = document.getElementById('createUserModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
    document.getElementById('create-user-form').reset();
    loadUsers();
  } catch (error) {
    createFormMessage.style.color = 'red';
    createFormMessage.textContent = error.message;
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

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  if (editUserForm) {
    editUserForm.addEventListener('submit', saveUserChanges);
  }
  if (createUserForm) {
    createUserForm.addEventListener('submit', createUser);
  }
});
