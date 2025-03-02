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
  
          // Descripción
          const descCell = document.createElement("td");
          descCell.textContent = product.description;
          row.appendChild(descCell);
  
          // Precio
          const priceCell = document.createElement("td");
          priceCell.textContent = product.price;
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
    const data = {
      name: document.getElementById("pname").value,
      description: document.getElementById("pdescription").value,
      price: parseFloat(document.getElementById("pprice").value),
    };
  
    fetch("http://192.168.100.3:5003/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error creating product");
        }
        return response.json();
      })
      .then(result => {
        console.log("Product created:", result);
        // Podrías recargar la lista o redirigir
        getProducts();
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
  
  // 3. Actualizar un producto (PUT)
  function updateProduct() {
    const productId = document.getElementById("product-id").value;
    const data = {
      name: document.getElementById("pname").value,
      description: document.getElementById("pdescription").value,
      price: parseFloat(document.getElementById("pprice").value),
    };
  
    fetch(`http://192.168.100.3:5003/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error updating product");
        }
        return response.json();
      })
      .then(result => {
        console.log("Product updated:", result);
        // Podrías redirigir a /products o mostrar mensaje
        window.location.href = "/products";
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
  
  // 4. Eliminar un producto (DELETE)
  function deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
      fetch(`http://192.168.100.3:5003/api/products/${productId}`, {
        method: "DELETE",
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Error deleting product");
          }
          return response.json();
        })
        .then(result => {
          console.log("Product deleted:", result);
          // Vuelve a cargar la lista
          getProducts();
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }
  }
  
  function orderProducts() {
    // Obtener los productos seleccionados y sus cantidades
    const selectedProducts = [];
    const productRows = document.querySelectorAll('#product-list tbody tr');
    productRows.forEach(row => {
      const quantityInput = row.querySelector('input[type="text"]');
      const quantity = parseInt(quantityInput.value);
      if (quantity > 0) {
        //const productId = row.id.split('-')[1]; // Extraer el ID del producto del atributo id de la fila
        //
        var productId = row.querySelector('td:nth-child(1)').textContent;
        //const productId = row.id.textContent; // Extraer el ID del producto del atributo id de la fila
        selectedProducts.push({ id: productId, quantity });
      }
    });
  
    // Si no hay productos seleccionados, mostrar un mensaje de error
    if (selectedProducts.length === 0) {
      alert('Por favor, selecciona al menos un producto para realizar la orden.');
      return;
    }
  
    // Preparar los datos de la orden
    const orderData = {
      user: {
        name: sessionStorage.getItem('username'),
        email: sessionStorage.getItem('email')
      },
      products: selectedProducts
    };
  
    // Enviar los datos de la orden al endpoint
    fetch('http://192.168.100.3:5004/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Orden creada exitosamente') {
        console.log('Orden creada exitosamente!');
        // Mostrar un mensaje de confirmación al usuario
        alert('¡Orden creada exitosamente!');
        // Actualizar la interfaz de usuario para reflejar los cambios (opcional)
      } else {
        console.error('Error al crear la orden:', data.message);
        // Mostrar un mensaje de error al usuario
        alert('Error al crear la orden. Por favor, intenta nuevamente.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Ocurrió un error al procesar la orden. Por favor, intenta nuevamente.');
    });
  }
  