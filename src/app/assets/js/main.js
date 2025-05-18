// Función para decodificar JWT (sin librerías externas)
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Función para mostrar mensajes en modal Bootstrap con icono de éxito o error
const showModalMessage = (message, type = 'success') => {
  const modalBody = document.getElementById('messageModalBody');
  if (!modalBody) return;

  let iconHtml = '';
  if (type === 'success') {
    iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" style="width:24px; height:24px; vertical-align:middle; margin-right:8px; fill:green;" viewBox="0 0 24 24"><path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z"/></svg>`;
  } else if (type === 'danger') {
    iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" style="width:24px; height:24px; vertical-align:middle; margin-right:8px; fill:red;" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5 13.6L15.6 17 12 13.4 8.4 17 7 15.6 10.6 12 7 8.4 8.4 7 12 10.6 15.6 7 17 8.4 13.4 12 17 15.6z"/></svg>`;
  }

  modalBody.innerHTML = `${iconHtml}<span style="vertical-align:middle;">${message}</span>`;
  const messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
  messageModal.show();
};

// --- LOGIN DE USUARIO ---
const loginUser = async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    showModalMessage('Por favor, completa todos los campos.', 'danger');
    return;
  }

  try {
    const response = await fetch('/game/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      const token = result.token;
      const userData = parseJwt(token);
      if (!userData) {
        showModalMessage('Error al procesar el token de autenticación.', 'danger');
        return;
      }
      // Mostrar saludo en cuadro con icono de chulito verde
      const welcomeBox = document.getElementById('welcome-box');
      if (welcomeBox) {
        const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" style="width:20px; height:20px; vertical-align:middle; margin-right:6px; fill:green;" viewBox="0 0 24 24"><path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z"/></svg>`;
        welcomeBox.innerHTML = `${checkIcon}¡Bienvenido, ${userData.username}!`;
        welcomeBox.style.display = 'block';
      }
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setTimeout(() => {
        if (userData.role === 'admin') {
          window.location.href = '/assets/views/adminPanel.html';
        } else {
          window.location.href = '/assets/views/playerPanel.html';
        }
      }, 1500);
    } else {
      showModalMessage('Error: ' + (result.error || 'Credenciales inválidas'), 'danger');
    }
  } catch (error) {
    console.error('Error:', error);
    showModalMessage('Hubo un problema al conectarse con el servidor. Por favor, intenta de nuevo.', 'danger');
  }
};

// --- REGISTRO DE USUARIO ---
const registerUser = async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirm_password').value.trim();

  if (!username || !password || !confirmPassword) {
    showModalMessage('Por favor, completa todos los campos.', 'danger');
    return;
  }

  if (password !== confirmPassword) {
    showModalMessage('Las contraseñas no coinciden.', 'danger');
    return;
  }

  try {
    const response = await fetch('/game/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      showModalMessage('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
      setTimeout(() => {
        window.location.href = '/assets/views/login.html';
      }, 1500);
    } else {
      showModalMessage('Error: ' + (result.error || 'No se pudo registrar el usuario.'), 'danger');
    }
  } catch (error) {
    console.error('Error:', error);
    showModalMessage('Hubo un problema al conectarse con el servidor. Por favor, intenta de nuevo.', 'danger');
  }
};

// Configuración de eventos para login y registro
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loginUser();
    });
  }

  const registerBtn = document.getElementById('register-btn');
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      registerUser();
    });
  }
});
