document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.login-form');

  if (!loginForm) {
    console.error('❌ No se encontró el formulario con la clase .login-form');
    return;
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = loginForm.querySelector('input[type="text"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value.trim();
    const button = loginForm.querySelector('button[type="submit"]');
    const errorDiv = loginForm.querySelector('.login-error');

    if (errorDiv) errorDiv.remove();

    button.disabled = true;
    button.textContent = 'Cargando...';

    try {
      const res = await fetch('http://alextcwserver.ddns.net:8200/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      console.log('Respuesta login:', data);

      if (!res.ok || !data.token) {
        throw new Error(data.message || 'Credenciales incorrectas');
      }

      localStorage.setItem('jwtToken', data.token);
      window.location.href = 'cart.html'; // Redirige al carrito

    } catch (err) {
      const msg = document.createElement('div');
      msg.classList.add('login-error');
      msg.style.color = 'red';
      msg.style.marginTop = '10px';
      msg.textContent = err.message.includes('Failed to fetch')
        ? 'No se pudo conectar con el servidor'
        : err.message;

      loginForm.appendChild(msg);

    } finally {
      button.disabled = false;
      button.textContent = 'INGRESAR';
    }
  });
});
