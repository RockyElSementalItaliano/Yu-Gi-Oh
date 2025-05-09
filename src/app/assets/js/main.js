// --- REGISTRO DE USUARIO ---
// Función para registrar un nuevo usuario
const registerUser = async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirm_password').value.trim();

  // Validar campos
  if (!username || !password || !confirmPassword) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  // Verificar que las contraseñas coincidan
  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden. Inténtalo de nuevo.');
    return;
  }

  try {
    // Enviar solicitud al backend
    const response = await fetch('/game/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Usuario registrado con éxito. ¡Ya puedes iniciar sesión!');
      window.location.href = '/assets/views/login.html'; // Redirigir al login
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un problema al conectar con el servidor. Por favor, intenta de nuevo.');
  }
};

// Configurar eventos al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  const registerBtn = document.getElementById('register-btn');
  if (registerBtn) {
    // Conectar el botón de registro con la función
    registerBtn.addEventListener('click', registerUser);
  }
});


// --- LOGIN DE USUARIO ---
const loginUser = async () => {
  // Capturar los valores ingresados por el usuario
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Validación de los campos del formulario
  if (!username || !password) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  try {
    // Enviar solicitud al backend
    const response = await fetch('/game/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    // Validar la respuesta del servidor
    if (response.ok) {
      alert(`¡Bienvenido, ${result.username}!`);
      // Guardar los datos del usuario en LocalStorage
      localStorage.setItem('user', JSON.stringify(result));
      // Redirigir al home del juego
      window.location.href = '/assets/views/home.html';
    } else {
      // Mostrar mensaje de error
      alert('Error: ' + (result.message || 'Credenciales inválidas'));
    }
  } catch (error) {
    // Manejo de errores en la conexión
    console.error('Error:', error);
    alert('Hubo un problema al conectarse con el servidor. Por favor, intenta de nuevo.');
  }
};

// Configuración de eventos para el login
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    // Prevenir el comportamiento por defecto del formulario
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loginUser(); // Llamar a la función de inicio de sesión
    });
  }
});

