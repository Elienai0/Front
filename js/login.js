async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const username = form.querySelector('#username').value.trim();
    const password = form.querySelector('#password').value.trim();

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Cargando...';

    // Eliminar errores previos
    const existingError = form.querySelector('.login-error');
    if (existingError) existingError.remove();

    try {
        const response = await fetch('http://alextcwserver.ddns.net:8200/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            // Si status no es OK, lanzar error con mensaje del servidor o genérico
            const errorText = await response.text();
            throw new Error(errorText || 'Credenciales incorrectas');
        }

        const data = await response.json();

        if (!data.token) throw new Error('No se recibió token del servidor');

        localStorage.setItem('jwtToken', data.token);

        // Redirigir al carrito o a la página que corresponda
        window.location.href = 'cart.html';

    } catch (error) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('login-error');
        errorElement.style.color = '#ff3333';
        errorElement.style.padding = '10px';
        errorElement.style.marginTop = '15px';
        errorElement.style.borderRadius = '5px';
        errorElement.style.backgroundColor = '#ffeeee';
        errorElement.style.textAlign = 'center';
        errorElement.textContent = error.message.includes('Failed to fetch')
            ? 'Error de conexión con el servidor'
            : error.message;

        form.appendChild(errorElement);

    } finally {
        button.disabled = false;
        button.textContent = 'INGRESAR';
    }
}

// Asociar el evento submit al formulario
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});
