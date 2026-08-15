const API_BASE_URL = 'http://localhost:8080/api/v1';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || (errorData.errors 
      ? JSON.stringify(errorData.errors) 
      : `Error HTTP: ${response.status}`);
    throw new Error(message);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

// Categorías
export async function getCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  return handleResponse(res);
}

export async function createCategory(data) {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

// Productos
export async function getProducts(search = '') {
  const url = search ? `${API_BASE_URL}/products?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/products`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function createProduct(data) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateProduct(id, data) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

// Proveedores
export async function getSuppliers() {
  const res = await fetch(`${API_BASE_URL}/suppliers`);
  return handleResponse(res);
}

export async function createSupplier(data) {
  const res = await fetch(`${API_BASE_URL}/suppliers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteSupplier(id) {
  const res = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

// Movimientos de Inventario
export async function getMovements() {
  const res = await fetch(`${API_BASE_URL}/movements`);
  return handleResponse(res);
}

export async function createMovement(data) {
  const res = await fetch(`${API_BASE_URL}/movements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
