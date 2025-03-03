// frontend/web/static/scriptOrders.js

// 0. Obtener productos a través del microOrders (que internamente llama a microProducts)
// Obtener productos desde microOrders (que a su vez consulta microProducts)
function getProducts() {
    fetch("http://192.168.100.3:5004/api/orders/products")
    .then(response => response.json())
    .then(data => {
        console.log("Productos obtenidos desde microOrders:", data); // Depuración

        const productListBody = document.querySelector("#product-list tbody");
        productListBody.innerHTML = ""; // Limpiar registros previos

        if (!Array.isArray(data) || data.length === 0) {
            console.warn("No hay productos disponibles.");
            productListBody.innerHTML = `<tr><td colspan="5" class="text-center">No hay productos disponibles</td></tr>`;
            return;
        }

        data.forEach(product => {
            const row = document.createElement("tr");

            // ID del producto
            const idCell = document.createElement("td");
            idCell.textContent = product.id;
            row.appendChild(idCell);

            // Nombre del producto
            const nameCell = document.createElement("td");
            nameCell.textContent = product.name;
            row.appendChild(nameCell);

            // Cantidad disponible
            const amountCell = document.createElement("td");
            amountCell.textContent = product.amount;
            row.appendChild(amountCell);

            // Precio
            const priceCell = document.createElement("td");
            priceCell.textContent = parseFloat(product.price).toFixed(2);
            row.appendChild(priceCell);

            // Input para ingresar la cantidad que se desea comprar
            const quantityCell = document.createElement("td");
            const quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.className = "form-control";
            quantityInput.min = "0";
            quantityInput.value = "0";
            quantityCell.appendChild(quantityInput);
            row.appendChild(quantityCell);

            productListBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error al obtener productos desde microOrders:", error);
        const productListBody = document.querySelector("#product-list tbody");
        productListBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error al cargar productos</td></tr>`;
    });
}

// 1. Crear una nueva orden (POST)
//    El frontend calcula un total aproximado, pero el backend hará el cálculo "real".
function createOrder() {
    const selectedProducts = [];
    let saleTotal = 0; // cálculo local "aproximado"

    const productRows = document.querySelectorAll('#product-list tbody tr');

    productRows.forEach(row => {
        const quantityInput = row.querySelector('input[type="number"]');
        const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 0;

        if (quantity > 0) {
            const productId = row.querySelector('td:nth-child(1)').textContent;
            const price = parseFloat(row.querySelector('td:nth-child(4)').textContent); // Columna del precio

            selectedProducts.push({ id: productId, quantity });

            // Calcular subtotal local
            saleTotal += price * quantity;
        }
    });

    if (selectedProducts.length === 0) {
        alert('Por favor, selecciona al menos un producto para realizar la orden.');
        return;
    }

    // Obtener username desde sessionStorage
    const username = sessionStorage.getItem('username');
    if (!username) {
        alert('Error: No hay un usuario autenticado. Inicia sesión nuevamente.');
        return;
    }

    // Notar que el backend recalculará el total;
    // aquí se envía saleTotal solo como referencia (opcional).
    const orderData = {
        username: username,
        // saleTotal: saleTotal.toFixed(2), // OPCIONAL, el backend no lo usa
        products: selectedProducts
    };

    fetch('http://192.168.100.3:5004/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Orden creada exitosamente') {
            // Mostrar el total local. El backend pudo calcular uno ligeramente distinto si los datos cambian.
            alert(`¡Orden creada exitosamente! Total calculado (frontend): $${saleTotal.toFixed(2)}`);
            getOrders(); // Recargar la lista de órdenes
            getProducts(); // Recargar la lista de Productos.
        } else {
            console.error('Error al crear la orden:', data.message);
            alert('Error al crear la orden. Por favor, intenta nuevamente.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al procesar la orden. Por favor, intenta nuevamente.');
    });
}

// 2. Obtener todas las órdenes (GET)
function getOrders() {
    fetch('http://192.168.100.3:5004/api/orders')
    .then(response => response.json())
    .then(data => {
        console.log("Órdenes:", data);

        const ordersListBody = document.querySelector("#orders-list tbody");
        ordersListBody.innerHTML = ""; // Limpiar registros previos

        data.forEach(order => {
            const row = document.createElement("tr");

            // ID de la orden
            const idCell = document.createElement("td");
            idCell.textContent = order.id;
            row.appendChild(idCell);

            // Nombre de usuario
            const userCell = document.createElement("td");
            userCell.textContent = order.username;
            row.appendChild(userCell);

            // Email
            const emailCell = document.createElement("td");
            emailCell.textContent = order.email;
            row.appendChild(emailCell);

            // Total de la orden
            const totalCell = document.createElement("td");
            totalCell.textContent = `$${parseFloat(order.saleTotal).toFixed(2)}`;
            row.appendChild(totalCell);

            // Fecha de la orden
            const dateCell = document.createElement("td");
            dateCell.textContent = order.date;
            row.appendChild(dateCell);

            // Acciones (Ver detalles, Eliminar)
            const actionsCell = document.createElement("td");

            // Botón para eliminar
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.className = "btn btn-danger";
            deleteButton.onclick = () => deleteOrder(order.id);
            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell);
            ordersListBody.appendChild(row);
        });
    })
    .catch(error => console.error("Error al obtener órdenes:", error));
}

// 3. Obtener detalles de una orden específica (GET)
function getOrder(orderId) {
    fetch(`http://192.168.100.3:5004/api/orders/${orderId}`)
    .then(response => response.json())
    .then(order => {
        document.getElementById("order-id").textContent = order.id;
        document.getElementById("order-username").textContent = order.username;
        document.getElementById("order-email").textContent = order.email;
        document.getElementById("order-total").textContent = `$${parseFloat(order.saleTotal).toFixed(2)}`;
        document.getElementById("order-date").textContent = order.date;
    })
    .catch(error => console.error("Error al obtener la orden:", error));
}

// 4. Eliminar una orden (DELETE)
function deleteOrder(orderId) {
    if (confirm("¿Estás seguro de que deseas eliminar esta orden?")) {
        fetch(`http://192.168.100.3:5004/api/orders/${orderId}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al eliminar la orden");
            }
            return response.json();
        })
        .then(result => {
            console.log("Orden eliminada:", result);
            alert("Orden eliminada exitosamente.");
            getOrders(); // Recargar la lista de órdenes después de la eliminación
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Ocurrió un error al eliminar la orden.");
        });
    }
}

// Obtener órdenes solo del usuario autenticado
function getUserOrders() {
    const username = sessionStorage.getItem('username');
    if (!username) {
        alert("Error: No hay un usuario autenticado.");
        return;
    }

    fetch("http://192.168.100.3:5004/api/orders")
    .then(response => response.json())
    .then(data => {
        console.log("Órdenes recibidas:", data);

        // Filtrar solo las órdenes del usuario autenticado
        const userOrders = data.filter(order => order.username === username);

        const ordersListBody = document.querySelector("#orders-list tbody");
        ordersListBody.innerHTML = ""; // Limpiar registros previos

        if (userOrders.length === 0) {
            ordersListBody.innerHTML = `<tr><td colspan="6" class="text-center">No tienes órdenes registradas</td></tr>`;
            return;
        }

        userOrders.forEach(order => {
            const row = document.createElement("tr");

            // ID de la orden
            const idCell = document.createElement("td");
            idCell.textContent = order.id;
            row.appendChild(idCell);

            // Nombre de usuario
            const userCell = document.createElement("td");
            userCell.textContent = order.username;
            row.appendChild(userCell);

            // Email
            const emailCell = document.createElement("td");
            emailCell.textContent = order.email;
            row.appendChild(emailCell);

            // Total de la orden
            const totalCell = document.createElement("td");
            totalCell.textContent = `$${parseFloat(order.saleTotal).toFixed(2)}`;
            row.appendChild(totalCell);

            // Fecha de la orden
            const dateCell = document.createElement("td");
            dateCell.textContent = order.date;
            row.appendChild(dateCell);

            // Acciones (Botón eliminar)
            const actionsCell = document.createElement("td"); // ✅ Definir actionsCell antes de usarlo
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.className = "btn btn-danger";
            deleteButton.onclick = () => {
                deleteOrder(order.id);
            };

            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell); // ✅ Ahora actionsCell existe antes de agregarlo a la fila

            ordersListBody.appendChild(row);
        });
    })
    .catch(error => console.error("Error al obtener órdenes del usuario:", error));
}


// Función para cargar el username en todas las páginas excepto en "/"
function loadUsername() {
    const username = sessionStorage.getItem('username');
    if (username) {
        console.log("Usuario en sesión:", username);
    } else {
        console.warn("No hay usuario en sesión. Redirigiendo al login...");
        window.location.href = "/login"; // Redirigir si no hay usuario autenticado
    }
}

// Ejecutar todas las funciones necesarias cuando la página cargue
window.addEventListener("load", function () {
    loadUsername();
    getProducts();
    getOrders();
});

