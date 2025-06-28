// Script para el menú
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

// 🔽 Agregado: función para llamar pedidos
function llamarPedidos() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        console.error("❌ No se encontró el token en localStorage con la clave 'jwtToken'");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://alextcwserver.ddns.net:8200/pedido/1", requestOptions)
        .then((response) => response.json())
        .then((result) => console.log("✅ Pedido recibido:", result))
        .catch((error) => console.error("❌ Error en la petición:", error));
}

// 🔁 Ejecutar cuando se cargue el DOM
document.addEventListener("DOMContentLoaded", llamarPedidos);