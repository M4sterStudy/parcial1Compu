// frontend/web/static/scriptProducts.js

// 1. Obtener todos los productos (GET)
function getProducts() {
  fetch("http://192.168.100.3:5003/api/products")
    .then(response => response.json())
    .then(data => {
      console.log(data);

      // Seleccionar el <tbody> de la tabla
      const productListBody = document.querySelector("#product-list tbody");
      productListBody.innerHTML = ""; // Limpiar registros previos

      // Llenar la tabla con los productos
      data.forEach(product => {
        const row = document.createElement("tr");

        // Nombre
        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;
        row.appendChild(nameCell);

        // Cantidad (amount)
        const amountCell = document.createElement("td");
        amountCell.textContent = product.amount;
        row.appendChild(amountCell);

        // Precio
        const priceCell = document.createElement("td");
        priceCell.textContent = product.price.toFixed(2);
        row.appendChild(priceCell);

        // Acciones (Editar, Eliminar)
        const actionsCell = document.createElement("td");

        // Edit link
        const editLink = document.createElement("a");
        editLink.href = `/editProduct/${product.id}`;
        editLink.textContent = "Edit";
        editLink.className = "btn btn-primary mr-2";
        actionsCell.appendChild(editLink);

        // Delete link
        const deleteLink = document.createElement("a");
        deleteLink.href = "#";
        deleteLink.textContent = "Delete";
        deleteLink.className = "btn btn-danger";
        deleteLink.addEventListener("click", function () {
          deleteProduct(product.id);
        });
        actionsCell.appendChild(deleteLink);

        row.appendChild(actionsCell);

        productListBody.appendChild(row);
      });
    })
    .catch(error => console.error("Error:", error));
}

// 2. Crear un nuevo producto (POST)
function createProduct() {
  const pnameElement = document.getElementById("pname");
  const pamountElement = document.getElementById("pamount");
  const ppriceElement = document.getElementById("pprice");

  if (!pnameElement || !pamountElement || !ppriceElement) {
      console.error("Error: Uno o más elementos del formulario no fueron encontrados.");
      return;
  }

  const pname = pnameElement.value.trim();
  const pamount = parseInt(pamountElement.value, 10) || 0;
  const pprice = parseFloat(ppriceElement.value) || 0.0;

  if (!pname || isNaN(pamount) || isNaN(pprice)) {
      alert("Todos los campos son obligatorios y deben tener valores válidos.");
      return;
  }

  fetch("http://192.168.100.3:5003/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: pname, amount: pamount, price: pprice }),
  })
  .then(response => response.json())
  .then(result => {
      console.log("Product created:", result);
      alert("Producto creado correctamente.");
      window.location.reload();
  })
  .catch(error => console.error("Error al crear producto:", error));
}

// 3. Actualizar un producto (PUT)
function updateProduct() {
  const productId = document.getElementById("product-id").value;
  const pname = document.getElementById("pname").value.trim();
  const pamount = parseInt(document.getElementById("pamount").value, 10) || 0;
  const pprice = parseFloat(document.getElementById("pprice").value) || 0.0;

  if (!pname || isNaN(pamount) || isNaN(pprice)) {
      alert("Todos los campos son obligatorios y deben tener valores válidos.");
      return;
  }

  fetch(`http://192.168.100.3:5003/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: pname, amount: pamount, price: pprice }),
  })
  .then(response => response.json())
  .then(result => {
      console.log("Product updated:", result);
      window.location.href = "/products";
  })
  .catch(error => console.error("Error:", error));
}

// 4. Eliminar un producto (DELETE)
function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
      fetch(`http://192.168.100.3:5003/api/products/${productId}`, { method: "DELETE" })
      .then(response => response.json())
      .then(result => {
          console.log("Product deleted:", result);
          getProducts();
      })
      .catch(error => console.error("Error:", error));
  }
}

// 5. Crear una orden con los productos seleccionados
function orderProducts() {
  const selectedProducts = [];
  const productRows = document.querySelectorAll('#product-list tbody tr');

  productRows.forEach(row => {
      const quantityInput = row.querySelector('input[type="number"]');
      const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 0;
      if (quantity > 0) {
          const productId = row.querySelector('td:nth-child(1)').textContent;
          selectedProducts.push({ id: productId, quantity });
      }
  });

  if (selectedProducts.length === 0) {
      alert('Por favor, selecciona al menos un producto para realizar la orden.');
      return;
  }

  const username = sessionStorage.getItem('username');
  const email = sessionStorage.getItem('email');

  if (!username || !email) {
      alert('Error: No hay un usuario autenticado. Inicia sesión nuevamente.');
      return;
  }

  const orderData = {
      user: { name: username, email: email },
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
          alert('¡Orden creada exitosamente!');
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
