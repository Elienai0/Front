async function obtenerProductos() {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        console.error("❌ Token JWT no encontrado. Inicia sesión primero.");
        return;
    }

    try {
        const response = await fetch('http://alextcwserver.ddns.net:8200/productos/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        const productos = await response.json();
        console.log("✅ Productos recibidos:", productos);

        // Suponiendo que quieres mostrar los productos en una lista con id="lista-productos"
        const contenedor = document.getElementById('lista-productos');
        contenedor.innerHTML = '';

        productos.forEach(producto => {
            const item = document.createElement('div');
            item.className = 'producto';
            item.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <p>${producto.descripcion || 'Sin descripción'}</p>
                <hr/>
            `;
            contenedor.appendChild(item);
        });

    } catch (error) {
        console.error("❌ Error al obtener productos:", error);
        const contenedor = document.getElementById('lista-productos');
        contenedor.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', obtenerProductos);
