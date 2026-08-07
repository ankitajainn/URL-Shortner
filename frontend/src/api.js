const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://url-shortner-la4f.onrender.com'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    throw new ApiError(
      'Could not reach the server. The backend may be waking up from sleep — try again in a few seconds.',
      0
    )
  }

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.error?.message || (typeof data.error === 'string' ? data.error : null))) ||
      `Request failed with status ${res.status}`
    throw new ApiError(message, res.status)
  }

  return data
}

export const api = {
  base: API_BASE,
  signup: (payload) => request('/user/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/user/login', { method: 'POST', body: payload }),
  getCodes: (token) => request('/codes', { token }),
  shorten: (payload, token) => request('/shorten', { method: 'POST', body: payload, token }),
  deleteCode: (id, token) => request(`/${id}`, { method: 'DELETE', token }),
}

export { ApiError }
