

const API_BASE_URL = '/api';

function buildError(details) {
  const error = new Error(details.message || 'Error en la solicitud');
  error.status = details.status;
  error.path = details.path;
  error.cause = details.cause;
  error.errors = details.errors;
  return error;
}

// Token helpers (solo en cliente)
const TOKEN_STORAGE_KEY = 'auth_token';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  if (!token) {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } else {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}

export async function fetchApi(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
      signal: controller.signal,
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');

    if (!res.ok) {
      const body = isJson ? await res.json().catch(() => null) : null;
      throw buildError({
        message:
          body?.message ||
          body?.error ||
          `Error al solicitar ${path}: ${res.status} ${res.statusText}`,
        status: res.status,
        path,
        errors: body?.errors,
        cause: body,
      });
    }

    if (res.status === 204) return null;
    if (isJson) return await res.json();
    return await res.text();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw buildError({
        message: 'La solicitud excedió el tiempo de espera. Inténtalo nuevamente.',
        status: 408,
        path,
      });
    }
    if (err.status) throw err;
    throw buildError({ message: 'No se pudo conectar con el servidor.', path, cause: err });
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getCategories() {
  return fetchApi('/categories');
}

export function getBooks() {
  return fetchApi('/books');
}

export function getBook(bookId) {
  return fetchApi(`/books/${bookId}`);
}

export function getBooksByCategory(catId) {
  return fetchApi(`/books/category/${catId}`);
}

export function updateBook(bookId, updateData) {
  return fetchApi(`/books/${bookId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
}

export function login(loginData) {
  return fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify(loginData),
  }).then((result) => {
    const token = typeof result === 'string' ? result : result?.token;
    if (!token) return result;
    setToken(token);
    return token;
  });
}
