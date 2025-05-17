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

// --- LOGIN DE USUARIO ---
const loginUser = async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Por favor, completa todos los campos.');
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
        alert('Error al procesar el token de autenticación.');
        return;
      }
      alert(`¡Bienvenido, ${userData.username}!`);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      if (userData.role === 'admin') {
        window.location.href = '/assets/views/adminPanel.html';
      } else {
        window.location.href = '/assets/views/playerPanel.html';
      }
    } else {
      alert('Error: ' + (result.error || 'Credenciales inválidas'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un problema al conectarse con el servidor. Por favor, intenta de nuevo.');
  }
};

// --- REGISTRO DE USUARIO ---
const registerUser = async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirm_password').value.trim();

  if (!username || !password || !confirmPassword) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden.');
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
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      window.location.href = '/assets/views/login.html';
    } else {
      alert('Error: ' + (result.error || 'No se pudo registrar el usuario.'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un problema al conectarse con el servidor. Por favor, intenta de nuevo.');
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
