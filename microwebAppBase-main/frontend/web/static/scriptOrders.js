// Obtener productos y agregarlos a la tabla
function loadProducts() {
    fetch("http://192.168.100.3:5004/api/products")
        .then(response => response.json())
        .then(products => {
            const productList = document.querySelector("#product-list tbody");
            productList.innerHTML = ""; // Limpiar tabla antes de cargar

            products.forEach(product => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>
                        <input type="number" min="0" value="0" class="form-control quantity-input">
                    </td>
                `;

                productList.appendChild(row);
            });
        })
        .catch(error => console.error("Error:", error));
}

// Crear orden con los productos seleccionados
function createOrder() {
    const selectedProducts = [];
    const productRows = document.querySelectorAll('#product-list tbody tr');

    productRows.forEach(row => {
        const quantityInput = row.querySelector('.quantity-input');
        const quantity = parseInt(quantityInput.value);

        if (quantity > 0) {
            const productId = row.children[0].textContent;
            const productName = row.children[1].textContent;
            const productPrice = parseFloat(row.children[2].textContent);

            selectedProducts.push({ id: productId, name: productName, price: productPrice, quantity });
        }
    });

    if (selectedProducts.length === 0) {
        alert('Por favor, selecciona al menos un producto para realizar la orden.');
        return;
    }

    const orderData = {
        user: {
            name: sessionStorage.getItem('username'),
            email: sessionStorage.getItem('email')
        },
        products: selectedProducts
    };

    fetch("http://192.168.100.3:5004/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Orden creada exitosamente') {
            alert('¡Orden creada exitosamente!');
            getOrders();
        } else {
            alert('Error al crear la orden. Por favor, intenta nuevamente.');
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert('Ocurrió un error al procesar la orden. Por favor, intenta nuevamente.');
    });
}

// Cargar productos al cargar la página
document.addEventListener("DOMContentLoaded", loadProducts);
