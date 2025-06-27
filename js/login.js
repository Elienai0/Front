async function handleLogin(event) {
    event.preventDefault();
    const button = event.target.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Cargando...';

    try {
        const response = await fetch('http://alextcwserver.ddns.net:8200/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            })
        });

        if (!response.ok) {
            throw new Error(await response.text() || 'Credenciales incorrectas');
        }

        const { token } = await response.json();
        localStorage.setItem('jwtToken', token);
        
        // Redirigir al carrito (cambia la URL si es diferente)
        window.location.href = 'cart.html';

    } catch (error) {
        // Mostrar mensaje de error visual
        const errorElement = document.createElement('div');
        errorElement.style.color = '#ff3333';
        errorElement.style.padding = '10px';
        errorElement.style.marginTop = '15px';
        errorElement.style.borderRadius = '5px';
        errorElement.style.backgroundColor = '#ffeeee';
        errorElement.style.textAlign = 'center';
        errorElement.textContent = error.message.includes('Failed to fetch') 
            ? 'Error de conexión con el servidor' 
            : error.message;

        // Eliminar mensajes anteriores
        const existingError = document.querySelector('.login-error');
        if (existingError) existingError.remove();
        
        errorElement.classList.add('login-error');
        document.querySelector('.login-form').appendChild(errorElement);

    } finally {
        button.disabled = false;
        button.textContent = 'INGRESAR';
    }
}

// Verificar autenticación al cargar (opcional)
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});