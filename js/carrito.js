const tbody = document.getElementById("tabla-productos");
let sumaSubtotal = 0.00;

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

fetch('..//productos.json')
    .then(res => res.json())
    .then(productos => {
        productos.forEach(producto => {
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
                tr.remove();
                actualizarTotales();
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
                actualizarTotales();
            });

            tdCantidad.appendChild(inputCantidad);
            tr.appendChild(tdCantidad);

            const tdSubtotal = document.createElement("td");
            tdSubtotal.textContent = `$${subtotal}`;
            tr.appendChild(tdSubtotal);

            tbody.appendChild(tr);
        });

        actualizarTotales();
    })
    .catch(err => {
        console.error("Error al cargar productos.json:", err);
    });