// --- SELECCIÓN DE CARTAS ---
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card'); // Todas las cartas disponibles
  const player1CardSpaces = document.querySelectorAll('#player1-cards .card-space'); // Espacios Jugador 1
  const player2CardSpaces = document.querySelectorAll('#player2-cards .card-space'); // Espacios Jugador 2
  const startPlayer1Button = document.getElementById('start-player1');
  const startPlayer2Button = document.getElementById('start-player2');
  const battleButton = document.querySelector('a[href="game.html"]'); // Botón "¡Ir a la Batalla!"
  const resetButton = document.querySelector('button[onclick="location.reload()"]'); // Botón "Volver a Seleccionar"

  let player1Cards = []; // Cartas seleccionadas por Jugador 1
  let player2Cards = []; // Cartas seleccionadas por Jugador 2
  let currentPlayer = 'player1'; // Empieza con Jugador 1

  // Selección de cartas para cada jugador
  const handleCardSelection = (card) => {
    const warriorData = JSON.parse(card.getAttribute('data-warrior'));
    const cardHTML = card.outerHTML; // Guardar toda la estructura visual de la carta

    if (currentPlayer === 'player1' && player1Cards.length >= 5) {
      alert('Jugador 1 ya seleccionó sus 5 cartas.');
      return;
    } else if (currentPlayer === 'player2' && player2Cards.length >= 5) {
      alert('Jugador 2 ya seleccionó sus 5 cartas.');
      return;
    }

    // Añadir la carta seleccionada al jugador actual
    if (currentPlayer === 'player1') {
      player1Cards.push({ data: warriorData, html: cardHTML }); // Guardar datos y estructura HTML
      const space = player1CardSpaces[player1Cards.length - 1];
      space.innerHTML = cardHTML; // Mostrar la carta tal cual
    } else if (currentPlayer === 'player2') {
      player2Cards.push({ data: warriorData, html: cardHTML }); // Guardar datos y estructura HTML
      const space = player2CardSpaces[player2Cards.length - 1];
      space.innerHTML = cardHTML; // Mostrar la carta tal cual
    }

    // Ocultar carta seleccionada del pool
    card.style.display = 'none';
  };

  // Cambiar entre jugadores
  startPlayer1Button.addEventListener('click', () => {
    currentPlayer = 'player1';
    startPlayer1Button.disabled = true;
    startPlayer2Button.disabled = false;
    alert('Jugador 1, selecciona tus cartas.');
  });

  startPlayer2Button.addEventListener('click', () => {
    if (player1Cards.length < 5) {
      alert('Jugador 1 debe seleccionar sus 5 cartas antes de continuar.');
      return;
    }
    currentPlayer = 'player2';
    startPlayer2Button.disabled = true;
    alert('Jugador 2, selecciona tus cartas.');
  });

  // Guardar cartas seleccionadas en localStorage al iniciar la batalla
  battleButton.addEventListener('click', (event) => {
    if (player1Cards.length !== 5 || player2Cards.length !== 5) {
      alert('Ambos jugadores deben seleccionar 5 cartas antes de continuar.');
      event.preventDefault(); // Evita la redirección a game.html
      return;
    }

    // Almacenar cartas con estructura HTML en localStorage
    localStorage.setItem('player1Cards', JSON.stringify(player1Cards));
    localStorage.setItem('player2Cards', JSON.stringify(player2Cards));
    console.log('Cartas guardadas en localStorage.');
  });

  // Reiniciar toda la selección con el botón "Volver a Seleccionar"
  const resetSelection = () => {
    // Limpiar localStorage
    localStorage.removeItem('player1Cards');
    localStorage.removeItem('player2Cards');

    // Reiniciar el estado visual de las cartas
    player1CardSpaces.forEach((space) => (space.innerHTML = ''));
    player2CardSpaces.forEach((space) => (space.innerHTML = ''));
    cards.forEach((card) => (card.style.display = 'block')); // Mostrar todas las cartas nuevamente

    // Reiniciar botones y estado
    startPlayer1Button.disabled = false;
    startPlayer2Button.disabled = true;
    player1Cards = [];
    player2Cards = [];
    currentPlayer = 'player1'; // Reiniciar al Jugador 1

    alert('Las selecciones han sido reiniciadas. Puedes comenzar de nuevo.');
  };

  // Asociar el evento al botón "Volver a Seleccionar"
  resetButton.addEventListener('click', resetSelection);

  // Añadir evento de clic a las cartas
  cards.forEach((card) => {
    card.addEventListener('click', () => handleCardSelection(card));
  });
});

// --- AQUI VA LA LOGICA DEL JUEGO ---
document.addEventListener('DOMContentLoaded', () => {
  const player1CardSpaces = document.querySelectorAll('#player1-cards .card-space');
  const player2CardSpaces = document.querySelectorAll('#player2-cards .card-space');
  const startBattleButton = document.getElementById('game-area');
  const finalizeButton = document.getElementById('finalize-button');

  let player1Cards = [];
  let player2Cards = [];
  let winner = null;

  const loadSelectedCards = () => {
    const savedPlayer1Cards = JSON.parse(localStorage.getItem('player1Cards')) || [];
    const savedPlayer2Cards = JSON.parse(localStorage.getItem('player2Cards')) || [];

    if (savedPlayer1Cards.length === 0 || savedPlayer2Cards.length === 0) {
      // alert('No hay cartas seleccionadas en localStorage. Verifica select-warriors.html.');
      return;
    }

    savedPlayer1Cards.forEach((cardObj, index) => {
      if (index < player1CardSpaces.length) {
        player1CardSpaces[index].innerHTML = cardObj.html; // Cargar la estructura visual completa
      }
    });

    savedPlayer2Cards.forEach((cardObj, index) => {
      if (index < player2CardSpaces.length) {
        player2CardSpaces[index].innerHTML = cardObj.html; // Cargar la estructura visual completa
      }
    });

    player1Cards = savedPlayer1Cards;
    player2Cards = savedPlayer2Cards;

    if (player1Cards.length === 5 && player2Cards.length === 5) {
      startBattleButton.disabled = false;
    }
  };

  loadSelectedCards();
});

