const tbody = document.getElementById("tabla-productos");
let sumaSubtotal = 0.00;
const token = localStorage.getItem("token"); // O como guardes el login del usuario

function actualizarTotales() {
    let nuevaSuma = 0.00;

    tbody.querySelectorAll("tr").forEach(fila => {
        const precio = parseFloat(fila.querySelector("td:nth-child(4)").textContent.replace("$", ""));
        const cantidad = parseInt(fila.querySelector("input").value);
        const subtotal = precio * cantidad;
        fila.querySelector("td:nth-child(6)").textContent = `$${subtotal.toFixed(2)}`;
        nuevaSuma += subtotal;
    });

    document.getElementById("subtotal-carrito").textContent = `$${nuevaSuma.toFixed(2)}`;

    const envio = nuevaSuma >= 200 ? 0.00 : 75.00;
    document.getElementById("envio-carrito").textContent = envio === 0 ? "Gratis" : `$${envio.toFixed(2)}`;

    const total = nuevaSuma + envio;
    document.getElementById("total-carrito").innerHTML = `<strong>$${total.toFixed(2)}</strong>`;
}

function renderProducto(producto) {
    const subtotal = (producto.precio * producto.cantidad).toFixed(2);
    sumaSubtotal += parseFloat(subtotal);

    const tr = document.createElement("tr");

    const tdEliminar = document.createElement("td");
    const eliminarBtn = document.createElement("a");
    eliminarBtn.href = "#";
    eliminarBtn.innerHTML = '<i class="far fa-times-circle"></i>';
    tdEliminar.appendChild(eliminarBtn);
    tr.appendChild(tdEliminar);

    eliminarBtn.addEventListener("click", function (e) {
        e.preventDefault();
        eliminarProductoDelCarrito(producto.producto_id)
            .then(() => {
                tr.remove();
                actualizarTotales();
            })
            .catch(console.error);
    });

    const tdImagen = document.createElement("td");
    tdImagen.innerHTML = `<img src="${producto.imagen}" alt="">`;
    tr.appendChild(tdImagen);

    const tdNombre = document.createElement("td");
    tdNombre.textContent = producto.nombre;
    tr.appendChild(tdNombre);

    const tdPrecio = document.createElement("td");
    tdPrecio.textContent = `$${producto.precio}`;
    tr.appendChild(tdPrecio);

    const tdCantidad = document.createElement("td");
    const inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.value = producto.cantidad;
    inputCantidad.min = 1;

    inputCantidad.addEventListener("input", () => {
        const nuevaCantidad = parseInt(inputCantidad.value);
        actualizarCantidadProducto(producto.producto_id, nuevaCantidad)
            .then(() => actualizarTotales())
            .catch(console.error);
    });

    tdCantidad.appendChild(inputCantidad);
    tr.appendChild(tdCantidad);

    const tdSubtotal = document.createElement("td");
    tdSubtotal.textContent = `$${subtotal}`;
    tr.appendChild(tdSubtotal);

    tbody.appendChild(tr);
}

function cargarCarritoDesdeAPI() {
    fetch('http://localhost:8080/api/carrito', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Error cargando el carrito desde la API");
        return res.json();
    })
    .then(productos => {
        productos.forEach(renderProducto);
        actualizarTotales();
    })
    .catch(err => {
        console.error("Error al cargar productos del carrito:", err);
    });
}

function actualizarCantidadProducto(productoId, nuevaCantidad) {
    return fetch(`http://localhost:8080/api/carrito/${productoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cantidad: nuevaCantidad })
    });
}

function eliminarProductoDelCarrito(productoId) {
    return fetch(`http://localhost:8080/api/carrito/${productoId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    cargarCarritoDesdeAPI();
});
